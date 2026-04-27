import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaEdit } from "react-icons/fa";

const apiUrl = import.meta.env.VITE_BACKEND_URL;
const socket = io(`${apiUrl}`);

const tabs = [
  { id: "services", label: "Service Requests" },
  { id: "reviews", label: "Reviews" },
  { id: "experience", label: "Experience" },
];

const getStatusMeta = (status) => {
  switch (status) {
    case "processing":
      return {
        label: "Accepted",
        classes: "bg-sky-100 text-sky-700 ring-1 ring-sky-200",
      };
    case "completed":
      return {
        label: "Completed",
        classes: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
      };
    case "rejected":
      return {
        label: "Reopened",
        classes: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
      };
    case "requested":
    case "open":
    default:
      return {
        label: "Pending",
        classes: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
      };
  }
};

const DetailRow = ({ label, value }) => (
  <div className="flex items-start gap-3 text-sm text-slate-600">
    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
      <span className="text-xs font-bold">{label.slice(0, 1)}</span>
    </div>
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-700">{value || "-"}</p>
    </div>
  </div>
);

const StatCard = ({ value, label }) => (
  <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-center shadow-sm">
    <p className="text-2xl font-bold text-slate-800">{value}</p>
    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
  </div>
);

export default function Profile({ token }) {
  const [user, setUser] = useState(null);
  const [welcome, setWelcome] = useState(false);
  const [appliedServices, setAppliedServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("services");
  const reviewsPerPage = 3;
  const navigate = useNavigate();

  const fetchAppliedServices = async (userId) => {
    try {
      const res = await axios.get(`${apiUrl}/api/services/applied`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const myApplied = res.data.filter((service) =>
  service.applicants?.some(
    (app) => String(app.user) === String(userId)
  )
);

      setAppliedServices(myApplied);
      // console.log(myApplied);
    } catch (err) {
      console.error("Fetch applied services error:", err);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = {
        ...res.data.data,
        profilePhoto: res.data.data.profilePhoto || null,
      };

      setReviews(userData.reviews || []);
      setUser({
        ...userData,
        requestedServices: res.data.requestedServices || [],
      });

      fetchAppliedServices(userData._id || res.data._id);
    } catch (err) {
      console.error("Fetch profile error:", err);
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
      reviews?.length,
    ];

    const filled = fields.filter((field) => field && field !== "").length;
    return Math.round((filled / fields.length) * 100);
  };

  const profileCompletion = calculateProfileCompletion();
  const sortedReviews = useMemo(
    () =>
      [...(reviews || [])].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ),
    [reviews]
  );
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const paginatedReviews = sortedReviews.slice(
    startIndex,
    startIndex + reviewsPerPage
  );
  const averageRating = reviews.length
    ? (
        reviews.reduce((sum, review) => sum + (Number(review.rating) || 0), 0) /
        reviews.length
      ).toFixed(1)
    : "0.0";

  const addressLine = user?.address
    ? [
        user.address.street1,
        user.address.street2,
        user.address.city,
        user.address.state,
        user.address.country,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

  const heroImage =
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80";
  const initials = `${user?.firstName?.[0] || "U"}${user?.lastName?.[0] || ""}`;
  const experiences = user?.experiences || [];
  const academics = user?.academics || [];
  const skills = user?.skills || [];

  console.log(academics);
  useEffect(() => {
    if (token) fetchProfile();
  }, [token]);

  useEffect(() => {
    setCurrentPage(1);
  }, [reviews]);

  useEffect(() => {
    if (localStorage.getItem("firstLogin")) {
      setWelcome(true);
      localStorage.removeItem("firstLogin");
    }
  }, []);

  useEffect(() => {
    if (!user?._id) return;

    socket.emit("join", user._id);

    socket.on("notification", (notif) => {
      setUser((prev) => ({
        ...prev,
        requestedServices: (prev?.requestedServices || []).map((service) =>
          String(service._id) === String(notif.serviceId)
            ? { ...service, status: notif.status }
            : service
        ),
        notifications: [notif, ...(prev?.notifications || [])],
      }));

      setAppliedServices((prev) =>
        prev.map((service) =>
          String(service._id) === String(notif.serviceId)
            ? { ...service, status: notif.status }
            : service
        )
      );
    });

    return () => {
      socket.off("notification");
    };
  }, [user?._id]);

  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90">
        <div className="flex flex-col items-center">
          <div className="h-20 w-20 animate-spin rounded-full border-4 border-slate-300 border-t-sky-500" />
          <p className="mt-4 text-lg font-medium text-white">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f9fc] text-slate-800">
      <Navbar token={token} />

      <main className="flex-1 pt-20 md:pt-20">
        <section className="mx-auto w-full px-4 pb-12 ">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
            <div
              className="relative h-48 md:h-64"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.2), rgba(14,116,144,0.25)), url(${heroImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/45 to-white/10" />
            </div>

            <div className="relative px-5 pb-6 sm:px-8 lg:px-10">
              <div className="-mt-26 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                  <div className="relative h-28 w-28">
                    {user?.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt="Profile"
                        className="w-full h-full rounded-[1.75rem] border-4 border-white object-cover shadow-lg"
                      />
                    ) : (
                      <div className="flex w-full h-full items-center justify-center rounded-[1.75rem] border-4 border-white bg-gradient-to-br from-sky-500 to-cyan-400 text-3xl font-bold text-white shadow-lg">
                        {initials}
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-white bg-emerald-500" />
                  </div>

                  <div className="pb-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-600">
                      TimeBank Profile
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                      {user?.firstName || "User"} {user?.lastName || ""}
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                      {user?.bio ||
                        "Build trust, exchange skills, and keep your TimeBank profile polished so people can confidently collaborate with you."}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/account")}
                  className="hidden md:block items-center justify-center rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
                >
                  Edit profile
                </button>

                <button
                  onClick={() => navigate("/account")}
                  className="md:hidden block absolute top-30 right-2 items-center justify-center rounded-2xl bg-emerald-500 px-4 py-3 text-white shadow-sm transition hover:bg-emerald-600"
                >
                  <FaEdit />
                </button>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                <aside className="space-y-4">
                  <div className="rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-white to-sky-50 p-5 shadow-sm">
                    <div className="space-y-4">
                      <DetailRow label="Email" value={user.email} />
                      <DetailRow label="Phone" value={user.phone} />
                      <DetailRow label="Location" value={addressLine || "-"} />
                      <DetailRow label="Hours" value={user.availability || "-"} />
                    </div>

                    <div className="my-5 h-px bg-slate-200" />

                    <div className="flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                          Time Credits
                        </p>
                        <p className="mt-1 text-2xl font-bold text-slate-900">
                          {user.wallet || 0}
                        </p>
                      </div>
                      <div className="rounded-full bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-700">
                        Wallet
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl bg-white/80 px-4 py-4">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-600">
                          Profile completion
                        </span>
                        <span className="font-semibold text-emerald-600">
                          {profileCompletion}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-sky-500"
                          style={{ width: `${profileCompletion}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                      Skills
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {skills.length > 0 ? (
                        skills.map((skill, index) => (
                          <span
                            key={`${skill}-${index}`}
                            className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 ring-1 ring-sky-200"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">No skills added yet.</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <StatCard value={appliedServices.length} label="Services" />
                    <StatCard value={reviews.length} label="Reviews" />
                    <StatCard value={averageRating} label="Avg rating" />
                    <StatCard value={experiences.length} label="Experience" />
                  </div>

                  <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                      Education
                    </p>
                    <div className="mt-4 space-y-3">
                      {academics.length > 0 ? (
                        academics.map((item, index) => (
                          <div
                            key={item._id || index}
                            className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                          >
                            <p className="font-semibold text-slate-800 uppercase">
                              {item.title || "Academic record"} | {item.year || ""} 
                            </p> 
                            <p className="mt-1 text-sm text-slate-600">
                              {item.university || "-"} | {item.percentage || "-"}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">
                          No education details added yet.
                        </p>
                      )}
                    </div>
                  </div>
                </aside>

                <section className="min-w-0">
                  <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-4">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                            activeTab === tab.id
                              ? "bg-slate-900 text-white shadow-sm"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {tab.label}
                          <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                            {tab.id === "services"
                              ? appliedServices.length
                              : tab.id === "reviews"
                              ? reviews.length
                              : experiences.length}
                          </span>
                        </button>
                      ))}
                    </div>

                    {activeTab === "services" && (
                      <div className="mt-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-xl font-bold text-slate-900">
                              My Service Requests
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                              A light, easy-to-scan overview of the services you have requested.
                            </p>
                          </div>
                          {appliedServices.length > 3 && (
                            <button
                              onClick={() => navigate("/applied-services")}
                              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              View all
                            </button>
                          )}
                        </div>

                        {appliedServices.length > 0 ? (
                          appliedServices.map((service) => {
                            const statusMeta = getStatusMeta(service.status);

                            return (
                              <div
                                key={service._id}
                                className="rounded-[1.5rem] border border-slate-200 bg-gradient-to-r from-white to-slate-50 p-5 shadow-sm"
                              >
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                  <div className="min-w-0">
                                    <p className="text-lg font-semibold text-slate-900">
                                      {service.title}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">
                                      Offered by{" "}
                                      <span className="font-medium text-sky-700">
                                        {service.offeredBy?.email || "Unknown user"}
                                      </span>
                                    </p>
                                    {service.description && (
                                      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                                        {service.description}
                                      </p>
                                    )}
                                  </div>

                                  <span
                                    className={`inline-flex items-center self-start rounded-full px-4 py-2 text-sm font-semibold ${statusMeta.classes}`}
                                  >
                                    <span className="mr-2 h-2 w-2 rounded-full bg-current opacity-70" />
                                    {statusMeta.label}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                            <p className="text-base font-medium text-slate-700">
                              You have not applied to any services yet.
                            </p>
                            <p className="mt-2 text-sm text-slate-500">
                              Explore the services page and request help from the community when you are ready.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "reviews" && (
                      <div className="mt-5" id="review-section">
                        <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
                          <div className="rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm">
                            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-500">
                              Rating overview
                            </p>
                            <p className="mt-4 text-5xl font-bold text-slate-900">
                              {averageRating}
                            </p>
                            <p className="mt-2 text-amber-500">
                              {"\u2605".repeat(Math.round(Number(averageRating)))}
                              {"\u2606".repeat(5 - Math.round(Number(averageRating)))}
                            </p>
                            <p className="mt-2 text-sm text-slate-500">
                              {reviews.length} review{reviews.length === 1 ? "" : "s"}
                            </p>
                          </div>

                          <div className="space-y-4">
                            {paginatedReviews.length > 0 ? (
                              paginatedReviews.map((review, index) => (
                                <div
                                  key={review._id || index}
                                  className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
                                >
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                      <img
                                        src={
                                          review.profilePhoto ||
                                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                            review.createdBy || "User"
                                          )}&background=0ea5e9&color=fff`
                                        }
                                        alt="Reviewer"
                                        className="h-12 w-12 rounded-2xl object-cover"
                                      />
                                      <div>
                                        <p className="font-semibold text-slate-900">
                                          {review.createdBy || "Anonymous"}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                          {review.serviceTitle || "Service review"}
                                        </p>
                                      </div>
                                    </div>
                                    <p className="text-xs text-slate-400">
                                      {review.createdAt
                                        ? new Date(review.createdAt).toLocaleDateString()
                                        : ""}
                                    </p>
                                  </div>

                                  <p className="mt-4 text-amber-500">
                                    {"\u2605".repeat(review.rating || 0)}
                                    {"\u2606".repeat(5 - (review.rating || 0))}
                                  </p>
                                  <p className="mt-3 text-sm leading-6 text-slate-600">
                                    {review.comment || "No written review provided."}
                                  </p>
                                </div>
                              ))
                            ) : (
                              <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                                <p className="text-base font-medium text-slate-700">
                                  No reviews received yet.
                                </p>
                                <p className="mt-2 text-sm text-slate-500">
                                  Your future collaborations will appear here.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {totalPages > 1 && (
                          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                if (currentPage > 1) {
                                  setCurrentPage(currentPage - 1);
                                  const el = document.getElementById("review-section");
                                  el && el.scrollIntoView({ behavior: "smooth" });
                                }
                              }}
                              disabled={currentPage === 1}
                              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                                currentPage === 1
                                  ? "cursor-not-allowed bg-slate-100 text-slate-400"
                                  : "bg-slate-900 text-white hover:bg-slate-800"
                              }`}
                            >
                              Previous
                            </button>

                            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                              (page) => (
                                <button
                                  key={page}
                                  onClick={() => {
                                    setCurrentPage(page);
                                    const el = document.getElementById("review-section");
                                    el && el.scrollIntoView({ behavior: "smooth" });
                                  }}
                                  className={`h-10 w-10 rounded-full text-sm font-semibold ${
                                    currentPage === page
                                      ? "bg-sky-500 text-white"
                                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                  }`}
                                >
                                  {page}
                                </button>
                              )
                            )}

                            <button
                              onClick={() => {
                                if (currentPage < totalPages) {
                                  setCurrentPage(currentPage + 1);
                                  const el = document.getElementById("review-section");
                                  el && el.scrollIntoView({ behavior: "smooth" });
                                }
                              }}
                              disabled={currentPage === totalPages}
                              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                                currentPage === totalPages
                                  ? "cursor-not-allowed bg-slate-100 text-slate-400"
                                  : "bg-slate-900 text-white hover:bg-slate-800"
                              }`}
                            >
                              Next
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "experience" && (
                      <div className="mt-5 space-y-5">
                        <div>
                          <h2 className="text-xl font-bold text-slate-900">
                            Experience Timeline
                          </h2>
                          <p className="mt-1 text-sm text-slate-500">
                            Highlight the work, volunteering, or community contributions that build trust on your profile.
                          </p>
                        </div>

                        {experiences.length > 0 ? (
                          <div className="space-y-5">
                            {experiences.map((item, index) => (
                              <div
                                key={item._id || index}
                                className="rounded-[1.5rem] border border-slate-200 bg-gradient-to-r from-white to-cyan-50/40 p-5 shadow-sm"
                              >
                                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                  <div>
                                    <p className="text-lg font-semibold text-slate-900">
                                      {item.title || item.role || "Experience"}
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-sky-700">
                                      {item.company || item.organization || "Community work"}
                                    </p>
                                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                                      {item.description ||
                                        "Add a short description here so others can understand your background and strengths."}
                                    </p>
                                  </div>

                                  <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                                    {item.years || "Timeline"} Years
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                            <p className="text-base font-medium text-slate-700">
                              No experience details added yet.
                            </p>
                            <p className="mt-2 text-sm text-slate-500">
                              Add your work, volunteering, or personal projects from the account page.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {welcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-[2rem] border border-white/70 bg-white p-8 text-center shadow-[0_35px_80px_rgba(14,165,233,0.22)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-orange-300 to-pink-300 text-2xl shadow-lg">
              *
            </div>
            <h2 className="mt-5 text-3xl font-bold text-slate-900">
              Welcome to TimeBank
            </h2>
            <p className="mt-2 text-lg font-medium text-sky-700">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Your account is ready. Claim your starter reward and begin exchanging time, skills, and support with the community.
            </p>
            <div className="mt-6 rounded-2xl bg-sky-50 px-4 py-3 text-sky-700">
              <span className="text-2xl font-bold">50</span>
              <span className="ml-2 text-sm font-semibold uppercase tracking-[0.2em]">
                Time Credits
              </span>
            </div>
            <button
              onClick={() => setWelcome(false)}
              className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Claim credits
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
