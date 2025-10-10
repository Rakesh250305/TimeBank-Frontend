import { useEffect, useState } from "react";
import axios from "axios";
import { signup } from "../api/api";
import { useNavigate } from "react-router-dom";
import login_bg from "../assets/login_page_bg.png";
import googleLogo from "../assets/Google_logo.png";
import microsoftLogo from "../assets/Microsoft-logo.png";
import locationData from "../data/locationData";

const API_URL = "http://localhost:5000/api/auth";

export default function Signup({ setToken }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [otp, setOtp] = useState("");
  const [passwordRules, setPasswordRules] = useState({
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasMinLength: false,
  });

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    academics: [{ title: "", university: "", percentage: "", year: "" }],
    street1: "",
    street2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    skills: ["", "", ""],
    availability: "",
    experiences: [{ title: "", description: "", years: "" }],
    password: "",
    confirmPassword: "",
  });

  const states = Object.keys(locationData);
  const cities = form.state ? Object.keys(locationData[form.state]) : [];
  const postalCode = form.city ? locationData[form.state][form.city] : "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") {
      setPasswordRules({
        hasUppercase: /[A-Z]/.test(value),
        hasLowercase: /[a-z]/.test(value),
        hasNumber: /\d/.test(value),
        hasMinLength: value.length >= 6,
      });
    }
  };
  const handleSendOtp = async () => {
    if (!form.email) {
      setError("Please enter an email address");
      return;
    }
    try {
      setError("");
      setLoading(true);

      await axios.post(`${API_URL}/send-otp`, { email: form.email });
      setOtpSent(true);
      setTimer(120);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/verify-otp`, {
        email: form.email,
        otp,
      });
      if (res.data.success) {
        setOtpVerified(true);
        setError("");
        setStep(2);
      } else {
        setError("Invalid OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAcademicChange = (index, e) => {
    const updated = [...form.academics];
    updated[index][e.target.name] = e.target.value;
    setForm({ ...form, academics: updated });
  };

  const addAcademic = () => {
    setForm({
      ...form,
      academics: [
        ...form.academics,
        { title: "", university: "", percentage: "", year: "" },
      ],
    });
  };

  const handleExperienceChange = (index, e) => {
    const updated = [...form.experiences];
    updated[index][e.target.name] = e.target.value;
    setForm({ ...form, experiences: updated });
  };

  const addExperience = () => {
    setForm({
      ...form,
      experiences: [
        ...form.experiences,
        { title: "", description: "", years: "" },
      ],
    });
  };

  const handleSkillsChange = (index, e) => {
    const updated = [...form.skills];
    updated[index] = e.target.value;
    setForm({ ...form, skills: updated });
  };

  const addSkill = () => {
    setForm({ ...form, skills: [...form.skills, ""] });
  };

  const validateStep = () => {
    switch (step) {
      case 2: // Personal Info
        if (!form.firstName) {
          setError("Please enter first name");
          return false;
        } else if (!form.lastName) {
          setError("Please enter last name");
          return false;
        }
        if (!/^[0-9]{10,15}$/.test(form.phone)) {
          setError("Please enter a valid phone number (10–15 digits).");
          return false;
        }

        break;

      case 3: // Academic Details
        if (!form.academics.some((a) => a.title || a.university)) {
          setError("Please enter at least one academic detail.");
          return false;
        }
        for (const acd of form.academics) {
          if (
            (acd.title && (!acd.university || !acd.percentage || !acd.year)) ||
            (acd.university && (!acd.title || !acd.percentage || !acd.year)) ||
            (acd.percentage && (!acd.title || !acd.university || !acd.year)) ||
            (acd.year && (!acd.title || !acd.university || !acd.percentage))
          ) {
            setError(
              "Please complete all academic fields or leave them blank."
            );
            return false;
          }
        }
        break;

      case 4: // Address
        if (
          !form.street1 ||
          !form.city ||
          !form.state ||
          !form.postalCode ||
          !form.country
        ) {
          setError("Please complete all required address fields.");
          return false;
        }
        break;

      case 5: // Skills
        if (!form.skills.some((s) => s.trim() !== "")) {
          setError("Please enter at least two skill.");
          return false;
        }
        break;

      case 6: // Experience
        if (!form.experiences.some((exp) => exp.title || exp.description)) {
          setError("Please enter at least one experience or leave it blank.");
          return false;
        }
        // Allow skipping if no experiences, but if filled — must be complete
        for (const exp of form.experiences) {
          if (
            (exp.title && (!exp.description || !exp.years)) ||
            (exp.description && (!exp.title || !exp.years)) ||
            (exp.years && (!exp.title || !exp.description))
          ) {
            setError(
              "Please complete all experience fields or leave them blank."
            );
            return false;
          }
        }
        break;

      case 7: // Password step
        if (!form.password || !form.confirmPassword) {
          setError("Please enter and confirm your password.");
          return false;
        }

        if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/.test(form.password)
        ) {
          setError("Enter a valid Password");
          return false;
        }
        if (form.password !== form.confirmPassword) {
          setError("Passwords do not match.");
          return false;
        }
        if (!agree) {
          setError("You must agree to the terms and conditions.");
          return false;
        }
        break;

      default:
        setError("");
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) {
      return;
    }

    setLoading(true);
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email.toLowerCase(),
        phone: form.phone,
        academics: form.academics.filter((a) => a.title || a.university),
        address: {
          street1: form.street1,
          street2: form.street2,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: form.country || "India",
        },
        skills: form.skills.filter((s) => s.trim() !== ""),
        availability: form.availability,
        experiences: form.experiences.filter(
          (exp) => exp.title || exp.description
        ),
        password: form.password,
        confirmPassword: form.confirmPassword,
      };

      const res = await signup(payload);
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("firstLogin", "true");
      navigate("/profile");
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let countdown;
    if (otpSent && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(countdown);
  }, [otpSent, timer]);

  const progress = (step / 7) * 100;

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-bottom"
      style={{ backgroundImage: `url(${login_bg})` }}
    >
      <div className="bg-gray-800 shadow-2xl p-5 max-w-4xl w-[90%] lg:w-[65%] my-[10%] lg:my-0 text-white">
        <h1 className="lg:text-4xl text-2xl font-bold text-center mb-2 text-blue-500">
          TimeBank
        </h1>
        <p className="text-center text-gray-300 mb-6">
          A place to share your skills and help others grow
        </p>

        <div className="flex lg:flex-row flex-col">
          {/* Left Info */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full lg:w-[60%] lg:px-5 gap-4"
          >
            <h2 className="border-b border-gray-600 py-2">
              {step === 1 ? "Verify Email" : "Sign Up"}
            </h2>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* STEP 1 — EMAIL VERIFICATION */}
            {step === 1 && (
              <div className="flex flex-col gap-3 mt-3">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  className="p-3 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700"
                  required
                />

                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="bg-blue-600 py-2 rounded-lg hover:bg-blue-800 transition"
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="p-3 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={loading}
                      className="bg-green-600 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      {loading ? "Verifying..." : "Verify & Continue"}
                    </button>

                    {/* Countdown Timer & Resend Button */}
                    <div className="text-sm mt-2 text-gray-300 flex justify-between items-center">
                      {timer > 0 ? (
                        <span>
                          Resend available in: {Math.floor(timer / 60)}:
                          {String(timer % 60).padStart(2, "0")}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="text-blue-500 font-semibold hover:underline"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* STEP 2 — Personal Info */}
            {step === 2 && (
              <div className="flex flex-col gap-3 mt-3">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {/* Navigation Buttons */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep()) setStep(3);
                    }}
                    className="bg-blue-600 lg:w-[15%] w-[20%] p-2 rounded-lg hover:bg-blue-800 transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Academic Details */}
            {step === 3 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold text-blue-600">
                  Academic Details
                </h3>
                {form.academics.map((a, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <input
                      type="text"
                      name="title"
                      placeholder="Title"
                      value={a.title}
                      onChange={(e) => handleAcademicChange(idx, e)}
                      className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="university"
                      placeholder="University/Board"
                      value={a.university}
                      onChange={(e) => handleAcademicChange(idx, e)}
                      className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="percentage"
                        placeholder="Percentage"
                        value={a.percentage}
                        onChange={(e) => handleAcademicChange(idx, e)}
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        name="year"
                        placeholder="Year of Passing"
                        value={a.year}
                        onChange={(e) => handleAcademicChange(idx, e)}
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addAcademic}
                  className="text-blue-600 font-semibold hover:underline self-start"
                >
                  + Add More
                </button>
                {/* Navigation Buttons */}
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="bg-gray-900 lg:w-[20%] w-[30%] p-2 rounded-lg hover:bg-gray-700 transition"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep()) setStep(4);
                    }}
                    className="bg-blue-600 lg:w-[15%] w-[20%] p-2 rounded-lg hover:bg-blue-800 transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Address */}
            {step === 4 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold text-blue-600">Address</h3>

                {/* Street fields */}
                <input
                  type="text"
                  name="street1"
                  placeholder="Street Address 1"
                  value={form.street1}
                  onChange={handleChange}
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="street2"
                  placeholder="Street Address 2"
                  value={form.street2}
                  onChange={handleChange}
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* State, City, Postal, Country */}
                <div className="grid grid-cols-2 gap-4">
                  {/* STATE */}
                  <select
                    name="state"
                    value={form.state}
                    onChange={(e) => {
                      const selectedState = e.target.value;
                      setForm({
                        ...form,
                        state: selectedState,
                        city: "",
                        postalCode: "",
                      });
                    }}
                    className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  >
                    <option className="bg-gray-800 " value="">
                      Select State
                    </option>
                    {Object.keys(locationData).map((state) => (
                      <option
                        className="bg-gray-800 "
                        key={state}
                        value={state}
                      >
                        {state}
                      </option>
                    ))}
                  </select>

                  {/* CITY */}
                  <select
                    name="city"
                    value={form.city}
                    onChange={(e) => {
                      const selectedCity = e.target.value;
                      const postal =
                        locationData[form.state]?.[selectedCity] || "";
                      setForm({
                        ...form,
                        city: selectedCity,
                        postalCode: postal,
                      });
                    }}
                    className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!form.state}
                  >
                    <option className="bg-gray-800" value="">
                      Select City
                    </option>
                    {form.state &&
                      Object.keys(locationData[form.state] || {}).map(
                        (city) => (
                          <option
                            className="bg-gray-800"
                            key={city}
                            value={city}
                          >
                            {city}
                          </option>
                        )
                      )}
                  </select>

                  {/* POSTAL CODE */}
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Postal Code / Zipcode"
                    value={form.postalCode}
                    onChange={handleChange}
                    className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly
                  />

                  {/* COUNTRY */}
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={form.country}
                    onChange={handleChange}
                    className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="bg-gray-900 lg:w-[20%] w-[30%] p-2 rounded-lg hover:bg-gray-700 transition"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep()) setStep(5);
                    }}
                    className="bg-blue-600 lg:w-[15%] w-[20%] p-2 rounded-lg hover:bg-blue-800 transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Skills */}
            {step === 5 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold text-blue-600">Skills</h3>
                {form.skills.map((s, idx) => (
                  <input
                    key={idx}
                    type="text"
                    placeholder={`Skill ${idx + 1}`}
                    value={s}
                    onChange={(e) => handleSkillsChange(idx, e)}
                    className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                ))}
                <button
                  type="button"
                  onClick={addSkill}
                  className="text-blue-600 font-semibold hover:underline self-start"
                >
                  + Add More Skills
                </button>
                <input
                  type="text"
                  name="availability"
                  placeholder="Availability (e.g., 2 AM - 6 PM)"
                  value={form.availability || ""}
                  onChange={handleChange}
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {/* Navigation Buttons */}
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="bg-gray-900 lg:w-[20%] w-[30%] p-2 rounded-lg hover:bg-gray-700 transition"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep()) setStep(6);
                    }}
                    className="bg-blue-600 lg:w-[15%] w-[20%] p-2 rounded-lg hover:bg-blue-800 transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 6: Experiences */}
            {step === 6 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold text-blue-600">
                  Experiences
                </h3>
                {form.experiences.map((exp, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <input
                      type="text"
                      name="title"
                      placeholder="Title"
                      value={exp.title}
                      onChange={(e) => handleExperienceChange(idx, e)}
                      className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="description"
                      placeholder="Description"
                      value={exp.description}
                      onChange={(e) => handleExperienceChange(idx, e)}
                      className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      name="years"
                      placeholder="Years of Experience"
                      value={exp.years}
                      onChange={(e) => handleExperienceChange(idx, e)}
                      className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {idx === form.experiences.length - 1 && (
                      <button
                        type="button"
                        onClick={addExperience}
                        className="text-blue-600 font-semibold hover:underline self-start"
                      >
                        + Add More Experiences
                      </button>
                    )}
                  </div>
                ))}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => setStep(5)}
                    className="bg-gray-900 lg:w-[20%] w-[30%] p-2 rounded-lg hover:bg-gray-700 transition"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep()) setStep(7);
                    }}
                    className="bg-blue-600 lg:w-[15%] w-[20%] p-2 rounded-lg hover:bg-blue-800 transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* STEP 7 — Password + Agree */}
            {step === 7 && (
              <>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="p-3 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700"
                  required
                />

                {/* ✅ Password Requirements Auto-Checking */}
                <div className="text-sm space-y-1 grid grid-cols-2">
                  <label className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={passwordRules.hasLowercase}
                      readOnly
                      className="h-3 w-3 accent-green-500"
                    />
                    <span
                      className={
                        passwordRules.hasLowercase
                          ? "text-green-400"
                          : "text-gray-400"
                      }
                    >
                      At least one lowercase letter
                    </span>
                  </label>

                  <label className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={passwordRules.hasUppercase}
                      readOnly
                      className="h-3 w-3 checked:accent-green-500"
                    />
                    <span
                      className={
                        passwordRules.hasUppercase
                          ? "text-green-400"
                          : "text-gray-400"
                      }
                    >
                      At least one uppercase letter
                    </span>
                  </label>

                  <label className="flex items-center gap-5">
                    <input
                      type="checkbox"
                      checked={passwordRules.hasNumber}
                      readOnly
                      className="h-3 w-3 accent-green-500"
                    />
                    <span
                      className={
                        passwordRules.hasNumber
                          ? "text-green-400"
                          : "text-gray-400"
                      }
                    >
                      At least one number
                    </span>
                  </label>

                  <label className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={passwordRules.hasMinLength}
                      readOnly
                      className="h-3 w-3 accent-green-500"
                    />
                    <span
                      className={
                        passwordRules.hasMinLength
                          ? "text-green-400"
                          : "text-gray-400"
                      }
                    >
                      Minimum 6 characters
                    </span>
                  </label>
                </div>

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="p-3 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 mt-3"
                  required
                />

                <label className="flex items-center gap-2 text-sm mt-2">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={() => setAgree(!agree)}
                    className="h-4 w-4"
                  />
                  I agree to the{" "}
                  <a className="text-blue-500 hover:underline">
                    Terms & Conditions
                  </a>
                </label>

                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => setStep(6)}
                    className="bg-gray-900 lg:w-[20%] w-[30%] p-2 rounded-lg hover:bg-gray-700 transition"
                  >
                    Previous
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition ml-auto"
                  >
                    {loading ? "Signing Up..." : "Sign Up"}
                  </button>
                </div>
              </>
            )}

            {error && (
              <p className="text-red-400 text-sm text-center mt-2">{error}</p>
            )}
          </form>

          {/* Right Form */}
          <div className="flex flex-col gap-10 w-full lg:w-[40%] lg:border-l border-t lg:border-t-0 border-gray-600 py-5 lg:p-5 mt-5 lg:mt-0">
            <p className="text-sm lg:block hidden">
              Join the community and start exchanging your time and skills with others.
            </p>
            <button className="flex items-center justify-center gap-3 bg-gray-900 border-gray-700 border text-white p-3 rounded-lg hover:bg-gray-700 transition">
              <img src={googleLogo} alt="Google" className="w-5 h-5" />
              <p className="text-sm">Sign up with Google</p>
            </button>
            <button className="flex items-center justify-center gap-3 bg-gray-900 border-gray-700 border text-white p-3 rounded-lg hover:bg-gray-700 transition">
              <img src={microsoftLogo} alt="Microsoft" className="w-5 h-5" />
              <p className="text-sm">Sign up with Microsoft</p>
            </button>
            <p className="text-sm text-center lg:mt-6 text-gray-300">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-blue-500 font-semibold cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>
          </div>
        </div>
        <div className="mt-10 text-center text-gray-400 text-xs border-t-1 border-gray-500 pt-5">
          <span>About</span>
          <span className="mx-2">|</span>
          <span>Features</span>
          <span className="mx-2">|</span>
          <span>Privacy Policy</span>
          <span className="mx-2">|</span>
          <span>Terms & Conditions</span>
          <span className="mx-2">|</span>
          <span>Contact</span>
          <span className="mx-2">|</span>
          <span>© TimeBank, Inc. 2025</span>
        </div>
      </div>
    </div>
  );
}
