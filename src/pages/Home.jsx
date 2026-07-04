import { Link } from "react-router-dom";
import starIcon from "../assets/msg.png";
import "../styles/Home.css";

export default function Home() {
  return (
    <section className="hero">

      {/* Background Logo */}
      <img
        src={starIcon}
        alt="Saint Attire"
        className="hero-bg-logo"
      />

      {/* Decorative Text */}
      <div className="hero-left">
        EST. 2026
      </div>

      <div className="hero-right">
        NAIROBI · KENYA
      </div>

      {/* Main Content */}
      <div className="hero-content">

        <span className="hero-brand">
          SAINT ATTIRE
        </span>

        <h1 className="hero-title">
          BUILT DIFFERENT.
        </h1>

        <p className="hero-description">
          Every garment is crafted with intention,
          produced in limited quantities,
          and never mass produced.
        </p>

        <Link
          to="/drop"
          className="hero-btn"
        >
          SHOP DROP 01
        </Link>

        <p className="hero-subline">
          LIMITED • INTENTIONAL • RARE
        </p>

      </div>

      <div className="scroll-indicator">

        <span>SCROLL</span>

        <div className="scroll-line"></div>

      </div>

    </section>
  );
}