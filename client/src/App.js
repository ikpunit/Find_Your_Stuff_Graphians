import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Found from "./pages/Found";
import Lost from "./pages/Lost";
import Post from "./pages/Post";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/found" element={<Found />} />
        <Route path="/lost" element={<Lost />} />
        <Route path="/post" element={<Post />} />
      </Routes>
    </Router>
  );
}

export default App;
