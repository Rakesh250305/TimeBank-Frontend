import React from "react";
import Footer from "./Footer";

export default function Terms() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <header className="bg-blue-600 text-white py-12 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Terms & Conditions</h1>
      </header>

      <main className="py-24 px-6 md:px-16 bg-gray-50 max-w-5xl mx-auto text-gray-700">
        <p className="mb-4">
          By accessing and using TimeBank, you agree to abide by our platform rules, maintain respectful interactions, and provide accurate information.
        </p>
        <p className="mb-4">
          TimeBank reserves the right to suspend or terminate accounts that violate terms or engage in fraudulent activity.
        </p>
        <p className="mb-4">
          The platform is provided as-is. TimeBank is not responsible for any disputes between users or external outcomes of skill exchanges.
        </p>
      </main>

      <Footer />
    </div>
  );
}
