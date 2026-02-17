import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaStar, FaRegStar } from "react-icons/fa";

export default function ApplicantProfile({ token }) {
   const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/api/user/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProfile(res.data);
      // console.log(res.data);
    } catch (err) {
      console.error("Error fetching applicant profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 z-50">
        <div className="flex flex-col items-center">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-24 w-24 mb-4"></div>
          <p className="text-white text-lg">Loading, please wait...</p>
        </div>

        <style jsx>{`
          .loader {
            border-top-color: #3b82f6;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  if (!profile)
    return <div className="p-10 text-center text-red-600">User not found.</div>;

  const {
    firstName,
    lastName,
    email,
    phone,
    bio,
    skills,
    availability,
    address,
    academics,
    experiences,
    trustScore,
    profilePhoto,
    reviews,
  } = profile;
  
  const trimmedPhone = phone ? phone.toString().slice(0, 4) : "";

  const StarRating = ({ rating }) => {
    const filledStars = Array.from({ length: rating }, (_, i) => (
      <FaStar key={`filled-${i}`} className="text-yellow-400 inline-block" />
    ));

    const unfilledStars = Array.from({ length: 5 - rating }, (_, i) => (
      <FaRegStar key={`unfilled-${i}`} className="text-gray-300 inline-block" />
    ));

    return (
      <div className="flex gap-1">{[...filledStars, ...unfilledStars]}</div>
    );
  };
  // Sort reviews by newest first
  const sortedReviews = [...(reviews || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Pagination logic
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const paginatedReviews = sortedReviews.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar token={token} />

      <div className="p-6 min-h-screen w-full mx-auto">
        <div className="mt-32 bg-white rounded-2xl shadow-xl p-8 relative">
          {/* Profile Picture */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2">
            <img
              src={profilePhoto || "https://ui-avatars.com/api/?name=" + firstName.slice(0,1) + lastName.slice(0,1)}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full border-blue-500 border-3 p-0.5 shadow-lg shadow-black/50"
            />
          </div>

          {/* Name */}
          <div className="text-center mt-20">
            <h2 className="text-3xl font-bold text-blue-600">
              {firstName} {lastName}
            </h2>
            {/* <p className="text-gray-500">{email ? `${trimmedEmailStart}xxxxx${trimmedEmailEnd}` : "N/A"}</p> */}
            <p className="text-gray-500">{email}</p>
          </div>

          {/* Info Grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
            <div>
              <strong>About:</strong> <br /> {bio || "N/A"}
            </div>{" "}
            <br />
            <div>
              <strong>Phone:</strong> {trimmedPhone}XXXXXX
            </div>
            <div>
              <strong>Availability:</strong> {availability || "N/A"}
            </div>
            <div>
              <strong>Skills:</strong> {(skills || []).join(", ") || "N/A"}
            </div>
            <div>
              <strong>Trust Score:</strong> {trustScore || 0}{" "}
            </div>
            <div>
              <strong>Address:</strong>{" "}
              {address
                ? [
                    address.street1,
                    address.street2,
                    address.city,
                    address.state,
                    address.postalCode,
                    address.country,
                  ]
                    .filter(Boolean)
                    .join(", ")
                : "N/A"}
            </div>
          </div>

          {/* Experiences */}
          {experiences?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-blue-500 mb-2">
                Experiences
              </h3>
              <ul className="space-y-2">
                {experiences.map((exp, index) => (
                  <li key={index} className="bg-gray-100 p-3 rounded">
                    <h1 className="text-lg font-semibold">
                      {index + 1}. {exp.title} || {exp.role} || {exp.years}{" "}
                      Years
                    </h1>
                    <p className="text-gray-500 ml-4">{exp.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Academics */}
          {academics?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-blue-500 mb-2">
                Academics
              </h3>
              <ul className="space-y-2">
                {academics.map((edu, index) => (
                  <li key={index} className="bg-gray-100 p-3 rounded">
                    <h1 className="text-lg font-semibold">
                      {index + 1}. {edu.title} || {edu.year}{" "}
                    </h1>
                    <p className="text-gray-500 ml-4">
                      {edu.university} | {edu.percentage} (Percent / CGPA)
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Reviews */}
          {reviews?.length > 0 && (
            <div className="mt-6 overflow-hidden">
              <h3 className="text-xl font-semibold text-blue-500 mb-4">
                Reviews
              </h3>

              <ul className="space-y-2">
                {paginatedReviews.map((rew, index) => (
                  <li
                    key={index}
                    className="bg-gray-100 px-5 py-3 rounded list-none"
                  >
                    <p className="text-gray-700 flex items-center text-sm gap-2">
                      Rating: <StarRating rating={rew.rating} />
                    </p>
                    <p className="text-sm text-gray-700">
                      Review: {rew.comment}
                    </p>
                    <p className="text-xs text-gray-500">
                      Date: {new Date(rew.createdAt).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Pagination Controls */}
              <div className="flex justify-center items-center gap-4 mt-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-700 text-white disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-700 text-white disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
