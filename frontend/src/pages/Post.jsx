import React, { useState } from "react";
import "./Post.css";

function Navbar() {
  return (
    <nav className="post-navbar">
      <div className="post-nav-container">
        <div className="post-logo">Lost & Found</div>
        <ul className="post-nav-links">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/lost">Lost</a>
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

export default function Post() {
  const [type, setType] = useState("found");
  const [formData, setFormData] = useState({
    itemName: "",
    place: "",
    date: "",
    picture: null,
    personName: "",
    contact: "",
  });

  const handleChange = (e) => {
    if (e.target.name === "picture") {
      setFormData({ ...formData, picture: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = new FormData();
      dataToSend.append("type", type);
      dataToSend.append("itemName", formData.itemName);
      dataToSend.append("place", formData.place);
      dataToSend.append("date", formData.date);
      dataToSend.append("personName", formData.personName);
      dataToSend.append("contact", formData.contact);
      if (formData.picture) {
        dataToSend.append("picture", formData.picture);
      }

      const response = await fetch("http://localhost:5000/api/post-item", {
        method: "POST",
        body: dataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Your ${type} item has been submitted successfully!`);

        setFormData({
          itemName: "",
          place: "",
          date: "",
          picture: null,
          personName: "",
          contact: "",
        });
        setType("found");
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while submitting the form");
    }
  };

  return (
    <div className="post-post-page">
      <Navbar />
      <main>
        <div className="post-page-header">
          <h1>Post Lost / Found Item</h1>
        </div>

        <section className="post-form-section">
          <div className="post-type-select">
            <label>
              <input
                type="radio"
                name="type"
                value="found"
                checked={type === "found"}
                onChange={() => setType("found")}
              />
              Found
            </label>
            <label>
              <input
                type="radio"
                name="type"
                value="lost"
                checked={type === "lost"}
                onChange={() => setType("lost")}
              />
              Lost
            </label>
          </div>

          <form
            className="post-item-form"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <div className="post-form-group">
              <label>Name of Item</label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="post-form-group">
              <label>
                {type === "found" ? "Place item found?" : "Suspected Place?"}
              </label>
              <input
                type="text"
                name="place"
                value={formData.place}
                onChange={handleChange}
                required
              />
            </div>

            <div className="post-form-group">
              <label>
                {type === "found" ? "Date/Time of Found" : "Date/Time of Lost"}
              </label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="post-form-group">
              <label>Picture</label>
              <input
                type="file"
                name="picture"
                accept="image/*"
                onChange={handleChange}
              />
            </div>

            <div className="post-form-group">
              <label>
                {type === "found" ? "Name of Founder" : "Name of Owner"}
              </label>
              <input
                type="text"
                name="personName"
                value={formData.personName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="post-form-group">
              <label>Contact</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Phone number or email"
                required
              />
            </div>

            <button type="submit" className="post-submit-btn">
              Submit
            </button>
          </form>
        </section>
      </main>

      <footer className="post-footer">Made with ❤ by Lost & Found Team</footer>
    </div>
  );
}
