import React, { useState } from "react";
import Footer from "./Footer";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import CtaSection from "./CtaSection";
import { showCustomToast } from "../utils/toast";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "https://timebank-backend-67l5.onrender.com/api/contact/send"
        // "http://localhost:5000/api/contact/send"
        , {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        showCustomToast(
          "success",
          "Message sent successfully",
          "Thank you for contacting us!"
        );
        setForm({ name: "", email: "", message: "" });
      } else {
        showCustomToast("error", "❌ Error:", data.message);
      }
    } catch (error) {
      console.error(error);
      showCustomToast(
        "warning",
        "❌ Failed to send message",
        "Server not responding"
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Header */}
      <header className="bg-blue-600 text-white py-10 text-center relative">
        <h1 className="text-3xl md:text-4xl font-bold">Contact Us</h1>
        <p className="max-w-2xl mx-auto text-lg mt-2 opacity-90">
          We’re here to help. Reach out anytime!
        </p>

        {/* Live support badge */}
        <div
          className="bg-green-500 px-4 py-2 rounded-full text-white text-sm font-semibold absolute right-5 top-5 shadow-md"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          🟢 Live Support Online
        </div>
      </header>

      {/* Contact Cards */}
      <main className="py-16 px-6 md:px-14 bg-gray-50 flex flex-col items-center gap-10">
        <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">
          {[
            { icon: <FaEnvelope />, text: "support@timebank.com" },
            { icon: <FaPhone />, text: "+91 78792 45448" },
            { icon: <FaMapMarkerAlt />, text: "Lamtara, Satna, India" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-4"
              whileHover={{ scale: 1.07 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <span className="text-blue-600 text-4xl">{item.icon}</span>
              <p className="text-gray-700 text-lg font-medium">{item.text}</p>
            </div>
          ))}
        </div>
        {/* Social Links */}
        <h1 className="text-blue-600 font-bold text-2xl">Follow us on</h1>
        <div className="flex gap-6 text-3xl text-blue-600">
          <FaFacebook className="cursor-pointer hover:text-blue-800" />
          <FaLinkedin className="cursor-pointer hover:text-blue-800" />
          <FaInstagram className="cursor-pointer hover:text-pink-600" />
          <FaWhatsapp className="cursor-pointer hover:text-green-500" />
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-10 rounded-xl shadow-xl w-full max-w-2xl space-y-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold text-center text-blue-600">
            Get in Touch
          </h2>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows="4"
            required
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Submit Message
          </button>
        </form>

        {/* Google Map */}
        {/* Map Heading */}
        <div className="flex items-center gap-3 mb-4 mt-10">
          <span className="text-blue-600 text-3xl">
            <FaMapMarkerAlt />
          </span>
          <h2 className="text-2xl font-bold text-gray-800">Find Us on Map</h2>
        </div>

        <div className="w-full max-w-5xl rounded-xl overflow-hidden shadow-lg">
          <iframe
            className="w-full h-72"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13891.138022969444!2d80.8073638408898!3d24.56483911421018!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39847f7b31d0c827%3A0xb96eeab2e7ba52d6!2sLamtara%2C%20Madhya%20Pradesh%20485001!5e1!3m2!1sen!2sin!4v1761930694745!5m2!1sen!2sin"
            loading="lazy"
          ></iframe>
        </div>
      </main>
      <CtaSection />

      <Footer />
    </div>
  );
}
