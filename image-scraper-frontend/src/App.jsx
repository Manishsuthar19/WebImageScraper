import React, { useState } from "react";
// import axios from "axios";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScrape = async () => {
    const urls = input
      .split(/\n|,/)
      .map((url) => url.trim())
      .filter((url) => url);

    if (!urls.length) {
      setError("Please enter at least one URL.");
      return;
    }

    setLoading(true);
    setError("");
    setImages({});

    try {
      const res = await axios.post("http://localhost:8000/scrape-images", { urls });
      setImages(res.data);
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Image Scraper</h2>
      <textarea
        rows={6}
        placeholder="Enter URLs (comma-separated or multiline)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleScrape} disabled={loading}>
        {loading ? "Scraping..." : "Scrape Images"}
      </button>
      {error && <p className="error">{error}</p>}
      <div className="image-results">
        {Object.keys(images).map((url, idx) => (
          <div key={idx}>
            <h4>{url}</h4>
            {Array.isArray(images[url]) ? (
              <div className="image-grid">
                {images[url].map((img, i) => (
                  <img key={i} src={img} alt="scraped" />
                ))}
              </div>
            ) : (
              <p className="error">Error: {images[url].error}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;