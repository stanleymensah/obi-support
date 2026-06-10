import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="hidden md:h-12 md:border md:shadow-sm md:px-4 md:flex md:items-center md:bg-white md:justify-between md:gap-4">
      <div className="brand flex items-center gap-2 text-xs">
        <Link to="/dashboard">Obi Support</Link>
        <span className="text-xs">&copy; {currentYear} </span>
      </div>
      <div>
        <span className="text-xs">Powered by Supabase</span>
      </div>
    </footer>
  );
}
