import MainLayout from "../layouts/MainLayout"
import { Link } from "react-router-dom"
import "../styles/Home.css"

export default function Home() {
  return (
    <MainLayout>
      <section className="hero">

        <h1 className="hero-title">
          FLY<br />SEASON
        </h1>

        <p className="hero-sub">
          Graphic-heavy urban wear.
          <br />
          Built different.
        </p>

        <Link to="/drop" className="hero-btn">
          ENTER DROP 01
        </Link>

      </section>
    </MainLayout>
  )
}
