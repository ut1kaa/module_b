import asyncio
import logging
from pydantic import BaseModel
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_jwt_auth import AuthJWT
from .settings import SettingsJWT
# from .middlewares import AuthenticateMiddleware, RedirectIfAuthenticatedMiddleware
from .api.rest import AuthRouter, FilesRouter

LOGGER = logging.getLogger(__name__)

@AuthJWT.load_config
def get_config():
    return SettingsJWT()

def configure_logging():
    LOGGER.setLevel(logging.INFO)
    handler = logging.StreamHandler()
    formatter = logging.Formatter("%(asctime)s %(levelname)-8s %(message)s")
    handler.setFormatter(formatter)
    LOGGER.addHandler(handler)
    LOGGER.info("Logger is set up!")


def configure_app(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
        allow_credentials=True,
    )
    # app.add_middleware(AuthenticateMiddleware)
    # app.add_middleware(RedirectIfAuthenticatedMiddleware)


    app.include_router(AuthRouter)
    app.include_router(FilesRouter)



def run_server(app: FastAPI):
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="debug")


def handle_exception(loop, context):
    LOGGER.error("Uncaught exception", exc_info=context["exc_info"])
    loop.stop()


def main():
    app = FastAPI()
    
    configure_logging()
    configure_app(app)
    
    asyncio.run(run_server(app))


if __name__ == '__main__':
    main()