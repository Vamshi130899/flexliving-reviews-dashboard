import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const TrendChart = ({ reviews }) => {
  const data = reviews.map(r => ({
    date: new Date(r.submitted_at).toLocaleDateString(),
    avg_rating: r.avg_rating
  }));

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Average Rating Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 10]} />
          <Tooltip />
          <Line type="monotone" dataKey="avg_rating" stroke="#3b82f6" strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
