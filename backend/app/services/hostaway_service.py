import os
import json
import requests
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=env_path)

API_URL = os.getenv("HOSTAWAY_API_URL")
API_KEY = os.getenv("HOSTAWAY_API_KEY")
ACCOUNT_ID = os.getenv("HOSTAWAY_ACCOUNT_ID")

def get_live_reviews():
    """Fetch reviews directly from Hostaway API"""
    headers = {"Authorization": f"Bearer {API_KEY}"}
    params = {"accountId": ACCOUNT_ID}

    try:
        response = requests.get(API_URL, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()

        reviews = []
        for r in data.get("result", []):
            avg = sum(c["rating"] for c in r.get("reviewCategory", [])) / len(r.get("reviewCategory", [])) or 0
            reviews.append({
                "id": r["id"],
                "listing": r.get("listingName", "N/A"),
                "guest": r["guestName"],
                "avg_rating": round(avg, 1),
                "categories": [
                    {"name": c["category"], "rating": c["rating"]}
                    for c in r.get("reviewCategory", [])
                ],
                "review_text": r["publicReview"],
                "submitted_at": r["submittedAt"]
            })
        return reviews

    except Exception as e:
        print("⚠️ Error fetching live reviews:", e)
        return get_mock_reviews()  # fallback

def get_mock_reviews():
    """Read mock reviews JSON"""
    data_path = Path(__file__).resolve().parents[1] / "data/mock_reviews.json"
    with open(data_path) as f:
        raw = json.load(f)

    # Handles both formats: either {"reviews": [...]} or [...] directly
    if isinstance(raw, dict) and "reviews" in raw:
        return raw["reviews"]
    return raw

