from fastapi import FastAPI, Request, Header, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from dotenv import load_dotenv
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel
from io import StringIO

from database import engine, SessionLocal, get_db
from models import Base, Order, Product

import hashlib
import hmac
import requests
import os
import csv
import shutil

# ------------------------------
# Load environment variables
# ------------------------------
load_dotenv()

app = FastAPI()

Base.metadata.create_all(bind=engine)

# ------------------------------
# CORS
# ------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------
# Paystack
# ------------------------------
PAYSTACK_SECRET_KEY = os.getenv("PAYSTACK_SECRET_KEY")

# ------------------------------
# JWT CONFIG
# ------------------------------
SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-dev-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "saint2026")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Hash only once at startup
if len(ADMIN_PASSWORD.encode("utf-8")) > 72:
    ADMIN_PASSWORD = ADMIN_PASSWORD[:72]

ADMIN_PASSWORD_HASH = pwd_context.hash(ADMIN_PASSWORD)

# ------------------------------
# Pydantic Schema
# ------------------------------
class OrderResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str
    address: str
    amount: float
    payment_reference: Optional[str]
    status: str
    created_at: datetime

    class Config:
        orm_mode = True

from typing import Optional

class ProductCreate(BaseModel):
    name: str
    price: float
    description: str
    image: str
    image2: Optional[str] = None
    stock: int


class ProductResponse(BaseModel):
    id: int
    name: str
    price: float
    description: str
    image: str
    image2: Optional[str]
    stock: int

    class Config:
        orm_mode = True

# ------------------------------
# Auth helpers
# ------------------------------
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")

        if username != ADMIN_USERNAME:
            raise HTTPException(status_code=401, detail="Unauthorized")

    except JWTError:
        raise HTTPException(status_code=401, detail="Unauthorized")


# ------------------------------
# Routes
# ------------------------------
@app.get("/")
def root():
    return {"message": "SAINT Backend Running"}


# ------------------------------
# Admin Login
# ------------------------------
@app.post("/admin/login")
def admin_login(data: dict):
    password = data.get("password")

    if not password:
        raise HTTPException(status_code=400, detail="Password is required")

    if not pwd_context.verify(password, ADMIN_PASSWORD_HASH):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(data={"sub": ADMIN_USERNAME})

    return {"access_token": token}


# ------------------------------
# Initialize Payment
# ------------------------------
@app.post("/initialize-payment")
async def initialize_payment(request: Request):
    data = await request.json()

    cart = data.get("cart", [])
    customer = data.get("customer", {})

    total_amount = sum(item["price"] * item["quantity"] for item in cart)

    payload = {
        "email": customer.get("email"),
        "amount": total_amount * 100,
        "currency": "KES",
        "callback_url": "http://localhost:5173/success",
        "metadata": {
            "customer": customer,
            "cart": cart,
        },
    }

    headers = {
        "Authorization": f"Bearer {PAYSTACK_SECRET_KEY}",
        "Content-Type": "application/json",
    }

    response = requests.post(
        "https://api.paystack.co/transaction/initialize",
        json=payload,
        headers=headers,
    )

    return response.json()


# ------------------------------
# Paystack Webhook
# ------------------------------
@app.post("/paystack-webhook")
async def paystack_webhook(
    request: Request,
    x_paystack_signature: str = Header(None),
):
    if x_paystack_signature is None:
        raise HTTPException(status_code=400, detail="Missing signature")

    raw_body = await request.body()

    computed_hash = hmac.new(
        PAYSTACK_SECRET_KEY.encode("utf-8"),
        raw_body,
        hashlib.sha512,
    ).hexdigest()

    if computed_hash != x_paystack_signature:
        raise HTTPException(status_code=400, detail="Invalid signature")

    payload = await request.json()

    if payload.get("event") == "charge.success":
        data = payload.get("data", {})
        metadata = data.get("metadata", {})
        customer = metadata.get("customer", {})

        db: Session = SessionLocal()

        new_order = Order(
            full_name=customer.get("full_name"),
            email=data.get("customer", {}).get("email"),
            phone=customer.get("phone"),
            address=customer.get("address"),
            amount=data.get("amount", 0) / 100,
            payment_reference=data.get("reference"),
            status="paid",
        )

        db.add(new_order)
        db.commit()
        db.close()

    return {"status": "received"}


# ------------------------------
# Get Orders (FIXED)
# ------------------------------
@app.get("/orders", response_model=List[OrderResponse])
def get_orders(
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    orders = db.query(Order).order_by(Order.id.desc()).all()
    return orders


# ------------------------------
# Update Order Status
# ------------------------------
VALID_STATUSES = [
    "pending",
    "paid",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
]


@app.patch("/orders/{order_id}")
def update_order_status(
    order_id: int,
    status: str,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    if status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status")

    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = status
    db.commit()
    db.refresh(order)

    return {"message": "Order updated"}


# ------------------------------
# Analytics
# ------------------------------
@app.get("/admin/analytics")
def get_admin_analytics(
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    total_revenue = db.query(func.sum(Order.amount)).scalar() or 0
    total_orders = db.query(Order).count()

    today = datetime.today().date()

    orders_today = db.query(Order).filter(
        func.date(Order.created_at) == today
    ).count()

    pending_orders = db.query(Order).filter(Order.status == "pending").count()
    shipped_orders = db.query(Order).filter(Order.status == "shipped").count()
    delivered_orders = db.query(Order).filter(Order.status == "delivered").count()

    monthly_data = (
        db.query(
            func.strftime("%m", Order.created_at),
            func.sum(Order.amount),
        )
        .group_by(func.strftime("%m", Order.created_at))
        .all()
    )

    monthly_revenue = {month: revenue for month, revenue in monthly_data}

    return {
        "total_revenue": total_revenue,
        "total_orders": total_orders,
        "orders_today": orders_today,
        "pending_orders": pending_orders,
        "shipped_orders": shipped_orders,
        "delivered_orders": delivered_orders,
        "monthly_revenue": monthly_revenue,
    }


# ------------------------------
# CSV Export
# ------------------------------
@app.get("/admin/export-orders")
def export_orders(
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    orders = db.query(Order).all()

    output = StringIO()
    writer = csv.writer(output)

    writer.writerow([
        "ID",
        "Full Name",
        "Email",
        "Phone",
        "Address",
        "Amount",
        "Status",
        "Created At",
    ])

    for order in orders:
        writer.writerow([
            order.id,
            order.full_name,
            order.email,
            order.phone,
            order.address,
            order.amount,
            order.status,
            order.created_at,
        ])

    output.seek(0)

    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=orders.csv"},
    )


@app.post("/admin/products", response_model=ProductResponse)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):

    new_product = Product(**product.dict())

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


@app.get("/products", response_model=List[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).order_by(Product.id.desc()).all()

@app.get("/products/{product_id}", response_model=ProductResponse)
def get_single_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product


@app.put("/admin/products/{product_id}")
def update_product(
    product_id: int,
    product: ProductCreate,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):

    db_product = db.query(Product).filter(Product.id == product_id).first()

    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    for key, value in product.dict().items():
        setattr(db_product, key, value)

    db.commit()
    db.refresh(db_product)

    return db_product


@app.delete("/admin/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):

    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()

    return {"message": "Product deleted"}


@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    file_location = f"uploads/{file.filename}"

    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"image_url": f"http://127.0.0.1:8000/uploads/{file.filename}"}

from fastapi.staticfiles import StaticFiles

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")