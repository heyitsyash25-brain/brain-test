import logo from "../assets/images/quinfosys-logo-transparent.png";

const navigationLinks = [
  ["Products", "https://quinfosys.com/products"],
  ["Solutions", "https://quinfosys.com/solutions"],
  ["Services", "https://quinfosys.com/services"],
  ["Research", "https://quinfosys.com/research-development"],
  ["Resources", "https://quinfosys.com/resources"],
  ["Company", "https://quinfosys.com/company"],
];

const legalLinks = [
  ["Privacy Policy", "https://quinfosys.com/privacy-policy"],
  ["Terms of Service", "https://quinfosys.com/terms-of-service"],
];

const socialLinks = [
  ["LinkedIn", "https://linkedin.com/company/quinfosys", "fa-linkedin-in"],
  ["YouTube", "https://youtube.com/@quinfosys", "fa-youtube"],
  ["X", "https://twitter.com/quinfosys2023", "fa-x-twitter"],
  ["Instagram", "https://instagram.com/quinfosys", "fa-instagram"],
  ["Facebook", "https://facebook.com/quinfosys", "fa-facebook-f"],
];

function LinkList({ title, links, label }) {
  return (
    <nav aria-label={label} className={label === "Legal" ? "footer-legal" : "footer-nav"}>
      <h2 className="footer-heading">{title}</h2>
      <ul className="footer-links">
        {links.map(([text, href]) => <li key={text}><a href={href}>{text}</a></li>)}
      </ul>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <a className="footer-logo" href="https://quinfosys.com/" aria-label="Go to Quinfosys homepage">
            <img src={logo} alt="Quinfosys" />
          </a>
          <p className="tagline-heading">Entangle with Quinfosys™</p>
          <p className="description">
            Enterprise quantum products, solutions, services, research, and resources for organizations preparing for the next era of computing.
          </p>
          <div className="contact-info">
            <a className="contact-item" href="mailto:info@quinfosys.com?subject=Quinfosys%20inquiry">
              <span className="icon-circle"><i className="fa-regular fa-envelope" /></span>
              <span>info@quinfosys.com</span>
            </a>
            <a className="contact-item" href="tel:+919059237828">
              <span className="icon-circle"><i className="fa-solid fa-phone" /></span>
              <span>+91 9059237828</span>
            </a>
            <p className="contact-item">
              <span className="icon-circle"><i className="fa-solid fa-location-dot" /></span>
              <span>T-Hub, 7th Floor, Hyderabad Knowledge City, Hyderabad, Telangana, India - 500081</span>
            </p>
          </div>
          <div className="social-links">
            {socialLinks.map(([name, href, icon]) => (
              <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label={`Visit Quinfosys on ${name}`}>
                <i className={`fa-brands ${icon}`} />
              </a>
            ))}
          </div>
        </div>
        <div className="footer-columns">
          <LinkList title="Navigation" links={navigationLinks} label="Footer navigation" />
          <LinkList title="Legal" links={legalLinks} label="Legal" />
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="copyright">© 2026 Quinfosys Private Limited. All rights reserved.</p>
          <p className="bottom-tagline">Entangle with Quinfosys™</p>
        </div>
      </div>
    </footer>
  );
}
