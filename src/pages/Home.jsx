import { Link } from "react-router-dom";
import bg1 from "../assets/bg1.jpg";
import Footer from "../components/Footer";
import { FaLaptopCode, FaHandsHelping, FaUsers, FaGlobe } from "react-icons/fa";
import { MdCurrencyExchange } from "react-icons/md";
import { useEffect } from "react";
import CtaSection from "../components/CtaSection";

export default function Home() {
  useEffect(() => {
    const parallax = document.getElementById("parallax-bg");
    const handleScroll = () => {
      const offset = window.pageYOffset;
      parallax.style.transform = `translateY(${offset * 0.4}px)`;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Counter animation
    const counters = document.querySelectorAll(".stat-number");
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const counter = entry.target;
          const target = parseInt(counter.dataset.count || counter.textContent);
          const duration = 2500;
          const increment = target / (duration / 16);
          let current = 0;

          const update = () => {
            current += increment;
            if (current < target) {
              counter.textContent = Math.floor(current);
              requestAnimationFrame(update);
            } else counter.textContent = target;
          };

          update();
          counterObserver.unobserve(counter);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => counterObserver.observe(el));
  }, []);
  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md fixed w-full z-50">
        <div className="text-2xl font-bold text-blue-600">
          <a href="#">TimeBank</a>
        </div>
        <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
          <li>
            <a href="#" className="hover:text-blue-600 hover:underline">
              Home
            </a>
          </li>
          <li>
            <Link to="/about" className="hover:text-blue-600 hover:underline">
              About
            </Link>
          </li>
          <li>
            <a href="#features" className="hover:text-blue-600 hover:underline">
              Features
            </a>
          </li>
          <li>
            <Link
              to="/community"
              className="hover:text-blue-600 hover:underline"
            >
              Community
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-blue-600 hover:underline">
              Contact
            </Link>
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
      <section className="relative h-[100vh] flex items-center justify-center text-white overflow-hidden">
        {/* Parallax Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bg1})` }}
          data-speed="0.4"
          id="parallax-bg"
        ></div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Your Time Has Value <br /> Exchange Skills <br /> Not Money
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Learn anything. Teach anything. Earn and spend time credits.
          </p>
          <Link
            to="/signup"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-lg font-semibold shadow-lg transition-all"
          >
            Get Started
          </Link>
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
            <FaLaptopCode className="text-blue-600 text-4xl mb-4 mx-auto" />
            <h3 className="text-2xl font-bold mb-2">Skill Exchange</h3>
            <p className="text-gray-600">
              Teach what you know and learn new skills from the community. Every
              hour counts!
            </p>
          </div>

          {/* card 2 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
            <MdCurrencyExchange className="text-blue-600 text-4xl mb-4 mx-auto" />
            <h3 className="text-2xl font-bold mb-2">Wallet & Credits</h3>
            <p className="text-gray-600">
              Track your credits and spend them to get help or services from the
              community.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
            <FaHandsHelping className="text-blue-600 text-4xl mb-4 mx-auto" />
            <h3 className="text-2xl font-bold mb-2">Community Growth</h3>
            <p className="text-gray-600">
              Build meaningful connections and foster a supportive environment
              where everyone thrives.
            </p>
          </div>
        </div>
      </section>
      {/* Skills Marquee */}
      <div className="overflow-hidden whitespace-nowrap bg-blue-50 py-4">
        <div className="animate-marquee text-blue-600 font-semibold text-lg flex gap-10">
          {[
            "Web Dev",
            "Graphic Design",
            "Python",
            "UI/UX",
            "Photography",
            "Video Editing",
            "Music",
            "Finance",
            "Public Speaking",
            "Fitness",
            "Cooking",
            "Marketing",
          ].map((skill, i) => (
            <span key={i}>🎯 {skill}</span>
          ))}
        </div>
      </div>

      <style>
        {`
  .animate-marquee {
    animation: marquee 18s linear infinite;
  }
  @keyframes marquee {
    0% { transform: translateX(100%) }
    100% { transform: translateX(-100%) }
  }
`}
      </style>

      <section className="py-20 md:px-20 text-center text-gray-800">
        <div>
          <div>
            <h2 className="text-3xl font-bold text-blue-600 mb-6">
              Why Choose TimeBank?
            </h2>
            <p className="text-xl md:text-2xl md:w-[50%] mx-2 md:mx-auto font-semibold mb-6">
              TimeBank is a community-driven platform where skills are exchanged
              for credits. Every hour you give earns an hour you can use to
              learn from others.
            </p>
            <div className="">
              <div className="grid grid-cols-2 w-[50%] m-auto justify-center gap-20 mb-8">
                {[
                  { count: "78", label: "Registered Students" },
                  { count: "150", label: "Total Exchange Hours" },
                  { count: "56", label: "Skills Offered" },
                  { count: "98", label: "% Positive Feedback" },
                ].map((stat, i) => (
                  <div key={i} className="p-2">
                    <div className="flex justify-center flex-col">
                      <span className="stat-number text-blue-700 text-3xl font-bold">
                        {stat.count}
                      </span>
                      <span className="text-gray-600">{stat.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Link
              to="/about"
              className="bg-blue-500 text-white px-6 py-3 rounded mt-4 inline-block hover:bg-blue-700 transition"
            >
              Learn More About Us
            </Link>
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

      {/* Founder */}
      <section className="py-20 bg-white text-center">
        <h2 className="text-3xl font-bold text-blue-600 mb-6">
          Meet the Makers
        </h2>
        <p className="text-gray-600 mb-10">
          Built by students, for communities
        </p>

        <div className="flex justify-center gap-8">
          <div className="bg-blue-50 p-6 rounded-xl shadow hover:shadow-lg hover:-translate-y-2 transition">
            <img
              src="https://i.pravatar.cc/120?img=12"
              className="w-24 h-24 rounded-full mx-auto"
            />
            <h4 className="font-semibold mt-3">Rakesh Raikwar</h4>
            <p className="text-xs text-gray-600">Founder • MERN Developer</p>
          </div>
        </div>

        <Link
          to="/about"
          className="mt-6 inline-block text-blue-600 hover:underline"
        >
          See Full Team →
        </Link>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600 text-center mb-14">
            What Our Members Say
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                name: "Ankita Mishra",
                role: "Web Development Learner",
                img: "https://i.pravatar.cc/200?img=32",
                review:
                  "TimeBank helped me improve my JS skills by learning from experts — and in return I taught beginners HTML. Best learning platform!",
              },
              {
                name: "Neha Patel",
                role: "Graphic Designer",
                img: "https://i.pravatar.cc/200?img=49",
                review:
                  "I exchanged my design lessons for learning Python. No money needed — pure skill sharing. Amazing concept & community!",
              },
              {
                name: "Nikita Verma",
                role: "Digital Marketer",
                img: "https://i.pravatar.cc/200?img=31",
                review:
                  "I earned time credits helping people with branding and used them to learn UI/UX. This platform truly empowers everyone!",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-2xl p-8 text-center shadow-md hover:shadow-xl 
          border border-gray-100 transition transform hover:-translate-y-2"
              >
                <img
                  src={testimonial.img}
                  alt={testimonial.name}
                  className="w-20 h-20 object-cover rounded-full mx-auto mb-4 border-4 border-blue-200"
                />
                <p className="text-gray-700 italic mb-4">
                  “{testimonial.review}”
                </p>
                <h4 className="font-semibold text-gray-900">
                  {testimonial.name}
                </h4>
                <span className="text-blue-600 text-sm">
                  {testimonial.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
