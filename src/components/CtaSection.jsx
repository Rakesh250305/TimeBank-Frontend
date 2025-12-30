import React from "react";
import { Link } from "react-router-dom";
import ctabg from "../assets/cta-bg.png";

const CtaSection = () => {
  return (
    <div>
      <section
        className="relative py-16 text-white overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${ctabg})`, backdropFilter: "blur(5px)" }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-indigo-900/70 -z-10"></div>

        <div className="relative max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Join the TimeBank?
          </h2>

          <p className="text-lg text-blue-100 mb-8">
            Start exchanging skills, earning time credits, and growing together.
            Your time has value — make it count.
          </p>

          <div className="flex md:flex-row flex-col justify-center gap-6">
            <Link
              to="/signup"
              className="inline-block px-10 py-3 rounded-xl text-lg font-semibold
              bg-white text-blue-700 shadow-lg hover:bg-gray-200 hover:scale-[1.05] 
              transition-all duration-300"
            >
              Join Now
            </Link>

            <Link
              to="/contact"
              className="inline-block px-10 py-3 rounded-xl text-lg font-semibold
              border-2 border-white text-white hover:bg-white hover:text-blue-700 
              shadow-lg hover:scale-[1.05] transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>

          <p className="text-sm text-blue-200 mt-4">
            No fees • Open to everyone • Skill-sharing made easy
          </p>
        </div>
      </section>
    </div>
  );
};

export default CtaSection;