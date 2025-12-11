from fastapi import APIRouter, Depends
from app.utils.authentication import verify_token

router = APIRouter()


@router.get("/me")
async def get_current_user(user_payload: dict = Depends(verify_token)):
    """
    Get current authenticated user information.
    Works for both email/password and OAuth authentication.
    """
    return {
        "user_id": user_payload.get("sub"),
        "email": user_payload.get("email"),
        "message": "You are authorized!"
    }

