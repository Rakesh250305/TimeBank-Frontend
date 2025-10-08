import React from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import { FaUsers, FaHandsHelping, FaNetworkWired } from "react-icons/fa";

export default function Community() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-12 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Join Our Community</h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl">
          Connect with people, share skills, and grow together. TimeBank is a collaborative space for everyone.
        </p>
      </header>

      <main className="py-24 px-6 md:px-16 text-center bg-gray-50">
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
            <FaUsers className="text-blue-600 text-3xl mb-4 mx-auto" />
            <h3 className="text-1xl font-bold mb-2">Connect</h3>
            <p className="text-gray-600">Meet like-minded people, form collaborations, and expand your network.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
            <FaHandsHelping className="text-blue-600 text-4xl mb-4 mx-auto" />
            <h3 className="text-1xl font-bold mb-2">Collaborate</h3>
            <p className="text-gray-600">Work on projects, exchange skills, and earn credits while helping others.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
            <FaNetworkWired className="text-blue-600 text-4xl mb-4 mx-auto" />
            <h3 className="text-1xl font-bold mb-2">Grow</h3>
            <p className="text-gray-600">Learn new skills, expand your knowledge, and build a strong supportive community.</p>
          </div>
        </div>

        <div className="mt-12">
          <Link
            to="/signup"
            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transform hover:-translate-y-1 hover:scale-105 transition-all"
          >
            Join the Community
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
