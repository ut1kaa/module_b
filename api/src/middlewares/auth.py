from fastapi_jwt_auth import AuthJWT
from fastapi import Depends, HTTPException, Request
from starlette.middleware.base import BaseHTTPMiddleware

# class AuthenticateMiddleware(BaseHTTPMiddleware):
#     async def dispatch(self, request: Request, call_next):
#         try:
#             auth_jwt = AuthJWT()
#             auth_jwt.jwt_required()
#         except Exception:
#             return HTTPException(status_code=401, detail="Not authenticated")
#         response = await call_next(request)
#         return response

async def authenticate(Authorize: AuthJWT = Depends()):
    try:
        Authorize.jwt_required()
    except Exception:
        raise HTTPException(status_code=401, detail="Not authenticated")
