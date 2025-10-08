import { useState } from "react";
import axios from "axios";
import { signup } from "../api/api";
import { useNavigate } from "react-router-dom";
import login_bg from "../assets/login_page_bg.png";

const API_URL = "http://localhost:5000/api/auth";

export default function Signup({ setToken }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");

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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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
        setStep(2); // move to next step after successful verification
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

  const handleNext = () => {
    // Step 1: Personal details validation
    if (step === 1) {
      if (!form.firstName || !form.lastName || !form.email || !form.phone) {
        setError("Please fill all the personal details before proceeding.");
        return;
      }
    }

    // Step 2: Academic details → optional (no check)

    // Step 3: Address validation
    if (step === 3) {
      if (
        !form.street1 ||
        !form.city ||
        !form.state ||
        !form.postalCode ||
        !form.country
      ) {
        setError("Please complete all address fields before proceeding.");
        return;
      }
    }

    // Step 4: Skills validation
    if (step === 4) {
      const filledSkills = form.skills.filter((s) => s.trim() !== "");
      if (filledSkills.length < 3) {
        setError("Please enter at least 3 skills before proceeding.");
        return;
      }
    }

    // Step 5: Experiences validation (optional fields allowed, but at least one title or description)
    if (step === 5) {
      const validExperience = form.experiences.some(
        (exp) => exp.title.trim() !== "" || exp.description.trim() !== ""
      );
      if (!validExperience) {
        setError("Please add at least one experience before proceeding.");
        return;
      }
    }

    setStep((prev) => Math.min(prev + 1, 6));
  };

  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agree) {
      setError("You must agree to the terms and conditions");
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
          country: form.country,
        },
        skills: form.skills.filter((s) => s.trim() !== ""),
        availability: form.availability,
        experiences: form.experiences.filter(
          (exp) => exp.title || exp.description
        ),
        password: form.password,
        confirmPassword: form.confirmPassword,
      };
      if (form.password !== form.confirmPassword) {
        setError("Password and Confirm Password do not match!");
        return;
      }
      const res = await signup(payload);
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const progress = (step / 6) * 100;

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-bottom"
      style={{ backgroundImage: `url(${login_bg})` }}
    >
      <div className="bg-gray-800 shadow-2xl p-5 max-w-4xl w-[65%] text-white">
        <h1 className="text-4xl font-bold text-center mb-2 text-blue-500">
          TimeBank
        </h1>
        <p className="text-center text-gray-300 mb-6">
          Verify your email to get started
        </p>

        <div className="flex flex-row">
          {/* Left Info */}
          <div className="flex flex-col gap-5 w-[40%] border-r border-gray-600 p-5">
            <p className="text-sm">
              Join the community and start exchanging your time and skills with
              others.
            </p>
            <button className="flex items-center justify-center gap-3 bg-gray-900 border-gray-700 border text-white p-3 rounded-lg hover:bg-gray-700 transition">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Sign up with Google
            </button>
            <button className="flex items-center justify-center gap-3 bg-gray-900 border-gray-700 border text-white p-3 rounded-lg hover:bg-gray-700 transition">
              <img
                src="https://www.svgrepo.com/show/448224/facebook.svg"
                alt="Facebook"
                className="w-5 h-5"
              />
              Sign up with Facebook
            </button>
            <p className="text-sm text-center mt-6 text-gray-300">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-blue-500 font-semibold cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>
          </div>

          {/* Right Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-[60%] px-5 gap-4"
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
                  className="p-3 rounded-lg bg-gray-900 text-white placeholder-gray-400"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                  className="p-3 rounded-lg bg-gray-900 text-white placeholder-gray-400"
                  required
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="p-3 rounded-lg bg-gray-900 text-white placeholder-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-blue-600 py-2 rounded-lg hover:bg-blue-800 transition"
                >
                  Next
                </button>
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
                    {idx === form.academics.length - 1 && (
                      <button
                        type="button"
                        onClick={addAcademic}
                        className="text-blue-600 font-semibold hover:underline self-start"
                      >
                        + Add More
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Address */}
            {step === 4 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold text-blue-600">Address</h3>
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
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={form.state}
                  onChange={handleChange}
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code / Zipcode"
                  value={form.postalCode}
                  onChange={handleChange}
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={form.country}
                  onChange={handleChange}
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                  placeholder="Availability (e.g., Weekends, 5 hrs/day, etc.)"
                  value={form.availability || ""}
                  onChange={handleChange}
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                      type="text"
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
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="p-3 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700"
                  required
                />
                <label className="flex items-center gap-2 text-sm">
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
                {/* Navigation Buttons */}
                <div className="flex justify-between mt-4">
                  {step > 2 && (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-200 transition"
                    >
                      Previous
                    </button>
                  )}
                  {step < 7 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-4 py-2 bg-blue-600 hidden text-white rounded hover:bg-blue-700 transition ml-auto"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition ml-auto"
                    >
                      {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                  )}
                </div>
                {/* <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </button> */}
              </>
            )}

            {error && (
              <p className="text-red-400 text-sm text-center mt-2">{error}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
