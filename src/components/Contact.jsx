import React from "react";
import Footer from "./Footer";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Header */}
      <header className="bg-blue-600 text-white py-5 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Contact Us</h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl">
          Have questions or want to join our mission? Reach out anytime!
        </p>
      </header>

      {/* Contact Details Section */}
      <main className="py-24 px-6 md:px-16 bg-gray-50 flex justify-center">
        <div className="bg-white p-12 rounded-xl shadow-lg max-w-3xl w-full flex flex-col gap-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <FaEnvelope className="text-blue-600 text-4xl" />
            <p className="text-gray-700 text-lg">support@timebank.com</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <FaPhone className="text-blue-600 text-4xl" />
            <p className="text-gray-700 text-lg">+91 XXXXX XXXXX</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <FaMapMarkerAlt className="text-blue-600 text-4xl" />
            <p className="text-gray-700 text-lg">123 Street, Satna, India</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
