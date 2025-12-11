from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from config import settings

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Validates the Bearer token sent from React using Supabase JWT.
    Works for both email/password and OAuth authentication.
    
    Supports new Supabase JWT format (asymmetric keys) and legacy format.
    The JWT secret from Supabase Dashboard is used for verification.
    
    Note: For production, consider migrating to JWKS endpoint for asymmetric key verification:
    https://<project>.supabase.co/auth/v1/.well-known/jwks.json
    """
    token = credentials.credentials
    
    if not settings.supabase_jwt_secret:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="JWT secret not configured. Get it from Supabase Dashboard -> Project Settings -> API -> JWT Secret"
        )
    
    try:
        # Decode the token using the JWT secret
        # This works with both new and legacy JWT formats
        payload = jwt.decode(
            token,
            settings.supabase_jwt_secret,
            algorithms=["HS256"],
            audience="authenticated"  # Supabase uses this audience by default
        )
        return payload  # Returns the user data (uuid in 'sub', email, etc.)
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}"
        )

