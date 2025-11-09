from fastapi import APIRouter
from app.services.hostaway_service import get_live_reviews
from app.core.event_publisher import publish_event

router = APIRouter()

@router.get("/", summary="Fetch Hostaway reviews")
def fetch_reviews():
    reviews_data = get_live_reviews()
    publish_event("reviews_fetched", {"count": len(reviews_data)})

    # if the result has a 'result' key, flatten it
    if isinstance(reviews_data, dict) and "result" in reviews_data:
        reviews_data = reviews_data["result"]

    # Convert Hostaway’s structure to your frontend’s expected format
    reviews = []
    for r in reviews_data:
        avg = (
            sum(c["rating"] for c in r.get("reviewCategory", []))
            / len(r.get("reviewCategory", []))
            if r.get("reviewCategory")
            else 0
        )
        reviews.append(
            {
                "id": r["id"],
                "listing": r["listingName"],
                "guest": r["guestName"],
                "avg_rating": round(avg, 1),
                "review_text": r["publicReview"],
                "sentiment": "Positive" if avg >= 8 else "Neutral" if avg >= 6 else "Negative",
                "submitted_at": r["submittedAt"],
            }
        )

    return {"status": "success", "reviews": reviews}
