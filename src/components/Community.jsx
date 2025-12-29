import React from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import { FaUsers, FaHandsHelping, FaNetworkWired } from "react-icons/fa";
import CtaSection from "./CtaSection";

export default function Community() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-12 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          Join Our Community
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl">
          Connect with people, share skills, and grow together. TimeBank is a
          collaborative space for everyone.
        </p>
      </header>

      <main className="py-24 px-6 md:px-16 text-center bg-gray-50">
        <section className="py-20 bg-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-600">
              Why Join TimeBank?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-2">
              Become part of a supportive global network where knowledge flows
              freely, skills grow faster, and time—not money—is your currency.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
            {[
              {
                title: "Learn Anything",
                desc: "Explore hundreds of skills — from coding to cooking to finance — at zero cost.",
              },
              {
                title: "Teach & Earn",
                desc: "Share what you know, help others grow, and earn time credits for every hour.",
              },
              {
                title: "Build Real Connections",
                desc: "Grow meaningful relationships with mentors, learners, and professionals.",
              },
              {
                title: "Showcase Your Skills",
                desc: "Profile badges, verified skills & community rankings help you stand out.",
              },
              {
                title: "Inclusive for Everyone",
                desc: "Students, professionals, hobbyists — all are welcome to join and learn.",
              },
              {
                title: "No Money Required",
                desc: "A learning ecosystem based on time, respect, and collaboration — not money.",
              },
            ].map((b, i) => (
              <div
                key={i}
                className="bg-gray-50 p-8 rounded-xl shadow hover:shadow-lg transition hover:-translate-y-2"
              >
                <h3 className="text-xl font-semibold text-blue-600 mb-2">
                  {b.title}
                </h3>
                <p className="text-gray-600">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>
{/* 
        <section className="py-20 bg-gray-50">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-600">
              Community Spotlight
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto mt-2">
              Recognizing our top contributors who make learning and helping a
              daily habit.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">
            {[
              {
                name: "Riya Sharma",
                role: "Frontend Mentor",
                img: "https://i.pravatar.cc/200?img=47",
                hours: "48+",
                review: "Helping students build beautiful UIs and React apps.",
              },
              {
                name: "Aditya Rao",
                role: "Data Science Coach",
                img: "https://i.pravatar.cc/200?img=30",
                hours: "72+",
                review: "Guiding learners in ML, Python & real-world projects.",
              },
              {
                name: "Sanjana Gupta",
                role: "Soft Skills Trainer",
                img: "https://i.pravatar.cc/200?img=35",
                hours: "55+",
                review:
                  "Empowering people with communication and leadership skills.",
              },
            ].map((m, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl text-center shadow-md hover:shadow-xl transition hover:-translate-y-2"
              >
                <img
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-200 object-cover"
                  src={m.img}
                  alt={m.name}
                />
                <h4 className="font-semibold text-lg text-gray-900">
                  {m.name}
                </h4>
                <p className="text-blue-600 text-sm mb-1">{m.role}</p>
                <span className="text-gray-600 text-sm">
                  {m.hours} Hours Shared
                </span>
                <p className="text-gray-500 italic text-sm mt-3">
                  “{m.review}”
                </p>
              </div>
            ))}
          </div>
        </section> */}

        <div className="text-center mt-10">
          <Link
            to="/signup"
            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          >
            Start Sharing & Earn Your Badge →
          </Link>
        </div>
      </main>

      <CtaSection />
      <Footer />
    </div>
  );
}
