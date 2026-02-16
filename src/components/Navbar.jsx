import { Link } from "react-router-dom"
import "../styles/Navbar.css"

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">FLY SEASON</Link>
      </div>

      <div className="nav-right">
        <Link to="/drop">DROP 01</Link>
        <Link to="/cart">CART (0)</Link>
      </div>
    </nav>
  )
}
