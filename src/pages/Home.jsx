import MainLayout from "../layouts/MainLayout"
import { Link } from "react-router-dom"
import starIcon from "../assets/msg.png"
import heroLogo from "../assets/Saint-logo.png"
import "../styles/Home.css"

export default function Home() {
  return (
    <MainLayout>
      <section className="hero">

        {/* watermark background */}
        <img src={starIcon} className="hero-bg-logo" alt="logo" />

        {/* foreground */}
        <div className="hero-content">
          <Link to="/drop" className="hero-btn">
            ENTER DROP 01
          </Link>
        </div>

      </section>
    </MainLayout>
  )
}
