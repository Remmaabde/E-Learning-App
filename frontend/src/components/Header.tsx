import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Courses", href: "#courses" },
  { name: "About", href: "#about" },
  { name: "Testimonials", href: "#testimonials" },
];


function Header() {
  const { darkMode, toggleDarkMode } = useTheme();
  return (
    <header className="relative bg-[#f9f0ff] dark:bg-gray-900 font-inter px-10 py-5 flex flex-col">
    <div className="absolute right-10 top-4 flex gap-4">
  <Link to="/register" className="bg-[#310055] text-white px-5 py-2 rounded-lg font-semibold text-sm">Sign up</Link>
  <Link to="/login" className="bg-[#310055] text-white px-5 py-2 rounded-lg font-semibold text-sm">Login</Link>
</div>
      <div className="absolute left-10 top-4 flex items-center">
        <img src="/Images/logo.png" alt="Logo" className="h-20 mr-6" />
      </div>
      
        <div className="flex justify-center items-center w-full mt-2">
          <button
            className="bg-none border-none cursor-pointer p-0 mr-10"
            aria-label="Toggle dark mode"
            onClick={toggleDarkMode}
          >
            {darkMode ? (
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" fill="#FFD600"/>
                <g stroke="#FFD600" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="4"/>
                  <line x1="12" y1="20" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/>
                  <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="4" y2="12"/>
                  <line x1="20" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/>
                  <line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
                </g>
              </svg>
            ) : (
              <svg width="18" height="19" viewBox="0 0 18 19" fill="none">
                <path d="M9 18.5C6.5 18.5 4.375 17.625 2.625 15.875C0.875 14.125 0 12 0 9.5C0 7 0.875 4.875 2.625 3.125C4.375 1.375 6.5 0.5 9 0.5C9.23333 0.5 9.4625 0.508333 9.6875 0.525C9.9125 0.541667 10.1333 0.566667 10.35 0.6C9.66667 1.08333 9.12083 1.7125 8.7125 2.4875C8.30417 3.2625 8.1 4.1 8.1 5C8.1 6.5 8.625 7.775 9.675 8.825C10.725 9.875 12 10.4 13.5 10.4C14.4167 10.4 15.2583 10.1958 16.025 9.7875C16.7917 9.37917 17.4167 8.83333 17.9 8.15C17.9333 8.36667 17.9583 8.5875 17.975 8.8125C17.9917 9.0375 18 9.26667 18 9.5C18 12 17.125 14.125 15.375 15.875C13.625 17.625 11.5 18.5 9 18.5ZM9 16.5C10.4667 16.5 11.7833 16.0958 12.95 15.2875C14.1167 14.4792 14.9667 13.425 15.5 12.125C15.1667 12.2083 14.8333 12.275 14.5 12.325C14.1667 12.375 13.8333 12.4 13.5 12.4C11.45 12.4 9.70417 11.6792 8.2625 10.2375C6.82083 8.79583 6.1 7.05 6.1 5C6.1 4.66667 6.125 4.33333 6.175 4C6.225 3.66667 6.29167 3.33333 6.375 3C5.075 3.53333 4.02083 4.38333 3.2125 5.55C2.40417 6.71667 2 8.03333 2 9.5C2 11.4333 2.68333 13.0833 4.05 14.45C5.41667 15.8167 7.06667 16.5 9 16.5Z" fill="#1D1B20"/>
              </svg>
            )}
          </button>
          <nav className="flex gap-8">
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                className="font-inter font-normal not-italic text-[20px] leading-[100%] tracking-[0] no-underline text-black dark:text-white"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
      
    </header>
  );
}

export default Header;
