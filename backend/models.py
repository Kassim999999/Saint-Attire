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
