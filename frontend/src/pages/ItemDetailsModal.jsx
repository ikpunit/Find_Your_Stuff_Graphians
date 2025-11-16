import React, { useEffect, useState } from "react";
import "./ItemDetailsModal.css";

export default function ItemDetailsModal({ itemId, onClose }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItemDetails() {
      try {
        const response = await fetch(`${API_URL}/api/item/${itemId}`);
        if (!response.ok) throw new Error("Failed to fetch item details");
        const data = await response.json();
        setItem(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }

    if (itemId) fetchItemDetails();
  }, [itemId, API_URL]);

  if (!itemId) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {loading ? (
          <p>Loading...</p>
        ) : item ? (
          <>
            <button className="close-btn" onClick={onClose}>
              &times;
            </button>
            <h2>{item.item_name}</h2>
            <p><strong>Type:</strong> {item.type}</p>
            <p><strong>Place:</strong> {item.place}</p>
            <p><strong>Date:</strong> {new Date(item.date).toLocaleString()}</p>
            <p><strong>Person:</strong> {item.person_name}</p>
            <p><strong>Contact:</strong> {item.contact}</p>
            {item.picture && (
              <img
                src={`data:image/jpeg;base64,${item.picture}`}
                alt={item.item_name}
                className="modal-img"
              />
            )}
          </>
        ) : (
          <p>Item details not found.</p>
        )}
      </div>
    </div>
  );
}
