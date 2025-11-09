import React, { useState, useEffect } from "react";
import Filters from "./components/Filters";
import ReviewTable from "./components/ReviewTable";
import TrendChart from "./components/TrendChart";
import SentimentChart from "./components/SentimentChart";
import { fetchReviews } from "./services/api";

function App() {
  const [reviews, setReviews] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // Load Theme Preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Toggling Implementation
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Fetch Reviews
  useEffect(() => {
    const load = async () => {
      const data = await fetchReviews();
      const safeData = data.map((r) => ({
        ...r,
        sentiment: r.sentiment || "Neutral",
      }));
      setReviews(safeData);
      setFiltered(safeData);
    };
    load();
  }, []);

  // Filter Logic 
  const handleFilterChange = (listing) => {
    if (!listing) setFiltered(reviews);
    else setFiltered(reviews.filter((r) => r.listing === listing));
  };

  // Metrics 
  const avgRating =
    filtered.length > 0
      ? (
          filtered.reduce((sum, r) => sum + (r.avg_rating || 0), 0) /
          filtered.length
        ).toFixed(1)
      : 0;

  const totalPositive = filtered.filter((r) => r.sentiment === "Positive").length;
  const totalNegative = filtered.filter((r) => r.sentiment === "Negative").length;
  const totalNeutral = filtered.filter((r) => r.sentiment === "Neutral").length;

  const sentimentTrend =
    totalPositive > totalNegative
      ? "📈 Overall Positive"
      : totalNegative > totalPositive
      ? "📉 Needs Improvement"
      : "➡️ Balanced";

  const trend = (() => {
    if (filtered.length < 2) return "Stable";
    const sorted = [...filtered].sort(
      (a, b) => new Date(a.submitted_at) - new Date(b.submitted_at)
    );
    const change =
      sorted[sorted.length - 1].avg_rating - sorted[0].avg_rating;
    if (change > 0.5) return "📈 Improving";
    if (change < -0.5) return "📉 Declining";
    return "➡️ Stable";
  })();

  // UI for Rendering
  return (
    <div
      className={`max-w-7xl mx-auto p-6 font-sans min-h-screen transition-colors duration-500
        ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}
    >
      {/* Header Section */}
      <div
        className={`bg-gradient-to-r text-white py-6 rounded-xl shadow-lg mb-8 flex justify-between items-center px-6 transition-all duration-500
        ${
          darkMode
            ? "from-indigo-800 to-purple-900"
            : "from-sky-600 to-indigo-600"
        }`}
      >
        <div>
          <h1 className="text-3xl font-bold">FlexLiving Reviews Dashboard</h1>
          <p className="text-sky-100 text-sm mt-1">
            Data-driven insights into guest experience and sentiment trends
          </p>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-200
            dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-all"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* Filters */}
      <Filters onFilterChange={handleFilterChange} />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
        <div className="bg-blue-50 dark:bg-blue-900/40 p-4 rounded-lg text-center shadow">
          <h4 className="text-blue-700 dark:text-blue-300 font-semibold">
            Average Rating
          </h4>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">
            {avgRating}
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/40 p-4 rounded-lg text-center shadow">
          <h4 className="text-green-700 dark:text-green-300 font-semibold">
            Positive
          </h4>
          <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-2">
            {totalPositive}
          </p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/40 p-4 rounded-lg text-center shadow">
          <h4 className="text-yellow-700 dark:text-yellow-300 font-semibold">
            Neutral
          </h4>
          <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100 mt-2">
            {totalNeutral}
          </p>
        </div>

        <div className="bg-red-50 dark:bg-red-900/40 p-4 rounded-lg text-center shadow">
          <h4 className="text-red-700 dark:text-red-300 font-semibold">
            Negative
          </h4>
          <p className="text-3xl font-bold text-red-900 dark:text-red-100 mt-2">
            {totalNegative}
          </p>
        </div>
      </div>

      {/* Sentiment Summary */}
      <div className="text-center my-6 text-lg font-medium">
        <p>
          {sentimentTrend} | Rating Trend: {trend}
        </p>
      </div>

      {/* Reviews Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow mb-8 transition-colors duration-500">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2 dark:border-gray-700">
          Guest Reviews
        </h2>
        <ReviewTable reviews={filtered} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition-shadow">
          <TrendChart reviews={filtered} />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition-shadow">
          <SentimentChart reviews={filtered} />
        </div>
      </div>
    </div>
  );
}

export default App;
