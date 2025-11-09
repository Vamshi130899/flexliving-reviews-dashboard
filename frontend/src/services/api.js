const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://127.0.0.1:8000"
    : "https://flexliving-backend-x1wz.onrender.com"; // Render backend URL

export const fetchReviews = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/reviews/`);
    const data = await response.json();
    return data.reviews || [];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};
