import os
from typing import Generator

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Load environment variables from .env at startup
load_dotenv()

USER = os.getenv("USER")
PASSWORD = os.getenv("PASSWORD")
HOST = os.getenv("HOST")
PORT = os.getenv("PORT", "5432")
DBNAME = os.getenv("DBNAME", "postgres")

missing_env = [name for name, value in {
    "USER": USER,
    "PASSWORD": PASSWORD,
    "HOST": HOST,
    "PORT": PORT,
    "DBNAME": DBNAME,
}.items() if not value]

if missing_env:
    missing_str = ", ".join(missing_env)
    raise RuntimeError(
        f"Database configuration incomplete. Missing: {missing_str}. "
        "Ensure .env is populated with USER, PASSWORD, HOST, PORT, DBNAME."
    )

# Direct connection to Supabase Postgres (port 5432) with SSL required
SQLALCHEMY_DATABASE_URL = (
    f"postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}"
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

