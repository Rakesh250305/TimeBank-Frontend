import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import defaultavatar from "../assets/default-profile.webp";
import io from "socket.io-client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// const socket = io("http://localhost:5000");
const socket = io("https://timebank-backend-67l5.onrender.com");

export default function Profile({ token }) {
  const [user, setUser] = useState(null);
  const [welcome, setWelcome] = useState(false);
  const [appliedServices, setAppliedServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;
  const navigate = useNavigate();

  // ✅ Fetch user profile
  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        // "http://localhost:5000/api/user/profile",
        "https://timebank-backend-67l5.onrender.com/api/user/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userData = {
        ...res.data.data,
        profilePhoto: res.data.data.profilePhoto
          ? `${res.data.data.profilePhoto}`
          : null,
      };
      setReviews(userData.reviews || []);
      setUser({
        ...userData,
        requestedServices: res.data.requestedServices || [],
      });

      // after profile is fetched, also fetch applied services
      fetchAppliedServices(res.data._id);
    } catch (err) {
      console.error("Fetch profile error:", err);
    }
  };

  // ✅ Fetch services I applied for
  const fetchAppliedServices = async (userId) => {
    try {
      const res = await axios.get(
        // "http://localhost:5000/api/services/applied",
        "https://timebank-backend-67l5.onrender.com/api/services/applied",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // filter services where I am the requester
      const myApplied = res.data.filter(
        (srv) => srv.requestedBy?._id === userId
      );

      setAppliedServices(myApplied);
    } catch (err) {
      console.error("Fetch applied services error:", err);
    }
  };

  const calculateProfileCompletion = () => {
    if (!user) return 0;
    const fields = [
      user.firstName,
      user.lastName,
      user.email,
      user.phone,
      user.address?.street1,
      user.address?.city,
      user.address?.state,
      user.address?.country,
      user.skills?.length,
      user.availability,
      user.bio,
      user.academics?.length,
      user.experiences?.length,
      user.reviews?.length,
    ];

    const filled = fields.filter((f) => f && f !== "").length;
    const percentage = Math.round((filled / fields.length) * 100);
    return percentage;
  };

  const profileCompletion = calculateProfileCompletion();

  // Sort reviews by newest first
  const sortedReviews = [...(reviews || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Pagination logic
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const paginatedReviews = sortedReviews.slice(startIndex, endIndex);

  useEffect(
    () => {
      if (token) {
        fetchProfile();
      }
      setCurrentPage(1);
    },
    [token],
    [reviews]
  );

  // ✅ Show congratulations popup if user just signed up
  useEffect(() => {
    if (localStorage.getItem("firstLogin")) {
      setWelcome(true);
      localStorage.removeItem("firstLogin");
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [reviews]);

  useEffect(() => {
    if (!user?._id) return;

    socket.emit("join", user._id);

    socket.on("notification", (notif) => {
      setUser((prev) => ({
        ...prev,
        requestedServices: prev.requestedServices.map((s) =>
          String(s._id) === String(notif.serviceId)
            ? { ...s, status: notif.status }
            : s
        ),
        notifications: [notif, ...(prev.notifications || [])],
      }));
    });

    return () => {
      socket.off("notification");
    };
  }, [user?._id]);

  if (!user)
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

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar token={token} />

      <div className="max-w-screen min-h-screen mt-20 md:mt-24 p-2">
        {/* Profile Card */}
        {/* Profile Completion Progress Bar */}
        <div className="mt-0 md:mt-2 flex flex-col items-center mb-6">
          <p className="text-sm text-gray-600 mb-1 mx-8">
            Profile Completion:{" "}
            <span className="font-semibold">{profileCompletion}%</span>
          </p>
          <div className="w-[80%] lg:w-[95%] bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${profileCompletion}%` }}
            ></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md  p-8 relative">
          <div
            className="absolute top-6 right-6 cursor-pointer"
            onClick={() => navigate("/account")}
          >
            <img
              src={user?.profilePhoto || defaultavatar}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-blue-600 object-cover"
            />
          </div>
          <h2 className="text-xl md:text-3xl font-bold text-blue-600 mb-2 md:mb-4">
            Hello, {user?.firstName || "User"} {user?.lastName || ""}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-700">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-gray-700">
                <strong>Location:</strong>{" "}
                {user?.address
                  ? [
                      user.address.street1,
                      user.address.street2,
                      user.address.city,
                      user.address.postalCode,
                    ]
                      .filter(Boolean)
                      .join(", ")
                  : "-"}
              </p>
              <p className="text-gray-700">
                <strong>State:</strong> {user.address.state || "-"}
              </p>
              <p className="text-gray-700">
                <strong>Country:</strong> {user.address.country || "-"}
              </p>
              <p className="text-gray-700">
                <strong>Skills:</strong> {(user.skills || []).join(", ") || "-"}
              </p>
              <p className="text-gray-700">
                <strong>Availability:</strong> {user.availability || "-"}
              </p>
              <p className="text-gray-700">
                <strong>Total Credits:</strong> {user.wallet || "0"}
              </p>
            </div>
          </div>
        </div>

        {/* ✅ My Service Requests */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-blue-600">
              My Service Requests
            </h3>

            {/* ✅ View All Button */}
            {appliedServices.length > 3 && (
              <button
                onClick={() => navigate("/applied-services")}
                className="text-sm text-blue-600 font-semibold hover:underline"
              >
                View All →
              </button>
            )}
          </div>

          {appliedServices.length > 0 ? (
            <ul className="space-y-3">
              {appliedServices.slice(0, 3).map((srv) => (
                <li
                  key={srv._id}
                  className="border p-3 rounded flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{srv.title}</p>
                    <p className="text-sm text-gray-600">
                      Offered By: {srv.offeredBy?.email}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      srv.status === "requested"
                        ? "bg-yellow-100 text-yellow-700"
                        : srv.status === "processing"
                        ? "bg-blue-100 text-blue-700"
                        : srv.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {srv.status === "requested" && "⏳ Pending"}
                    {srv.status === "processing" && "✅ Accepted (In Progress)"}
                    {srv.status === "completed" && "🎉 Completed"}
                    {srv.status === "open" && "❌ Rejected - Reopened"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">
              You haven’t applied to any services yet.
            </p>
          )}
        </div>
        {/* My Reviews Recieved */}
        <div
          className="mt-8 bg-white p-6 rounded-xl shadow"
          id="review-section"
        >
          <h3 className="text-xl font-bold text-blue-600 mb-4">
            Reviews Received
          </h3>
          {paginatedReviews.length > 0 ? (
            <>
              <ul className="space-y-4">
                {paginatedReviews.map((r, index) => (
                  <li key={index} className="border p-4 rounded-xl">
                    <p className="text-lg font-serif text-black">
                      Service: <span>{r.serviceTitle}</span>
                    </p>
                    <p className="text-yellow-500 mt-[-0.5em]">
                      {"★".repeat(r.rating)}
                      {"☆".repeat(5 - r.rating)}
                    </p>
                    <p className="text-gray-700">{r.comment}</p>
                    <div className="flex items-center space-x-1 mb-2">
                      <img
                        src={r.profilePhoto || defaultavatar}
                        alt="Reviewer"
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <p className="text-xs text-gray-500">{r.createdBy}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Pagination Buttons */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => {
                      if (currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                        const el = document.getElementById("review-section");
                        el && el.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      currentPage === 1
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page Number Buttons */}
                  {(() => {
                    const pageButtons = [];

                    // Helper to add page button
                    const addPageButton = (page) => {
                      pageButtons.push(
                        <button
                          key={page}
                          onClick={() => {
                            setCurrentPage(page);
                            const el =
                              document.getElementById("review-section");
                            el && el.scrollIntoView({ behavior: "smooth" });
                          }}
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    };

                    if (totalPages <= 5) {
                      // Show all pages if total <= 5
                      for (let page = 1; page <= totalPages; page++) {
                        addPageButton(page);
                      }
                    } else {
                      if (currentPage <= 3) {
                        // Show 1, 2, 3, ..., last page
                        [1, 2, 3].forEach(addPageButton);
                        pageButtons.push(
                          <span key="ellipsis" className="px-2 py-1">
                            ...
                          </span>
                        );
                        addPageButton(totalPages);
                      } else {
                        // Default fallback: just show first, ellipsis, current, last
                        addPageButton(1);
                        pageButtons.push(
                          <span key="ellipsis" className="px-2 py-1">
                            ...
                          </span>
                        );
                        addPageButton(currentPage);
                        if (currentPage !== totalPages)
                          addPageButton(totalPages);
                      }
                    }

                    return pageButtons;
                  })()}

                  {/* Next Button */}
                  <button
                    onClick={() => {
                      if (currentPage < totalPages) {
                        setCurrentPage(currentPage + 1);
                        const el = document.getElementById("review-section");
                        el && el.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      currentPage === totalPages
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    Next
                  </button>
                </div>
                //   <div className="flex justify-center items-center gap-4 mt-4">
                //     <button
                //       onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                //       disabled={currentPage === 1}
                //       className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 disabled:opacity-50"
                //     >
                //       Previous
                //   </button>

                //   <span className="text-sm text-gray-700">
                //     Page {currentPage} of {totalPages}
                //   </span>

                //   <button
                //     onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                //     disabled={currentPage === totalPages}
                //     className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 disabled:opacity-50"
                //   >
                //     Next
                //   </button>
                // </div>
              )}
            </>
          ) : (
            <p className="text-gray-500">No reviews received yet.</p>
          )}
        </div>
      </div>
      <Footer />

      {/* Animated Congratulations Popup */}
      {welcome && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
          <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-8 rounded-3xl text-center shadow-[0_0_40px_rgba(59,130,246,0.5)] border border-blue-400/30 w-[360px]">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-yellow-400 p-2 rounded-full shadow-lg">
              <span className="text-white text-xl">🎉</span>
            </div>

            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-300 to-purple-400 mt-4">
              Congratulations!
            </h2>

            <p className="text-gray-200 text-lg mt-2 font-medium">
              {user?.firstName} {user?.lastName}
            </p>

            <p className="text-gray-400 mt-4 mb-6 leading-relaxed">
              You’ve successfully joined TimeBank! Click below to claim your{" "}
              <br />{" "}
              <span className="text-blue-300 text-xl font-semibold">
                50 Time Credits
              </span>
              .
            </p>

            <button
              onClick={() => setWelcome(false)}
              className="px-6 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 transition-all"
            >
              Claim
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
