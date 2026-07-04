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
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------
# CONFIG
# ------------------------------
PAYSTACK_SECRET_KEY = os.getenv("PAYSTACK_SECRET_KEY")

SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-dev-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "saint2026")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Hash admin password
if len(ADMIN_PASSWORD.encode("utf-8")) > 72:
    ADMIN_PASSWORD = ADMIN_PASSWORD[:72]

ADMIN_PASSWORD_HASH = pwd_context.hash(ADMIN_PASSWORD)

# ------------------------------
# SCHEMAS
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


class StatusUpdate(BaseModel):
    status: str


# ------------------------------
# AUTH HELPERS
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
# BASIC ROUTE
# ------------------------------
@app.get("/")
def root():
    return {"message": "SAINT Backend Running"}


# ------------------------------
# ADMIN LOGIN
# ------------------------------
@app.post("/admin/login")
def admin_login(data: dict):
    password = data.get("password")

    if not password:
        raise HTTPException(status_code=400, detail="Password required")

    if not pwd_context.verify(password, ADMIN_PASSWORD_HASH):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(data={"sub": ADMIN_USERNAME})

    return {"access_token": token}


# ------------------------------
# INITIALIZE PAYMENT
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
# VERIFY PAYMENT (NEW)
# ------------------------------
@app.get("/verify-payment/{reference}")
def verify_payment(reference: str):
    headers = {
        "Authorization": f"Bearer {PAYSTACK_SECRET_KEY}",
    }

    response = requests.get(
        f"https://api.paystack.co/transaction/verify/{reference}",
        headers=headers,
    )

    return response.json()


# ------------------------------
# CREATE ORDER (USED BY SUCCESS PAGE)
# ------------------------------
@app.post("/create-order")
def create_order(data: dict, db: Session = Depends(get_db)):
    new_order = Order(
        full_name=data.get("full_name"),
        email=data.get("email"),
        phone=data.get("phone"),
        address=data.get("address"),
        amount=data.get("amount"),
        payment_reference=data.get("reference"),
        status="paid",
    )

    db.add(new_order)
    db.commit()

    return {"message": "Order created"}


# ------------------------------
# GET ORDERS (ADMIN)
# ------------------------------
@app.get("/orders", response_model=List[OrderResponse])
def get_orders(
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    return db.query(Order).order_by(Order.id.desc()).all()


# ------------------------------
# UPDATE ORDER STATUS (FIXED)
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
    data: StatusUpdate,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    if data.status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status")

    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = data.status
    db.commit()

    return {"message": "Order updated"}


# ------------------------------
# ANALYTICS
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

    return {
        "total_revenue": total_revenue,
        "total_orders": total_orders,
        "orders_today": orders_today,
    }


# ------------------------------
# PRODUCTS
# ------------------------------
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


# ------------------------------
# UPLOADS
# ------------------------------
@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    file_location = f"uploads/{file.filename}"

    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"image_url": f"http://127.0.0.1:8000/uploads/{file.filename}"}


from fastapi.staticfiles import StaticFiles

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")