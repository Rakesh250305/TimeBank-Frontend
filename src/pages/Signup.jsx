import { useState } from "react";
import { signup } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Signup({ setToken }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
        setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const progress = (step / 6) * 100;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-200">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-3xl w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
          Register Yourself
        </h2>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Step 1: Personal Details */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-semibold text-blue-600">
                Personal Details
              </h3>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Step 2: Academic Details */}
          {step === 2 && (
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

          {/* Step 3: Address */}
          {step === 3 && (
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

          {/* Step 4: Skills */}
          {step === 4 && (
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

          {/* Step 5: Experiences */}
          {step === 5 && (
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

          {/* Step 6: Password & Terms */}
          {step === 6 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-semibold text-blue-600">Password</h3>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={() => setAgree(!agree)}
                  className="h-4 w-4"
                />
                <span>
                  I agree with all the{" "}
                  <a className="text-blue-600 hover:underline">
                    Terms and Conditions
                  </a>
                </span>
              </label>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-200 transition"
              >
                Previous
              </button>
            )}
            {step < 6 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ml-auto"
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
           
        </form>

        {error && (
               <p className="text-red-600 text-sm text-center mb-2">{error}</p>
            )}
        

        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
