import Footer from "./Footer";
import { FaBalanceScale, FaGavel } from "react-icons/fa";

export default function Terms() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <header className="bg-indigo-600 text-white py-12 text-center shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
          <FaBalanceScale className="text-white text-4xl" /> Terms & Conditions
        </h1>
        <p className="max-w-2xl mx-auto text-lg opacity-90">
          Please read these terms before using TimeBank.
        </p>
      </header>

      <main className="py-16 px-6 md:px-16 bg-gray-50 max-w-5xl mx-auto space-y-12 text-gray-700">
        
        <section id="acceptance">
          <h2 className="text-2xl font-bold text-indigo-700">1. Acceptance of Terms</h2>
          <p>
            By creating an account or using TimeBank, you agree to these Terms. 
            If you do not agree, please do not use the platform.
          </p>
        </section>

        <section id="responsibilities">
          <h2 className="text-2xl font-bold text-indigo-700">2. User Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide accurate information</li>
            <li>Use the platform respectfully</li>
            <li>Follow community rules & laws</li>
          </ul>
        </section>

        <section id="prohibited">
          <h2 className="text-2xl font-bold text-indigo-700">3. Prohibited Activities</h2>
          <p>Users must not:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Engage in fraud, harassment, or illegal behavior</li>
            <li>Misuse or hack the platform</li>
            <li>Exploit community members</li>
          </ul>
        </section>

        <section id="termination">
          <h2 className="text-2xl font-bold text-indigo-700">4. Account Termination</h2>
          <p>
            We may suspend or delete accounts involved in misconduct, 
            fraud, or harmful activity to protect the community.
          </p>
        </section>

        <section id="ip">
          <h2 className="text-2xl font-bold text-indigo-700">5. Intellectual Property</h2>
          <p>
            All branding, logos, and platform content belong to TimeBank 
            and cannot be used without permission.
          </p>
        </section>

        <section id="liability">
          <h2 className="text-2xl font-bold text-indigo-700">6. Limitation of Liability</h2>
          <p>
            TimeBank provides a community tool. We are not responsible 
            for user interactions offline or outcomes from skill exchanges.
          </p>
        </section>

        <section id="changes">
          <h2 className="text-2xl font-bold text-indigo-700">7. Changes to Terms</h2>
          <p>We may update these Terms. Continued use means acceptance.</p>
        </section>

        <section id="contact">
          <h2 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
            <FaGavel /> Contact
          </h2>
          <p>For legal inquiries: <span className="text-indigo-700 font-semibold">legal@timebank.com</span></p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
