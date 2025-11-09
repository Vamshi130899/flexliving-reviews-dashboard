import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/reviews"; // FastAPI backend URL

export const fetchReviews = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data.reviews; // assuming { status, reviews } from backend
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};
