import {
  FaShieldAlt,
  FaUserShield,
  FaLock,
  FaDatabase,
  FaHandshake,
  FaCookie,
  FaCheckCircle,
  FaDownload,
  FaPrint,
} from "react-icons/fa";
import Footer from "./Footer";

export default function Privacy() {
  const downloadPdf = () => {
    window.print();
  };

  return (
    <div className="min-h-screen font-sans bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 shadow-md">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4">
            <FaShieldAlt className="text-4xl" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Privacy Policy</h1>
              <p className="text-sm opacity-90 mt-1">
                Last updated: February 2025 — Simple, clear, community-first privacy for TimeBank.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Top Actions / Badges */}
      <div className="max-w-6xl mx-auto px-6 -mt-6">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-end">

          <div className="flex gap-3">
            <button
              onClick={downloadPdf}
              className="inline-flex cursor-pointer items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm text-sm hover:bg-gray-50"
            >
              <FaPrint /> Print / Download
            </button>

            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow-sm text-sm hover:bg-blue-700"
            >
              Contact Privacy Team
            </a>
          </div>
        </div>
      </div>

      {/* Main content + sidebar (responsive) */}
      <main className="max-w-6xl mx-auto px-6 py-10">
          <section className="md:col-span-3 space-y-6">
            {/* Overview */}
            <article id="overview" className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-3">
                <FaUserShield /> Overview
              </h2>
              <p className="mt-3 text-sm">
                TimeBank is a community-driven platform where members exchange skills for time credits. This policy explains what information we collect, how we use it, and how you can control your data. By using TimeBank, you consent to the terms in this policy.
              </p>
            </article>

            {/* Data Cards (UI-friendly) */}
            <article id="data" className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow p-5 border">
                <div className="flex items-start gap-3">
                  <FaDatabase className="text-blue-600 text-2xl mt-1" />
                  <div>
                    <h3 className="font-semibold text-sm">Data We Collect</h3>
                    <ul className="text-sm mt-2 space-y-1 list-disc pl-5 text-gray-700">
                      <li>Profile info (name, email, phone, skills)</li>
                      <li>Account & auth data (encrypted passwords, login records)</li>
                      <li>Activity (time credits, transactions, messages)</li>
                      <li>Device & technical info (IP, browser, device)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-5 border">
                <div className="flex items-start gap-3">
                  <FaLock className="text-blue-600 text-2xl mt-1" />
                  <div>
                    <h3 className="font-semibold text-sm">Why We Collect It</h3>
                    <p className="text-sm mt-2 text-gray-700">To run the platform safely, match members, secure accounts, and provide support and dispute resolution.</p>
                  </div>
                </div>
              </div>
            </article>

            {/* How we use */}
            <article id="howweuse" className="bg-white rounded-xl shadow p-6 border">
              <h3 className="font-semibold text-blue-700">How We Use Your Data</h3>
              <ul className="list-disc pl-6 mt-3 text-sm space-y-2 text-gray-700">
                <li>Account setup & profile display</li>
                <li>Managing time-credit balances & transactions</li>
                <li>Moderation, safety, and fraud prevention</li>
                <li>Platform improvements & analytics (aggregated)</li>
                <li>Customer support and communications</li>
              </ul>
            </article>

            {/* Cookies */}
            <article id="cookies" className="bg-white rounded-xl shadow p-6 border">
              <div className="flex items-center gap-3">
                <FaCookie className="text-blue-600 text-2xl" />
                <h3 className="font-semibold text-blue-700">Cookies & Tracking</h3>
              </div>
              <p className="mt-3 text-sm text-gray-700">
                We use cookies and similar technologies to run essential features (login, security), remember preferences, and collect anonymous usage analytics. You can manage cookies in your browser or via our cookie settings page.
              </p>

              <div className="mt-4 grid sm:grid-cols-3 gap-3">
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs font-semibold text-gray-600">Essential</div>
                  <div className="text-xs text-gray-500 mt-1">Required for login and security</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs font-semibold text-gray-600">Preferences</div>
                  <div className="text-xs text-gray-500 mt-1">Theme, language</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-xs font-semibold text-gray-600">Analytics</div>
                  <div className="text-xs text-gray-500 mt-1">Usage patterns (aggregated)</div>
                </div>
              </div>
            </article>

            {/* Security */}
            <article id="security" className="bg-white rounded-xl shadow p-6 border">
              <div className="flex items-center gap-3">
                <FaLock className="text-blue-600 text-2xl" />
                <h3 className="font-semibold text-blue-700">Security Measures</h3>
              </div>
              <ul className="list-disc pl-6 mt-3 text-sm text-gray-700 space-y-2">
                <li>Encrypted passwords and TLS for data in transit</li>
                <li>Role-based access controls and regular audits</li>
                <li>Monitoring, rate-limiting, and brute-force protection</li>
                <li>Incident response plan and notification procedures</li>
              </ul>
            </article>

            {/* Rights */}
            <article id="rights" className="bg-white rounded-xl shadow p-6 border">
              <h3 className="font-semibold text-blue-700">Your Rights</h3>
              <p className="text-sm mt-3 text-gray-700">You can access, correct, download, or request deletion of your personal data. To exercise these rights, contact us at <strong className="text-blue-600">support@timebank.com</strong>.</p>
            </article>

            {/* Community Safety & Trust Guarantee */}
            <article id="safety" className="bg-white rounded-xl shadow p-6 border">
              <div className="flex items-start gap-4">
                <FaHandshake className="text-blue-600 text-2xl mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-700">Community Safety & Trust</h3>
                  <p className="text-sm mt-2 text-gray-700">
                    TimeBank is committed to a safe, respectful community. We operate:
                  </p>

                  <ul className="list-disc pl-6 mt-3 text-sm text-gray-700 space-y-2">
                    <li><strong>Verified Profiles:</strong> optional verification badges to increase trust.</li>
                    <li><strong>Moderation:</strong> community guidelines, reporting & review flows.</li>
                    <li><strong>Escrow / Dispute:</strong> time-credit dispute resolution process to fairly handle disagreements.</li>
                    <li><strong>Privacy by Design:</strong> minimal data collection & user controls.</li>
                  </ul>

                  <div className="mt-4">
                    <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-full text-sm">
                      <FaCheckCircle /> Trust Guarantee — We will act on verified reports within 72 hours.
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Contact */}
            <article id="contact" className="bg-white rounded-xl shadow p-6 border">
              <h3 className="font-semibold text-blue-700">Contact & Grievance</h3>
              <p className="text-sm mt-3 text-gray-700">If you have privacy questions or need assistance:</p>

              <div className="mt-3 bg-gray-50 p-4 rounded flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">Data Protection Officer</div>
                  <div className="text-xs text-gray-600">privacy@timebank.com</div>
                  <div className="text-xs text-gray-600 mt-1">+91 98765 43210</div>
                </div>

                <div className="flex gap-2">
                  <a href="/delete-account" className="text-sm px-3 py-2 bg-red-50 text-red-600 rounded">Request Deletion</a>
                  <a href="/report" className="text-sm px-3 py-2 bg-blue-600 text-white rounded">Report an Issue</a>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-3">If unresolved, you may escalate to the relevant data protection authority in your jurisdiction.</p>
            </article>

          </section>

      </main>

      {/* Footer */}
      <Footer/>
    </div>
  );
}
