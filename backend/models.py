from sqlalchemy import Column, Integer, String, Float, Date
from database import Base
from datetime import date

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String)        # "income" or "expense"
    amount = Column(Float)
    category = Column(String)
    date = Column(Date, default=date.today)
    note = Column(String, nullable=True)