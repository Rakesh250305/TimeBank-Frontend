import Footer from "./Footer";
import {
  FaUsers,
  FaLightbulb,
  FaGlobe,
  FaHandshake,
  FaClock,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";
import CtaSection from "../components/CtaSection.jsx";

export default function About() {
  useEffect(() => {
    const counters = document.querySelectorAll(".stat-number");
    const counterObserver = new IntersectionObserver((entries) => {
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
    });

    counters.forEach((el) => counterObserver.observe(el));
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Header */}
      <header className="bg-blue-600 h-[15rem] text-white flex flex-col justify-center text-center">
        <h1 className="text-4xl font-bold">About TimeBank</h1>
        <p className="mt-3 text-lg opacity-90">
          Where time becomes a currency and knowledge becomes a community.
        </p>
      </header>

      {/* Who We Are */}
      <main className="pt-20 bg-gray-50">
        <section className="pb-10 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Text Section */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-6">
                Who We Are
              </h2>
              <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                TimeBank is a community-powered skill-exchange platform where
                people share knowledge, help each other, and earn time credits
                instead of money. Our mission is to create a culture where
                skills become currency, learning becomes accessible, and every
                hour of service is valued equally.
              </p>

              <p className="text-gray-700 text-lg leading-relaxed">
                TimeBank connects individuals who want to teach, learn,
                collaborate, and grow together — fostering a supportive and
                empowering global community.
              </p>
            </div>

            {/* Right Image Section */}
            <div className="flex justify-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3065/3065416.png"
                alt="Community Illustration"
                className="w-full max-w-sm md:max-w-md drop-shadow-lg rounded-xl"
              />
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600 text-center mb-14">
            Our Mission & Values
          </h2>

          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {[
              {
                icon: <FaUsers />,
                title: "Community First",
                text: "A safe and supportive space to grow and learn together.",
              },
              {
                icon: <FaLightbulb />,
                title: "Skill Sharing",
                text: "Increase knowledge through reciprocal learning.",
              },
              {
                icon: <FaGlobe />,
                title: "Global Reach",
                text: "Connect and share skills beyond geographic boundaries.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
              >
                <div className="text-blue-600 text-4xl mb-4 mx-auto">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 md:px-20 text-center text-gray-800 overflow-hidden">
          <div>
            <div>
              <h2 className="text-3xl font-bold text-blue-600 mb-6">
                Why Choose TimeBank?
              </h2>
              <p className="text-xl md:text-2xl md:w-[50%] mx-2 md:mx-auto font-semibold mb-6">
                TimeBank is a community-driven platform where skills are
                exchanged for credits. Every hour you give earns an hour you can
                use to learn from others.
              </p>
              <div className="">
                <div className="grid grid-cols-2 md:w-[50%] m-auto justify-center gap-20 mb-8">
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
            </div>
          </div>
        </section>

        {/* Team & Work Style */}
        <section className="py-20 bg-gray-50  transition">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-600 text-center mb-12">
              Meet Our Team
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-20">
              {[
                {
                  name: "Rakesh Raikwar",
                  role: "Founder & Full-Stack Developer",
                  img: "https://i.pravatar.cc/200?img=12",
                  linkedin: "#",
                  github: "#",
                  twitter: "#",
                },
                // {
                //   name: "Priya Sharma",
                //   role: "UI/UX Designer",
                //   img: "https://i.pravatar.cc/200?img=47",
                //   linkedin: "#",
                //   github: "#",
                //   twitter: "#",
                // },
                // {
                //   name: "Amit Verma",
                //   role: "Backend Engineer",
                //   img: "https://i.pravatar.cc/200?img=8",
                //   linkedin: "#",
                //   github: "#",
                //   twitter: "#",
                // },
                // {
                //   name: "Sara Khan",
                //   role: "Community Manager",
                //   img: "https://i.pravatar.cc/200?img=23",
                //   linkedin: "#",
                //   github: "#",
                //   twitter: "#",
                // },
              ].map((member, i) => (
                <div
                  key={i}
                  className="bg-white w-[75rem] rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-2 border border-gray-100 transition group text-center"
                >
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-28 h-28 rounded-full mx-auto mb-4 object-cover border-4 border-blue-200 group-hover:border-blue-500 transition"
                  />

                  <h3 className="text-lg font-bold text-gray-800">
                    {member.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-5">{member.role}</p>
                  <div className="flex justify-center gap-4 text-xl text-blue-600">
                    <a
                      href={member.linkedin}
                      className="hover:text-blue-800 transition"
                    >
                      <FaLinkedin />
                    </a>
                    <a
                      href={member.github}
                      className="hover:text-gray-800 transition"
                    >
                      <FaGithub />
                    </a>
                    <a
                      href={member.twitter}
                      className="hover:text-blue-400 transition"
                    >
                      <FaTwitter />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* How We Work */}
            <h3 className="text-2xl font-bold text-center text-gray-800  mb-10">
              How We Work
            </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: "📌",
                  title: "Community Driven",
                  desc: "Members help & learn together",
                },
                {
                  icon: "⏳",
                  title: "Time-Credit System",
                  desc: "Earn 1 credit per hour shared",
                },
                {
                  icon: "🎓",
                  title: "Skill Exchange",
                  desc: "Learn anything from anyone",
                },
                {
                  icon: "🌍",
                  title: "Inclusive Culture",
                  desc: "Anyone can join & contribute",
                },
                {
                  icon: "🤝",
                  title: "Trust-Based",
                  desc: "Fair & respectful interactions",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-xl shadow hover:shadow-lg border border-gray-100 transition text-center hover:-translate-y-1"
                >
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <h4 className="font-semibold text-blue-600">{item.title}</h4>
                  <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <CtaSection />

      <Footer />
    </div>
  );
}
