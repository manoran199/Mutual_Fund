from celery import Celery
import requests
from sqlalchemy.orm import Session
import models, database

celery = Celery("tasks", broker="redis://localhost:6379/0")

@celery.task
def fetch_fund_updates():
    db = database.SessionLocal()
    funds = db.query(models.MutualFund).all()
    for fund in funds:
        response = requests.get(f"https://api.mutualfunds.com/fund/{fund.id}")
        if response.status_code == 200:
            fund_data = response.json()
            fund.current_value = fund_data["current_price"]
            db.commit()
    db.close()
