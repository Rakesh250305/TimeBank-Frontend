import axios from "axios";
import { useState, useEffect } from "react";
import { FaSearch, FaTimes, FaTools } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function AllServices() {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [openView, setOpenView] = useState(false);
    const [search, setSearch] = useState("");


    const token = sessionStorage.getItem("adminToken");

    const fetchServices = async () => {
        try {
            const res = await axios.get(`${apiUrl}/api/admin/services`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setServices(res.data.services);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const filteredServices = services.filter((service) => {

        const provider =
            `${service.offeredBy?.firstName} ${service.offeredBy?.lastName} ${service.offeredBy?.email}`
                .toLowerCase();

        const title = service.title?.toLowerCase();

        const keyword = search.toLowerCase();

        return (
            title.includes(keyword) ||
            provider.includes(keyword)
        );
    });


    const statusColor = (status) => {
        switch (status) {
            case "open": return "bg-green-100 text-green-700";
            case "requested": return "bg-gray-200 text-gray-700";
            case "processing": return "bg-yellow-100 text-yellow-700";
            case "completion_requested": return "bg-purple-100 text-purple-700";
            case "completed": return "bg-blue-100 text-blue-700";
            default: return "bg-red-100 text-red-700";
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 pb-10 mt-20">

            {/* HEADER */}
            <div className="bg-white px-8 py-4 shadow-sm sticky top-0 flex flex-col lg:flex-row justify-between gap-3 lg:items-center">
                        <h1 className="text-2xl font-bold flex gap-2 items-center">
                            <FaTools className="text-blue-500" size={24}/>
                            Services Moderation
                        </h1>
            
                        <div className="flex gap-3 items-center">
            
                            {/* SEARCH */}
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search service Name, Service provider..."
                                    className="w-84 pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                       
            
                           
                        </div>
                    </div>


            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow-lg overflow-x-auto m-6">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-left">
                        <tr>
                            <th className="p-4">#</th>
                            <th className="p-4">Service</th>
                            <th className="p-4">Provider</th>
                            <th className="p-4 text-center">Credits</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-center">Created</th>
                            <th className="p-4 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredServices.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-10 text-gray-500">
                                    No services found
                                </td>
                            </tr>
                        ) : (
                                filteredServices.map((service, i) => (
                                    <tr key={service._id} className="border-t hover:bg-indigo-50 transition">

                                        <td className="p-4 font-semibold">{i + 1}</td>

                                        {/* SERVICE */}
                                        <td className="p-4">
                                            <div className="font-semibold text-gray-800">
                                                {service.title}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {service.description}
                                            </div>
                                        </td>

                                        {/* PROVIDER */}
                                        <td className="p-4">
                                            <div
                                                onClick={() => navigate(`/applicant/${service.offeredBy._id}`)}
                                                className="cursor-pointer hover:underline"
                                            >
                                                <div className="font-medium">
                                                    {service.offeredBy.firstName} {service.offeredBy.lastName}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {service.offeredBy.email}
                                                </div>
                                            </div>
                                        </td>

                                        {/* CREDITS */}
                                        <td className="text-center font-semibold text-indigo-600">
                                            {service.completionCredits} credits
                                        </td>

                                        {/* STATUS */}
                                        <td className="text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(service.status)}`}>
                                                {service.status.replace("_", " ")}
                                            </span>
                                        </td>

                                        {/* DATE */}
                                        <td className="text-center text-gray-500">
                                            {new Date(service.createdAt).toLocaleDateString()}
                                        </td>

                                        {/* ACTION */}
                                        <td className="text-center">
                                            <button
                                                onClick={() => {
                                                    setSelectedService(service);
                                                    setOpenView(true);
                                                }}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer px-4 py-2 rounded-lg"
                                            >
                                                view
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            
                        )}


                    </tbody>
                </table>
            </div>

            {/* ================= MODAL ================= */}
            {openView && selectedService && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto py-10">
                    <div className="bg-white w-[80vw] max-w-6xl h-[80vh] rounded-2xl shadow-2xl relative overflow-auto ">

                        {/* CLOSE */}
                        <button
                            onClick={() => setOpenView(false)}
                            className="absolute top-4 right-5 text-xl text-gray-500 hover:text-red-500"
                        >
                            <FaTimes />
                        </button>

                        {/* HEADER */}
                        <div className="bg-gray-900 text-white p-6 rounded-t-2xl">
                            <h2 className="text-2xl font-bold">{selectedService.title}</h2>
                            <p className="text-gray-300 text-sm">{selectedService.description}</p>
                        </div>

                        <div className="p-6 space-y-6">

                            {/* SERVICE INFO */}
                            <div className="grid md:grid-cols-3 gap-4">

                                <div className="bg-gray-50 p-4 rounded-lg border relative">
                                    <h3 className="font-bold mb-2">Service Info</h3>
                                    <p className="px-2 py-1 rounded-lg bg-gray-200 border-2 border-gray-700 color-red-500 absolute top-2 right-3">{selectedService.status}</p>
                                    <p><b>Time Period:</b> {selectedService.timePeriod} hrs</p>
                                    <p><b>Credits Locked:</b> {selectedService.lockedCredits}</p>
                                    <p><b>Credits Transfer:</b> {selectedService.completionCredits}</p>
                                    <p><b>Completion Requested:</b> {selectedService.completionRequested ? "Yes" : "No"}</p>
                                    <p><b>Created:</b> {new Date(selectedService.createdAt).toLocaleString()}</p>
                                </div>

                                {/* PROVIDER */}
                                <div className="bg-blue-50 p-4 rounded-lg border">
                                    <h3 className="font-bold mb-2">Service Provider</h3>

                                    <div className="flex items-center gap-3">
                                        <img
                                            src={selectedService.offeredBy?.profilePhoto || "https://ui-avatars.com/api/?name=" + selectedService.offeredBy?.firstName.slice(0, 1) + selectedService.offeredBy?.lastName.slice(0, 1)}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="cursor-pointer" onClick={() => navigate(`/applicant/${selectedService.offeredBy._id}`)}>
                                            <p className="font-semibold">
                                                {selectedService.offeredBy?.firstName} {selectedService.offeredBy?.lastName}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {selectedService.offeredBy?.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* SELECTED APPLICANT */}
                                <div className="bg-green-50 p-4 rounded-lg border">
                                    <h3 className="font-bold mb-2">Selected Applicant</h3>

                                    {selectedService.selectedApplicant ? (
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={selectedService.selectedApplicant?.profilePhoto || "https://ui-avatars.com/api/?name=" + selectedService.selectedApplicant?.firstName.slice(0, 1) + selectedService.selectedApplicant?.lastName.slice(0, 1)}
                                                    className="w-12 h-12 rounded-full"
                                                />
                                                <div className="cursor-pointer" onClick={() => navigate(`/applicant/${selectedService.selectedApplicant._id}`)}>
                                                    <p className="font-semibold">
                                                        {selectedService.selectedApplicant?.firstName} {selectedService.selectedApplicant?.lastName}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {selectedService.selectedApplicant?.email}
                                                    </p>
                                                </div>
                                            </div>
                                            {selectedService.approvalMessage && (
                                                <p className="text-sm text-gray-500 my-4 italic">
                                                    "{selectedService.approvalMessage}"
                                                </p>
                                            )}

                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm">No applicant selected</p>
                                    )}
                                </div>
                            </div>

                            {/* SKILLS */}
                            <div className="bg-gray-50 p-4 rounded-lg border">
                                <h3 className="font-semibold mb-4">
                                    Skills ({selectedService.skillsRequired?.length})
                                </h3>

                                <div className="">
                                    <div className="flex flex-wrap gap-2">
                                        {selectedService.skillsRequired?.map((skill, i) => (
                                            <span key={i} className="bg-gray-200 text-gray-700 px-4 py-1 rounded-2xl text-sm">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* APPLICANTS LIST */}
                            <div className="bg-gray-50 p-4 rounded-lg border">
                                <h3 className="font-semibold mb-4">
                                    Applicants ({selectedService.applicants?.length})
                                </h3>

                                <div className="space-y-3">
                                    {selectedService.applicants?.map((app, i) => (
                                        <div
                                            key={i}
                                            className="flex justify-between items-center border p-3 rounded-lg bg-white"
                                        >
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={app.user?.profilePhoto || "https://ui-avatars.com/api/?name=" + app.user.firstName.slice(0, 1) + app.user.lastName.slice(0, 1)}
                                                    className="w-10 h-10 rounded-full"
                                                />
                                                <div className="cursor-pointer" onClick={() => navigate(`/applicant/${app.user._id}`)}>
                                                    <p className="font-semibold">
                                                        {app.user?.firstName} {app.user?.lastName}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{app.user?.email}</p>
                                                    <p className="text-xs text-gray-400">
                                                        Applied: {new Date(app.appliedAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {selectedService.selectedApplicant?._id === app.user?._id && (
                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                                                    Selected
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* COMPONENTS */

const InfoCard = ({ title, children }) => (
    <div className="bg-gray-50 p-4 rounded-xl border">
        <h3 className="font-semibold mb-2">{title}</h3>
        <div className="text-sm text-gray-700 space-y-1">{children}</div>
    </div>
);

const UserCard = ({ title, user, navigate }) => (
    <div className="bg-blue-50 p-4 rounded-xl border">
        <h3 className="font-semibold mb-3">{title}</h3>

        <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate(`/applicant/${user._id}`)}
        >
            <img
                src={
                    user.profilePhoto ||
                    `https://ui-avatars.com/api/?name=${user.firstName[0]}${user.lastName[0]}`
                }
                className="w-12 h-12 rounded-full object-cover"
            />
            <div>
                <p className="font-semibold">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
            </div>
        </div>
    </div>
);
