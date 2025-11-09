from pydantic import BaseModel
from typing import List

class ReviewCategory(BaseModel):
    name: str
    rating: int

class Review(BaseModel):
    id: int
    listing: str
    guest: str
    avg_rating: float
    categories: List[ReviewCategory]
    review_text: str
    submitted_at: str
