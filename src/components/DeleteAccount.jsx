// DeleteAccount.jsx
import React, { useState } from "react";
import { FaUserTimes, FaShieldAlt, FaDownload, FaPaperPlane } from "react-icons/fa";

export default function DeleteAccount() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8 border">
        <div className="flex items-center gap-3 mb-6">
          <FaUserTimes className="text-red-600 text-3xl" />
          <h1 className="text-2xl font-bold text-gray-800">Request Account Deletion</h1>
        </div>

        {!submitted ? (
          <>
            <p className="text-gray-600 text-sm mb-6">
              Deleting your account will permanently remove your profile, stored data,
              and Time credits. This action cannot be undone.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex gap-3 items-start">
                <FaShieldAlt className="text-red-600 text-xl" />
                <p className="text-sm text-red-700">
                  Identity verification is required to process this request in compliance
                  with data-protection laws.
                </p>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Registered Email
                </label>
                <input
                  className="w-full border rounded-lg px-4 py-2 text-sm"
                  required
                  type="email"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload ID Proof (Optional but recommended)
                </label>
                <input type="file" className="w-full border rounded-lg px-4 py-2 text-sm" />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <FaPaperPlane />
                Submit Delete Request
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-10">
            <FaPaperPlane className="text-green-500 text-4xl mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-gray-800">Request Submitted!</h2>
            <p className="text-gray-600 text-sm mt-2">
              Our data protection team will review and contact you within 72 hours.
            </p>
          </div>
        )}

        <p className="text-xs text-gray-500 text-center mt-6">
          As per data-privacy laws (including DPDP India), you have the right to
          request account deletion. We may retain minimal data for fraud prevention
          & regulatory compliance.
        </p>
      </div>
    </div>
  );
}
