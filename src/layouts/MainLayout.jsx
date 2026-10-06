import { Footer } from "../components/Footer.jsx";
import { Navbar } from "../components/Navbar.jsx";

export function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
