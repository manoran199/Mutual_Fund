from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models, database, auth
from pydantic import BaseModel
from typing import List
import requests
from celery_tasks import fetch_fund_updates

app = FastAPI()

models.Base.metadata.create_all(bind=database.engine)

# Pydantic Schemas
class UserCreate(BaseModel):
    email: str
    password: str

class FundSelection(BaseModel):
    fund_family: str

class Investment(BaseModel):
    fund_id: int
    units: float

# Dependency to get DB session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register/")
def register(user: UserCreate, db: Session = Depends(get_db)):
    hashed_password = auth.hash_password(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    return {"message": "User created successfully"}

@app.post("/login/")
def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    token = auth.create_access_token({"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/funds/")
def get_funds(fund_selection: FundSelection):
    """Fetch funds from external API"""
    response = requests.get(f"https://api.mutualfunds.com/funds?family={fund_selection.fund_family}")
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Invalid fund family")
    return response.json()

@app.post("/invest/")
def invest(investment: Investment, user_id: int, db: Session = Depends(get_db)):
    fund = db.query(models.MutualFund).filter(models.MutualFund.id == investment.fund_id).first()
    if not fund:
        raise HTTPException(status_code=404, detail="Fund not found")
    
    portfolio = models.Portfolio(user_id=user_id, fund_id=fund.id, units=investment.units, investment_value=fund.current_value * investment.units)
    db.add(portfolio)
    db.commit()
    return {"message": "Investment added"}

@app.get("/portfolio/")
def view_portfolio(user_id: int, db: Session = Depends(get_db)):
    portfolio = db.query(models.Portfolio).filter(models.Portfolio.user_id == user_id).all()
    return portfolio

@app.get("/update_funds/")
def update_funds():
    fetch_fund_updates.delay()
    return {"message": "Fund updates triggered"}
