import Navbar from "../components/Navbar"

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        {children}
      </div>
    </>
  )
}
