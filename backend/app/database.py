import os
from typing import Generator

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Load environment variables from .env at startup
load_dotenv()

# Direct connection to Supabase Postgres (port 5432) with SSL required
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_CONNECTION_STRING","")
if SQLALCHEMY_DATABASE_URL is None:
    raise RuntimeError(
        f"Database configuration incomplete. Missing:. "
        "Ensure .env is populated with USER, PASSWORD, HOST, PORT, DBNAME."
    )

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"sslmode": "require"},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db() -> Generator:
    """FastAPI dependency to provide a scoped DB session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

