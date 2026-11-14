// Navbar.jsx — project name on the left, page links on the right.
// NavLink tells us which link matches the current page, so we can underline it.
import { Link, NavLink } from "react-router-dom";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/results", label: "Results" },
  { to: "/recommender", label: "Recommender" },
  { to: "/try", label: "Try the model" },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          FL Platform
        </Link>
        <nav aria-label="Main">
          <ul className="nav-links">
            {LINKS.map((link) => (
              <li key={link.to}>
                {/* "end" stops "/" from matching every page */}
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) => (isActive ? "nav-link is-active" : "nav-link")}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
