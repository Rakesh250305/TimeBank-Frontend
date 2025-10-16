import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-500 to-indigo-600 text-gray-300 mt-auto py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Navigation Links */}
        <div className="flex flex-row gap-4 text-sm md:text-base">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <Link to="/about" className="hover:text-white transition">About</Link>
          <Link to="/" className="hover:text-white transition">Feature</Link>
          <Link to="/community" className="hover:text-white transition">Community</Link>
        </div>

        {/* Social / Info */}
        <div className="flex gap-4 text-sm md:text-base">
          <a href="/privacy" className="hover:text-white transition">Privacy Policy</a>
          <a href="/terms" className="hover:text-white transition">Terms & Conditions</a>
          <a href="/contact" className="hover:text-white transition">Contact</a>
        </div>
      </div>

      <p className="text-center text-gray-400 text-sm mt-4">
        © {new Date().getFullYear()} TimeBank. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
