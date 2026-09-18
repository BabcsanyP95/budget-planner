from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine, get_db
import models
from pydantic import BaseModel
from datetime import date
from typing import Optional
from calendar import monthrange

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Schema ---
class TransactionCreate(BaseModel):
    type: str
    amount: float
    category: str
    date: date
    note: Optional[str] = None

# --- Routes ---
@app.get("/transactions")
def get_transactions(month: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Transaction)
    if month:
        year, m = month.split("-")
        year_int, m_int = int(year), int(m)
        last_day = monthrange(year_int, m_int)[1]
        query = query.filter(
            models.Transaction.date >= date(year_int, m_int, 1),
            models.Transaction.date <= date(year_int, m_int, last_day)
        )
    return query.all()

@app.post("/transactions")
def create_transaction(t: TransactionCreate, db: Session = Depends(get_db)):
    db_transaction = models.Transaction(**t.model_dump())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@app.delete("/transactions/{id}")
def delete_transaction(id: int, db: Session = Depends(get_db)):
    t = db.get(models.Transaction, id)
    if not t:
        raise HTTPException(status_code=404, detail="Transaction not found")
    db.delete(t)
    db.commit()
    return {"message": "Deleted"}

@app.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    transactions = db.query(models.Transaction).all()
    income = sum(t.amount for t in transactions if t.type == "income")
    expenses = sum(t.amount for t in transactions if t.type == "expense")
    return {
        "income": income,
        "expenses": expenses,
        "balance": income - expenses
    }