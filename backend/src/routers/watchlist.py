from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_watchlist():
    """Get user watchlist"""
    return {"message": "Watchlist - to be implemented"}

@router.post("/")
async def add_to_watchlist():
    """Add coin to watchlist"""
    return {"message": "Add to watchlist - to be implemented"}