import React, { useState, useEffect } from "react";
import "./Lost.css";
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
            <a href="/found">Found</a>
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
        {onView && (
          <button className="view-btn" onClick={() => onView(item.id)}>
            View Details
          </button>
        )}
      </div>
    </div>
  );
}

export default function Lost() {
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);

  
  useEffect(() => {
    async function loadLostItems() {
      try {
        const response = await fetch("http://localhost:5000/api/lost-items");
        if (!response.ok) throw new Error("Failed to fetch lost items");
        const data = await response.json();
        setItems(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadLostItems();
  }, []);

  const handleView = (id) => {
    setSelectedItemId(id);
  };

  const handleCloseModal = () => {
    setSelectedItemId(null);
  };

  return (
    <div className="lost-page">
      <Navbar />

      <header className="page-header">
        <h1>Lost Items</h1>
        <p>Here are the items that have been reported lost by users.</p>
      </header>

      <section className="cards-section">
        {items.length === 0 ? (
          <p className="no-items">No Lost items yet.</p>
        ) : (
          <div className="cards-grid">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} onView={handleView} />
            ))}
          </div>
        )}
      </section>

      {}
      {selectedItemId && (
        <ItemDetailsModal itemId={selectedItemId} onClose={handleCloseModal} />
      )}

      <footer className="footer">Made with ❤ by Lost & Found Team</footer>
    </div>
  );
}
