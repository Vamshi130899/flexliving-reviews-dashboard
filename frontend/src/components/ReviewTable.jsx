import React, { useEffect, useState } from "react";
import { fetchReviews } from "../services/api";

const ReviewTable = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchReviews();
      setReviews(data);
    };
    loadData();
  }, []);

  return (
    <div className="p-8 bg-gradient-to-b from-sky-50 to-white rounded-2xl shadow-lg border border-gray-100">
      {/* ✅ Removed duplicate heading */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 shadow-sm rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-sky-100 text-gray-700 text-sm uppercase tracking-wider">
              <th className="border px-4 py-3 text-left">Listing</th>
              <th className="border px-4 py-3 text-left">Guest</th>
              <th className="border px-4 py-3 text-left">Avg Rating</th>
              <th className="border px-4 py-3 text-left">Review</th>
              <th className="border px-4 py-3 text-left">Sentiment</th>
              <th className="border px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {reviews.map((r) => (
              <tr
                key={r.id}
                className="hover:bg-sky-50 transition-colors duration-150"
              >
                <td className="border px-4 py-2 font-medium">{r.listing}</td>
                <td className="border px-4 py-2">{r.guest}</td>
                <td className="border px-4 py-2 font-semibold text-sky-700">
                  {r.avg_rating}
                </td>
                <td className="border px-4 py-2 text-gray-700">
                  {r.review_text}
                </td>
                <td className="border px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      r.sentiment === "Positive"
                        ? "bg-green-100 text-green-700"
                        : r.sentiment === "Negative"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {r.sentiment}
                  </span>
                </td>
                <td className="border px-4 py-2 text-gray-500 text-sm">
                  {new Date(r.submitted_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewTable;
