from fastapi_jwt_auth import AuthJWT
from fastapi import Depends, HTTPException, Request
from starlette.middleware.base import BaseHTTPMiddleware

class RedirectIfAuthenticatedMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        auth_jwt = AuthJWT()
        try:
            auth_jwt.jwt_required()
            # Пользователь уже аутентифицирован
            return HTTPException(status_code=302, detail="Redirect to home")
        except:
            pass  # Пользователь не аутентифицирован
        return await call_next(request)
