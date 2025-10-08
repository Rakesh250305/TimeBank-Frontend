import { useState, useEffect } from "react";
import { getProfile, postService, getServices, requestService, completeService, getTransactions } from "../api/api";

export default function Dashboard({ token }) {
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [newService, setNewService] = useState({ title: "", description: "", skill: "" });
  const [credits, setCredits] = useState(1);

  const fetchProfile = async () => setUser((await getProfile(token)).data);
  const fetchServices = async () => setServices((await getServices(token)).data);
  const fetchTransactions = async () => setTransactions((await getTransactions(token)).data);

  const handlePostService = async () => {
    await postService(token, newService);
    setNewService({ title: "", description: "", skill: "" });
    fetchServices();
  };

  const handleRequest = async (id) => { await requestService(token, id); fetchServices(); };
  const handleComplete = async (id) => { await completeService(token, id, Number(credits), 5); fetchServices(); fetchTransactions(); fetchProfile(); };

  useEffect(() => { fetchProfile(); fetchServices(); fetchTransactions(); }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <div className="my-4 p-4 border rounded">
        <h3 className="font-bold">Profile</h3>
        <p>Name: {user.name}</p>
        <p>Wallet: {user.wallet}</p>
        <p>Trust Score: {user.trustScore.toFixed(2)}</p>
      </div>

      <div className="my-4 p-4 border rounded">
        <h3 className="font-bold">Post New Service</h3>
        <input placeholder="Title" value={newService.title} onChange={(e) => setNewService({ ...newService, title: e.target.value })} className="border p-1 m-1"/>
        <input placeholder="Description" value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} className="border p-1 m-1"/>
        <input placeholder="Skill" value={newService.skill} onChange={(e) => setNewService({ ...newService, skill: e.target.value })} className="border p-1 m-1"/>
        <button onClick={handlePostService} className="bg-blue-500 text-white p-1 rounded">Post</button>
      </div>

      <div className="my-4 p-4 border rounded">
        <h3 className="font-bold">Open Services</h3>
        {services.map(s => (
          <div key={s._id} className="border p-2 my-2">
            <p>Title: {s.title}</p>
            <p>Skill: {s.skill}</p>
            <p>Offered By: {s.offeredBy.name}</p>
            {s.status === "open" && <button onClick={() => handleRequest(s._id)} className="bg-green-500 text-white p-1 rounded">Request</button>}
            {s.status === "requested" && s.requestedBy === user._id && <button onClick={() => handleComplete(s._id)} className="bg-purple-500 text-white p-1 rounded">Complete</button>}
          </div>
        ))}
      </div>

      <div className="my-4 p-4 border rounded">
        <h3 className="font-bold">Transaction History</h3>
        {transactions.map(t => (
          <div key={t._id} className="border p-2 my-2">
            <p>Service: {t.service.title}</p>
            <p>From: {t.fromUser.name}</p>
            <p>To: {t.toUser.name}</p>
            <p>Credits: {t.credits}</p>
            <p>Rating: {t.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
