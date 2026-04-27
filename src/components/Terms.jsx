import Footer from "./Footer";
import {
  FaBalanceScale,
  FaGavel,
  FaUserShield,
  FaExclamationTriangle,
  FaFileContract,
  FaSyncAlt,
  FaPrint,
} from "react-icons/fa";

export default function Terms() {
  const printPage = () => window.print();

  const sections = [
    {
      title: "Acceptance of Terms",
      icon: <FaFileContract />,
      content:
        "By creating an account or using TimeBank, you agree to these Terms. If you do not agree, please do not use the platform.",
    },
    {
      title: "User Responsibilities",
      icon: <FaUserShield />,
      list: [
        "Provide accurate information",
        "Use the platform respectfully",
        "Follow community rules & laws",
      ],
    },
    {
      title: "Prohibited Activities",
      icon: <FaExclamationTriangle />,
      list: [
        "Fraud, harassment, illegal actions",
        "Hacking or misuse",
        "Exploiting members",
      ],
    },
    {
      title: "Account Termination",
      icon: <FaGavel />,
      content:
        "Accounts violating policies may be suspended or removed to protect the community.",
    },
    {
      title: "Changes to Terms",
      icon: <FaSyncAlt />,
      content:
        "We may update these Terms. Continued usage means acceptance.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 shadow-md">
        <div className="max-w-6xl mx-auto px-6 flex items-center gap-4">
          <FaBalanceScale className="text-4xl" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Terms & Conditions
            </h1>
            <p className="text-sm opacity-90">
              Last updated: 2025 — Clear and fair usage rules.
            </p>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        {sections.map((sec, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow border"
          >
            <h2 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
              {sec.icon} {i + 1}. {sec.title}
            </h2>

            {sec.content && (
              <p className="mt-3 text-sm text-gray-700">
                {sec.content}
              </p>
            )}

            {sec.list && (
              <ul className="mt-3 text-sm list-disc pl-6 space-y-1 text-gray-700">
                {sec.list.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {/* TRUST BADGE */}
        <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm flex items-center gap-2">
          ✔ Community-first policy — Fair, transparent, and secure.
        </div>

        {/* CONTACT */}
        <div className="bg-blue-600 text-white p-6 rounded-xl text-center">
          <h3 className="text-lg font-semibold flex justify-center gap-2">
            <FaGavel /> Legal Contact
          </h3>
          <p className="mt-2 text-sm">legal@timebank.com</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}