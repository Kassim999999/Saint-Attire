from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String)
    email = Column(String)
    phone = Column(String)
    address = Column(String)
    amount = Column(Float)
    payment_reference = Column(String, nullable=True)
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)


from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    price = Column(Float)
    description = Column(String)
    image = Column(String, nullable=True)
    image2 = Column(String)
    stock = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)