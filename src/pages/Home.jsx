import MainLayout from "../layouts/MainLayout"
import { Link } from "react-router-dom"
import starIcon from "../assets/msg.png"
import "../styles/Home.css"

export default function Home() {
  return (
      <section className="hero">

        {/* watermark background */}
        <img src={starIcon} className="hero-bg-logo" alt="logo" />

        {/* foreground */}
        <div className="hero-content">
          <Link to="/drop" className="hero-btn">
            ENTER DROP 01
          </Link>
          <p className="hero-subline">
  LIMITED. INTENTIONAL. RARE.
</p>
        </div>

        <div className="scroll-indicator">
  ↓ SCROLL
</div>

      </section>

  )
}
