import React, { useState } from "react";
import {
  FaUserTimes,
  FaShieldAlt,
  FaPaperPlane,
} from "react-icons/fa";
import { showCustomToast } from "../utils/toast";

export default function DeleteAccount() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  const [emailExists, setEmailExists] = useState(null); // null | true | false

  // LIVE EMAIL CHECK
  const checkEmail = async (emailValue) => {
    try {
      const res = await fetch(
        "https://timebank-backend-67l5.onrender.com/api/user/check-email",
        // "http://localhost:5000/api/user/check-email",
         {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailValue }),
      });

      const data = await res.json();
      setEmailExists(data.exists);
    } catch (error) {
      console.error("Email check error:", error);
      setEmailExists(false);
    }
  };

  const handleEmailChange = (e) => {
    const val = e.target.value.trim();
    setEmail(val);

    if (val.length > 4) checkEmail(val);
    else setEmailExists(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", email);
    formData.append("message", message);
    if (file) formData.append("idProof", file);

    try {
      const res = await fetch(
        "https://timebank-backend-67l5.onrender.com/api/report/send",
        // "http://localhost:5000/api/report/send",
         {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        showCustomToast("success", "Request submitted", "We will review soon");
      } else {
        showCustomToast("error", "❌ Error", data.message || "Failed");
      }
    } catch (error) {
      showCustomToast("warning", "❌ Failed to submit request", "Server error");
      console.error(error);
    }
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
              Deleting your account will permanently remove your data.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex gap-3 items-start">
                <FaShieldAlt className="text-red-600 text-xl" />
                <p className="text-sm text-red-700">Identity verification is required for deletion.</p>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Registered Email
                </label>
                <input
                  className="w-full border rounded-lg px-4 py-2 text-sm"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />

                {emailExists !== null && (
                  <p className={`text-sm mt-1 ${emailExists ? "text-green-600" : "text-red-600"}`}>
                    {emailExists
                      ? "✔ This email is registered."
                      : "✘ Email not found in our system."}
                  </p>
                )}
              </div>

              {/* MESSAGE */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reason
                </label>
                <select 
                  className="w-full border rounded-lg px-4 py-2 text-sm"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required>
                    <option>Reason for Deletion</option>
                    <option value="Found a better alternative">Found a better alternative</option>
                    <option value="Lack of useful services">Lack of useful services</option>
                    <option value="take a break">Take a break</option>
                    <option value="Privacy Concerns">Privacy Concerns</option>
                    <option value="No Longer Needed">No Longer Needed</option>
                    <option value="Other">Other</option>
                  </select>
                {/* <input
                  className="w-full border rounded-lg px-4 py-2 text-sm"
                  type="text"
                  placeholder="Reason for deletion"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                /> */}
              </div>

              {/* FILE */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload ID Proof (Optional)
                </label>
                <input
                  type="file"
                  className="w-full border rounded-lg px-4 py-2 text-sm"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={!emailExists}
                className={`w-full text-white font-medium px-4 py-2 rounded-lg flex items-center justify-center gap-2 
                  ${emailExists ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"}`}
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
            <p className="text-gray-600 text-sm mt-2">We will contact you within 72 hours.</p>
          </div>
        )}

        <p className="text-xs text-gray-500 text-center mt-6">
          You can request data deletion anytime under privacy laws.
        </p>
      </div>
    </div>
  );
}
