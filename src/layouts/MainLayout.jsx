import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout({ children }) {
  const location = useLocation();

  const isHome = location.pathname === "/";

  return (
    <>
      <Navbar />

      {isHome ? (
        children
      ) : (
        <div className="page-wrapper">
          {children}
        </div>
      )}

      <Footer />
    </>
  );
}