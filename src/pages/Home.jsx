import { Link } from "react-router-dom";
import "../styles/Home.css"

export default function Home() {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1>FLY SEASON</h1>
        <p>MOVE DIFFERENT.</p>
        <Link to="/drop" className="hero-btn">
          SHOP DROP 01
        </Link>
      </div>
    </div>
  );
}
