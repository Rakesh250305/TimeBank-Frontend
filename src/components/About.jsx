import Footer from "./Footer";
import { FaUsers, FaLightbulb, FaGlobe } from "react-icons/fa";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <header className="bg-blue-500 text-white py-5 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">About TimeBank</h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl">
          TimeBank is a community-driven platform where skills are exchanged for credits. Every hour you give earns an hour you can use to learn from others.
        </p>
      </header>

      <main className="py-24 px-6 md:px-16 text-center bg-gray-50">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-500 mb-12">Our Mission & Values</h2>
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
            <FaUsers className="text-blue-600 text-3xl mb-4 mx-auto" />
            <h3 className="text-1xl font-bold mb-2">Community First</h3>
            <p className="text-gray-600">Building a safe, collaborative space for everyone to share and learn skills.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
            <FaLightbulb className="text-blue-600 text-4xl mb-4 mx-auto" />
            <h3 className="text-1xl font-bold mb-2">Skill Sharing</h3>
            <p className="text-gray-600">Encouraging continuous learning and personal growth through exchanging skills.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
            <FaGlobe className="text-blue-600 text-4xl mb-4 mx-auto" />
            <h3 className="text-1xl font-bold mb-2">Global Reach</h3>
            <p className="text-gray-600">Connect with people from around the world and expand your knowledge.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
