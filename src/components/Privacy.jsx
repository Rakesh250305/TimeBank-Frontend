import React from "react";
import Footer from "./Footer";

export default function Privacy() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <header className="bg-blue-600 text-white py-12 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Privacy Policy</h1>
      </header>

      <main className="py-24 px-6 md:px-16 bg-gray-50 max-w-5xl mx-auto text-gray-700">
        <p className="mb-4">
          Your privacy is important to us. TimeBank collects only essential information for platform functionality and ensures your data is secure.
        </p>
        <p className="mb-4">
          We do not share your personal information with third parties without your consent. Usage data may be collected anonymously to improve services.
        </p>
        <p className="mb-4">
          By using TimeBank, you consent to the terms outlined in this Privacy Policy.
        </p>
      </main>

      <Footer />
    </div>
  );
}
