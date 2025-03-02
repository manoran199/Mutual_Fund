from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    portfolios = relationship("Portfolio", back_populates="user")


class MutualFund(Base):
    __tablename__ = "mutual_funds"
    
    id = Column(Integer, primary_key=True, index=True)
    fund_name = Column(String, index=True)
    fund_family = Column(String, index=True)
    current_value = Column(Float)


class Portfolio(Base):
    __tablename__ = "portfolios"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    fund_id = Column(Integer, ForeignKey("mutual_funds.id"))
    units = Column(Float)
    investment_value = Column(Float)
    last_updated = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="portfolios")
    fund = relationship("MutualFund")
