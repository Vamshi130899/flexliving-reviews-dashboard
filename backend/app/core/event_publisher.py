import json
import os

def publish_event(event_name: str, payload: dict):
    """Mock AWS SNS/EventBridge publishing."""
    if os.getenv("AWS_ENV") == "local" or not os.getenv("AWS_ENV"):
        print(f"📡 Event published: {event_name} → {payload}")
    else:
        # Placeholder for actual SNS publishing
        print(f"Would publish {event_name} to AWS SNS/EventBridge.")
