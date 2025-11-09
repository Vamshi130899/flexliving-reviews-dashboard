from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import reviews

app = FastAPI(title="FlexLiving Reviews API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(reviews.router, prefix="/api/reviews", tags=["Reviews"])

@app.get("/")
def root():
    return {"message": "FlexLiving Reviews API running 🚀"}
