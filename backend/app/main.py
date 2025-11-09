from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import reviews

app = FastAPI(title="FlexLiving Reviews API")

origins = [
    "http://localhost:5173",  # local frontend
    "https://flexliving-reviews-dashboard-zg9s.onrender.com",  # Render frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# temporary test route
@app.get("/test")
def test():
    return {"message": "router check passed"}

app.include_router(reviews.router, prefix="/api/reviews", tags=["Reviews"])

@app.get("/")
def root():
    return {"message": "FlexLiving Reviews API running 🚀"}
