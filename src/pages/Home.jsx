import { Link } from "react-router-dom";
import bg1 from "../assets/bg1.jpg";
import Footer from "../components/Footer";
import { FaLaptopCode, FaHandsHelping } from "react-icons/fa";
import { MdCurrencyExchange } from "react-icons/md";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md fixed w-full z-50">
        <div className="text-2xl font-bold text-blue-600"><a href="#">TimeBank</a></div>
        <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
          <li>
            <a href="#" className="hover:text-blue-600 hover:underline">
              Home
            </a>
          </li>
          <li>
            <a href="/about" className="hover:text-blue-600 hover:underline">
              About
            </a>
          </li>
          <li>
            <a href="#features" className="hover:text-blue-600 hover:underline">
              Features
            </a>
          </li>
          <li>
            <a
              href="/community"
              className="hover:text-blue-600 hover:underline"
            >
              Community
            </a>
          </li>
          <li>
            <a href="/contact" className="hover:text-blue-600 hover:underline">
              Contact
            </a>
          </li>
        </ul>
        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Signup
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="flex flex-col p-4 items-center justify-center text-center text-white h-screen bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${bg1})`
        }}
      >
        <div className="p-10 rounded-xl flex flex-col bg-black opacity-80 gap-2">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Trade Time, Not Money
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Connect. Share Skills. Earn Credits. Build Community.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/signup"
              className="px-6 py-3 bg-blue-600 rounded text-white hover:bg-blue-700 hover:-translate-y-1 hover:scale-105 transition-all"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="px-6 py-3 border border-white rounded hover:bg-white hover:text-blue-600 hover:-translate-y-1 hover:scale-105 transition-all"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-6 md:px-16 bg-gray-50 text-center"
      >
        <h2 className="text-3xl font-bold text-blue-600 mb-6">Features</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
            <FaLaptopCode className="text-blue-600 text-4xl mb-4 mx-auto"/>
            <h3 className="text-2xl font-bold mb-2">Skill Exchange</h3>
            <p className="text-gray-600">
              Teach what you know and learn new skills from the community. Every hour counts!
            </p>
          </div>

          {/* card 2 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
            <MdCurrencyExchange className="text-blue-600 text-4xl mb-4 mx-auto"/>
            <h3 className="text-2xl font-bold mb-2">Wallet & Credits</h3>
            <p className="text-gray-600">
              Track your credits and spend them to get help or services from the community.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
            <FaHandsHelping className="text-blue-600 text-4xl mb-4 mx-auto"/>
            <h3 className="text-2xl font-bold mb-2">Community Growth</h3>
            <p className="text-gray-600">
              Build meaningful connections and foster a supportive environment where everyone thrives.
            </p>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section
        id="community"
        className="py-24 px-6 md:px-16 text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white relative overflow-hidden"
      >
        {/* Decorative shapes */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-white opacity-10 rounded-full translate-x-1/2 translate-y-1/2"></div>

        <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
          Join Our Community
        </h2>
        <p className="max-w-2xl mx-auto text-lg md:text-xl mb-10 drop-shadow-md">
          Connect, share skills, and grow together. TimeBank is a safe and
          collaborative space for everyone.
        </p>

        <div className="flex justify-center flex-wrap gap-6">
          <Link
            to="/signup"
            className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all"
          >
            Explore Services
          </Link>
          <Link
            to="/signup"
            className="px-8 py-4 border border-white text-white font-semibold rounded-lg shadow-lg hover:bg-white hover:text-blue-700 transform hover:-translate-y-1 hover:scale-105 transition-all"
          >
            Join Now
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-24 px-6 md:px-16 text-center bg-gray-100 relative"
      >
        {/* Decorative shapes */}
        <div className="absolute top-0 left-1/2 w-80 h-80 bg-blue-100 opacity-20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-52 h-52 bg-blue-100 opacity-20 rounded-full translate-x-1/2 translate-y-1/2"></div>

        <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-6">
          Contact Us
        </h2>
        <p className="max-w-xl mx-auto text-gray-700 mb-8 text-lg md:text-xl">
          Have questions or want to join our mission? Reach out anytime!
        </p>

        <a
          href="mailto:support@timebank.com"
          className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transform hover:-translate-y-1 hover:scale-105 transition-all"
        >
          support@timebank.com
        </a>
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
}
