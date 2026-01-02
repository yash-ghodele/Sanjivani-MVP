from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import auth, credentials
import os
import json

# Initialize Firebase Admin
# In production, this should be handled at startup/lifespan
cred_path = os.getenv("FIREBASE_CREDENTIALS", "serviceAccountKey.json")

try:
    if not firebase_admin._apps:
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            print(f"✅ Firebase Admin initialized with {cred_path}")
        else:
            print("⚠️ connection to Firebase Identity failed: Credentials not found. Auth will be MOCKED.")
except Exception as e:
    print(f"❌ Firebase Admin init failed: {e}")

security = HTTPBearer()

async def get_current_user(token: HTTPAuthorizationCredentials = Depends(security)):
    """
    Verify Firebase ID Token
    """
    # 1. Handle Demo/Mock Token explicitly (works even if Firebase is initialized)
    if token.credentials == "mock-token":
        return {
            "uid": "demo_user",
            "email": "demo@example.com",
            "name": "Demo User",
            "picture": None
        }

    # 2. Handle missing credentials (backend not configured)
    if not firebase_admin._apps:
        # Allow any token if backend isn't set up yet
        return {"uid": "mock_user", "email": "mock@example.com"}

    try:
        decoded_token = auth.verify_id_token(token.credentials)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_optional_user(token: HTTPAuthorizationCredentials = Depends(security)):
    """
    Optional Auth - returns None if no token or invalid, 
    but doesn't raise error (for public endpoints with user-specific enhancements)
    """
    # Simply reusing get_current_user logic but suppressing errors is one way,
    # but HTTPBearer will raise 403 if header missing? 
    # Actually HTTPBearer(auto_error=False) handles missing header.
    pass

security_optional = HTTPBearer(auto_error=False)

async def get_current_user_optional(token: HTTPAuthorizationCredentials = Depends(security_optional)):
    if not token:
        return None
    
    return await get_current_user(token)
