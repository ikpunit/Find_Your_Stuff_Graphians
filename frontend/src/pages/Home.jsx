import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Home.css";
import "./Home-handset.css";

export default function Home() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [recentItems, setRecentItems] = useState([]);

  useEffect(() => {
    async function loadRecentItems() {
      try {
        const response = await fetch(`${API_URL}/api/recent-items`);
        if (!response.ok) throw new Error("Failed to fetch recent items");
        const data = await response.json();
        setRecentItems(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadRecentItems();
  }, [API_URL]);

  return (
    <div className="Home">
      <nav>
        <section className="main-nav">
          <div className="logo">
            <div className="logo"></div>
          </div>
          <div className="nav-btns">
            <span className="nav-btn" onClick={() => navigate("/found")}>Found</span>
            <span className="nav-btn" onClick={() => navigate("/lost")}>Lost</span>
            <span className="nav-btn" onClick={() => navigate("/post")}>Post Found/Lost</span>
          </div>
        </section>
        <section className="nav-extension">
          <div className="large-text">Welcome to find your stuff graphians</div>
          <div className="small-text">
            A one-stop platform to report and find lost items in your college,
            Post lost belongings or found items and connect with their owners easily.
          </div>
          <div className="btn-container">
            <button>Get Started</button>
            <button onClick={() => navigate("/post")}>Post a Lost/Found Item</button>
          </div>
        </section>
      </nav>

      <main>
        <section className="fact-bar">
          <div className="fact">
            <div className="icon icon-1"></div>
            <span className="text">Report lost items easily</span>
          </div>
          <div className="fact">
            <div className="icon icon-2"></div>
            <span className="text">Browse found items quickly</span>
          </div>
          <div className="fact">
            <div className="icon icon-3"></div>
            <span className="text">Connect with owners instantly</span>
          </div>
          <div className="fact">
            <div className="icon icon-4"></div>
            <span className="text">Verified college community</span>
          </div>
        </section>

        <section className="recent-post-container">
          <div className="heading">Recent Post</div>
          <div className="recent-post">
            {recentItems.length === 0 ? (
              <p>No recent posts yet.</p>
            ) : (
              recentItems.map((item) => (
                <div className="recent-post-card" key={item.id}>
                  <img src={item.image || "https://via.placeholder.com/150"} alt={item.name} />
                  <span className="status">{item.type === "found" ? "Found" : "Lost"}</span>
                  <span className="name">{item.name}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <footer>
        <span className="developed-by">Developed By: Punit Kumar Chhonker, Saloni Badoni, Sakshi Bhatt</span>
      </footer>
    </div>
  );
}
