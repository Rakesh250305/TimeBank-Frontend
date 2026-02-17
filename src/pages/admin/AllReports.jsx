import { useEffect, useState } from "react";
import axios from "axios";
import { ShieldAlert, Eye, XCircle, CheckCircle2, Ban, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AllReports() {

  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const token = sessionStorage.getItem("adminToken");
  const navigate = useNavigate();

  const [blockedUntil, setBlockedUntil] = useState("");
  const [reason, setReason] = useState("");
  const [openSuspend, setOpenSuspend] = useState(false);

  const [banReason, setBanReason] = useState("");
  const [openBan, setOpenBan] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [reportAccount, setReportAccount] = useState([]);
  const [requestDeletion, setRequestDeletion] = useState([]);
  const [openReportedAccount, setOpenReportedAccount] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedDelete, setSelectedDelete] = useState(null);

  const fetchReport = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/admin/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data)
      setReportAccount(res.data.reportAccount);
      setRequestDeletion(res.data.requestDeletion);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  // -------- ACTIONS --------

  const handleSuspend = async () => {
    try {
      await axios.put(
        `${apiUrl}/api/admin/suspend/${selectedUser._id}`,
        {
          user: selectedUser._id,
          blockedUntil,
          reason
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOpenSuspend(false);
      fetchReport();
      setReason("");
      setBlockedUntil("");
    } catch (err) {
      alert("Failed to suspend user");
    }
  };

  const handleBan = async () => {
    try {
      await axios.put(
        `${apiUrl}/api/admin/ban/${selectedUser._id}`,
        { user: selectedUser._id, reason: banReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOpenBan(false);
      fetchReport();
      setBanReason("");
    } catch {
      alert("Ban failed");
    }
  };

  const handleUnBan = async (id) => {
    try {
      await axios.put(
        `${apiUrl}/api/admin/unBan`, { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchReport();
    } catch {
      alert("UnBan failed");
    }
  };


  return (
    <div className="mt-20 pb-10 bg-slate-100 min-h-screen">

      {/* Headers */}
      <div className="bg-white px-8 py-4 shadow-sm sticky top-0 flex gap-2 items-center">
        <ShieldAlert className="text-red-600" size={28} />
        <h1 className="text-2xl font-bold">Reports and Complaints</h1>
      </div>
      <div className="flex items-center gap-3 mb-8">

      </div>

      {/* ================= REPORTED USERS ================= */}
      <div className="bg-white rounded-2xl shadow-xl m-6 overflow-x-auto">

        <h2 className="text-xl font-semibold p-6 border-b">
          Reported Accounts
        </h2>

        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 uppercase text-gray-600">
            <tr>
              <th className="p-4 text-left">#</th>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Reason</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {reportAccount.map((report, i) => (
              <tr key={report._id} className="border-t hover:bg-red-50 transition">
                <td className="p-4">{i + 1}.</td>
                {/* USER */}
                <td className="p-4">
                  <div className="font-semibold">
                    {report.reportedUser?.firstName} {report.reportedUser?.lastName}
                  </div>
                  <div className="text-indigo-600 text-xs cursor-pointer" onClick={() => navigate(`/applicant/${report.reportedUser._id}`)}>
                    {report.reportedUser?.email}
                  </div>
                </td>

                {/* REASON */}
                <td className="p-4 text-red-600 font-medium">
                  {report.reason}
                </td>

                {/* STATUS BADGE */}
                <td className="p-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs
                    ${report.reportedUser?.isBanned === true
                      ? "bg-red-200 text-red-600"
                      : report.reportedUser?.isSuspended === true
                        ? "bg-yellow-200 text-yellow-600"
                        : "bg-green-200 text-green-600"
                    }
                  `}>
                    {report.reportedUser.isBanned ? "Banned" :
                      report.reportedUser.isSuspended ? "Suspend" : "Active"
                    }
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="p-4 text-center items-center space-x-2">
                  <button>
                    <button
                    onClick={() => {
                      setSelectedUser(report);
                      setOpenReportedAccount(true);
                    }}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs cursor-pointer items-center gap-1 inline-flex"
                  >
                    view
                  </button>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(report.reportedUser);
                      setOpenSuspend(true);
                      // console.log(report.reportedUser);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-xs cursor-pointer items-center gap-1 inline-flex"
                  >
                    <XCircle size={14} /> Suspend
                  </button>

                  {
                    report.reportedUser.isBanned === false ?
                      <button
                        onClick={() => {
                          setSelectedUser(report.reportedUser);
                          setOpenBan(true);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs cursor-pointer items-center gap-1 inline-flex font-semibold"
                      >
                        <Ban size={14} /> Ban
                      </button> :
                      <button
                        onClick={() => {
                          handleUnBan(report.reportedUser._id);
                        }}
                        className="bg-emerald-500 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg text-xs cursor-pointer items-center gap-1 inline-flex font-semibold"
                      >
                        <Ban size={14} /> UnBan
                      </button>
                  }

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= ACCOUNT DELETION ================= */}
      <div className="bg-white rounded-2xl shadow-xl m-6 overflow-x-auto">

        <h2 className="text-xl font-semibold p-6 border-b">
          Account Deletion Requests
        </h2>

        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 uppercase text-gray-600">
            <tr>
              <th className="p-4 text-left">#</th>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Message</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Date</th>
              <th className="p-4 text-center">View</th>
            </tr>
          </thead>

          <tbody>
            {requestDeletion.map((req, i) => (
              <tr key={req._id} className="border-t hover:bg-indigo-50">
                <td className="p-4">{i + 1}.</td>

                <td className="p-4">
                  <div className="font-semibold">
                    {req.deletionAccount?.firstName} {req.deletionAccount?.lastName}
                  </div>
                  <div className="text-indigo-600 text-xs cursor-pointer" onClick={() => navigate(`/applicant/${req.deletionAccount._id}`)}>
                    {req.deletionAccount?.email}
                  </div>
                </td>

                <td className="p-4 text-gray-700 truncate max-w-sm">
                  {req.message}
                </td>

                   <td className="p-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs
                    ${req.deletionAccount?.isBanned === true
                      ? "bg-red-200 text-red-600"
                        : "bg-green-200 text-green-600"
                    }
                  `}>
                    {req.deletionAccount?.isBanned ? "Banned" : "Active"
                    }
                  </span>
                </td>

                <td className="p-4 text-center text-gray-500">
                  {new Date(req.createdAt).toLocaleString()}
                </td>

                <td className="p-4 text-center space-x-2">
                  <button
                    onClick={() => setSelectedDelete(req)}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 cursor-pointer py-1 rounded-lg text-xs"
                  >
                    View
                  </button>

                  {req.deletionAccount?.isBanned === false ?
                      <button
                        onClick={() => {
                          setSelectedUser(req.deletionAccount);
                          setOpenBan(true);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs cursor-pointer items-center gap-1 inline-flex font-semibold"
                      >
                        <Ban size={14} /> Ban
                      </button> :
                      <button
                        onClick={() => {
                          handleUnBan(req.deletionAccount._id);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg text-xs cursor-pointer items-center gap-1 inline-flex font-semibold"
                      >
                        <Ban size={14} /> UnBan
                      </button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* REPORT PROOF MODAL */}
      {selectedReport && (
        <div className="fixed inset-0  bg-black/50 flex items-center justify-center z-20">

          <div className="bg-white rounded-2xl p-6 w-[90%] lg:w-[50%] h-[70%] relative">

            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4"
            >
              ✖
            </button>
          <h2 className="font-bold mb-4">Report Evidence</h2>

            <img
              src={`${apiUrl}${selectedReport.proof}`}
              alt="proof"
              className="rounded-lg border w-56 h-42"
            />
          

          </div>
        </div>
      )}

      {/* selected reported account view modal */}
      {openReportedAccount && 
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10">

          <div className="bg-white rounded-2xl p-6 w-[90%] md:w-[550px] relative">

            <button
              onClick={() => setOpenReportedAccount(false)}
              className="absolute top-4 right-4"
            >
              ✖
            </button>

            <h2 className="text-xl font-bold mb-4">Reported Account</h2> <hr />
            <div className="flex gap-4 items-center my-2">
              <img className="h-10 w-10 rounded-full" src={"https://ui-avatars.com/api/?name=" + selectedUser.reportedUser.firstName.slice(0, 1) + selectedUser.reportedUser.lastName.slice(0, 1)} alt="profile" />
              <div>
                <p className="font-semibold" > {selectedUser.reportedUser.firstName} {selectedUser.reportedUser.lastName}</p>
                <p > {selectedUser.reportedUser.email}</p>
              </div>
            </div>
            <p className="mb-2"><b>Date:</b> {new Date(selectedUser.createdAt).toLocaleString()}</p>

             {selectedUser.proof ? (
              <div className="flex gap-2"><p className="font-bold">Evidence Proof:</p>
                    <button
                      onClick={() => setSelectedReport(selectedUser)}
                      className="flex items-center cursor-pointer gap-1 text-indigo-600 hover:underline"
                    >
                      <Image size={16} /> View
                    </button></div>
                  ) : (
                    <span className="text-gray-400 text-xs">No Proof</span>
                  )}
            <div className="bg-slate-100 p-4 rounded-lg mt-4 whitespace-pre-wrap">
              {selectedUser.reason}
            </div>

{selectedUser.reportedUser?.banReason && 
<div className="bg-red-200 text-red-600 p-4 rounded-lg mt-4 whitespace-pre-wrap">
              <p className="font-bold">Ban Reason:</p>
              {selectedUser.reportedUser?.banReason}
            </div>}

            {selectedUser.reportedUser?.suspendReason && 
<div className="bg-yellow-200 text-yellow-600 p-4 rounded-lg mt-4 whitespace-pre-wrap">
              <p className="font-bold">Suspend Reason:</p>
              {selectedUser.reportedUser?.suspendReason}
              <p className="font-bold">Suspend Until
              </p>
              {selectedUser.reportedUser?.suspendedUntil}
            </div>}

          </div>
        </div>
      }

      {/* Selected deleted view MODAL */}
      {selectedDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl p-6 w-[90%] md:w-[550px] relative">

            <button
              onClick={() => setSelectedDelete(null)}
              className="absolute top-4 right-4"
            >
              ✖
            </button>

            <h2 className="text-xl font-bold mb-4">Deletion Request</h2> <hr />
            <div className="flex gap-4 items-center my-2">
              <img className="h-10 w-10 rounded-full" src={selectedDelete.deletionAccount.profilePhoto || "https://ui-avatars.com/api/?name=" + selectedDelete.deletionAccount.firstName.slice(0, 1) + selectedDelete.deletionAccount.lastName.slice(0, 1)} alt="profile" />
              <div>
                <p className="font-semibold" > {selectedDelete.deletionAccount.firstName} {selectedDelete.deletionAccount.firstName}</p>
                <p > {selectedDelete.email}</p>
              </div>
            </div>
            <p className="mb-2"><b>Date:</b> {new Date(selectedDelete.createdAt).toLocaleString()}</p>

            <div className="bg-slate-100 p-4 rounded-lg mt-4 whitespace-pre-wrap">
              {selectedDelete.message}
            </div>

{selectedDelete.deletionAccount?.banReason && 
<div className="bg-red-200 text-red-600 p-4 rounded-lg mt-4 whitespace-pre-wrap">
              <p className="font-bold">Ban Reason:</p>
              {selectedDelete.deletionAccount?.banReason}
            </div>}

          </div>
        </div>
      )}

      {/* SUSPEND MODAL */}
      {openSuspend && selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[400px] p-6">

            <h2 className="text-xl font-bold mb-4">
              Suspend :  <span className="text-gray-600">{selectedUser.firstName} {selectedUser.lastName}</span>
            </h2>

            <label className="block text-sm mb-1">Suspend Until</label>
            <input
              type="datetime-local"
              className="w-full border rounded-lg p-2 mb-4"
              value={blockedUntil}
              onChange={(e) => setBlockedUntil(e.target.value)}
            />

            <label className="block text-sm mb-1">Reason</label>
            <textarea
              className="w-full border rounded-lg p-2 mb-4"
              rows="3"
              placeholder="Enter reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpenSuspend(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleSuspend}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Confirm Suspend
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BAN USER MODAL */}
      {openBan && selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[420px] p-6">

            <h2 className="text-xl font-bold mb-4">
              Ban User : {selectedUser.firstName} {selectedUser.lastName}
            </h2>

            <label className="text-sm">Reason for Ban</label>
            <textarea
              className="w-full border rounded-lg p-2 mt-2 mb-4"
              rows="3"
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpenBan(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleBan}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Confirm Ban
              </button>
            </div>

          </div>
        </div>
      )}


    </div>
  );
}
