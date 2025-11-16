import React, { useState, useEffect } from "react";
import "./Found.css";
import ItemDetailsModal from "./ItemDetailsModal";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo">Lost & Found</div>
        <ul className="nav-links">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/lost">Lost</a>
          </li>
          <li>
            <a href="/post">Post Lost/Found</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

function ItemCard({ item, onView }) {
  return (
    <div className="item-card">
      <div className="item-img">
        {item.image ? (
          <img src={item.image} alt={item.name} />
        ) : (
          <div className="no-img">No Image</div>
        )}
      </div>
      <div className="item-details">
        <h3>{item.name}</h3>
        <p className="desc">{item.description}</p>
        <button className="view-btn" onClick={() => onView(item.id)}>
          View Details
        </button>
      </div>
    </div>
  );
}

async function fetchFoundItems() {
  const API_URL = import.meta.env.VITE_API_URL;
  try {
    const response = await fetch(`${API_URL}/api/found-items`);
    if (!response.ok) {
      throw new Error("Failed to fetch items from server");
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default function Found() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(`${API_URL}/api/found-items`);
        const data = await response.json();
        setItems(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, [API_URL]);

  const handleView = (id) => {
    setSelectedItemId(id);
  };

  const handleCloseModal = () => {
    setSelectedItemId(null);
  };

  return (
    <div className="found-page">
      <Navbar />
      <header className="page-header">
        <h1>Found Items</h1>
        <p>Here are the items that have been found and posted by users.</p>
      </header>

      <section className="cards-section">
        {items.length === 0 ? (
          <p className="no-items">No Found items yet.</p>
        ) : (
          <div className="cards-grid">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} onView={handleView} />
            ))}
          </div>
        )}
      </section>

      <footer className="footer">Made with ❤ by Lost & Found Team</footer>

      {}
      {selectedItemId && (
        <ItemDetailsModal itemId={selectedItemId} onClose={handleCloseModal} />
      )}
    </div>
  );
}
