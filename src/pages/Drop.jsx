import MainLayout from "../layouts/MainLayout"
import "../styles/Drop.css"

export default function Drop() {
  return (
    <MainLayout>
      <section className="drop-header">
        <h1>DROP 01: FLY SEASON</h1>
      </section>

      <section className="product-grid">
        <div className="product-card">
          <img src="/pants1.jpg" alt="Studded Pants" />
          <p>STUDDED BLACK PANTS</p>
          <span>KSH 950</span>
        </div>

        <div className="product-card">
          <img src="/jorts1.jpg" alt="Graphic Jorts" />
          <p>GRAPHIC JORTS</p>
          <span>KSH 1100</span>
        </div>
      </section>
    </MainLayout>
  )
}
