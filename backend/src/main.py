from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
import os

from .routers import auth, crypto, trading, watchlist, notifications, support
from .core.config import settings
from .database.database import engine
from .database import models

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Crypto Trading Platform API",
    description="A comprehensive crypto trading platform backend",
    version="1.0.0",
    docs_url="/docs" if settings.ENVIRONMENT == "development" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT == "development" else None,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(crypto.router, prefix="/api/crypto", tags=["cryptocurrency"])
app.include_router(trading.router, prefix="/api/trading", tags=["trading"])
app.include_router(watchlist.router, prefix="/api/watchlist", tags=["watchlist"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["notifications"])
app.include_router(support.router, prefix="/api/support", tags=["support"])

@app.get("/")
async def root():
    return {"message": "Crypto Trading Platform API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "environment": settings.ENVIRONMENT}

# AWS Lambda handler
handler = Mangum(app)