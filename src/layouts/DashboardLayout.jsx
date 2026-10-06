import { Footer } from "../components/Footer.jsx";
import { Navbar } from "../components/Navbar.jsx";

export function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
}
