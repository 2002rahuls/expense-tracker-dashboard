"use client";

import { useEffect, useState } from "react";
import { getTopHeadlines } from "../services/api";

export default function AppBar() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    getTopHeadlines().then((res) => setNews(res.data));
  }, []);

  return (
    <div
      style={{
        background: "#111",
        color: "#fff",
        padding: "10px",
      }}
    >
      <h1
        style={{ textAlign: "center", fontSize: "20px", marginBottom: "8px" }}
      >
        <strong>Top Headlines:</strong>
      </h1>
      <marquee>
        {news.map((article, index) => (
          <span key={index} style={{ marginRight: "40px" }}>
            {article.title}
          </span>
        ))}
      </marquee>
    </div>
  );
}
