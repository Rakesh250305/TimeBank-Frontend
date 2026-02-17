import { FaTachometerAlt, FaUsers, FaTools, FaExchangeAlt, FaFlag, FaBell, FaEnvelope, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        sessionStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
    };

    useEffect(() => {
        if (mobileOpen) document.body.classList.add("sidebar-open");
        else document.body.classList.remove("sidebar-open");
    }, [mobileOpen]);

    return (
        <>
            {/* MOBILE TOGGLE */}
            <button
                className="fixed text-white top-4 right-4 z-[60] p-2 lg:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
            >
                {mobileOpen ? <FaTimes /> : <FaBars />} </button>

            <aside
                className={`bg-gray-800 text-white min-h-screen transition-all duration-300
                 ${collapsed ? "w-16" : "w-64"}
                 ${mobileOpen ? "fixed left-0 top-0 z-10" : "hidden lg:block"}`}
            >
                {/* HEADER */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    {!collapsed && <h2 className="text-xl font-bold">TimeBank</h2>}
                    <button onClick={() => setCollapsed(!collapsed)} className="h-8 hidden lg:block">
                        {collapsed ? <FaBars /> : <FaTimes />}
                    </button>
                </div>

                {/* MENU */}
                <nav className="justify-between flex flex-col h-full relative">
                    <div className="p-4 space-y-3 text-sm">
                        <NavLink to="/admin" className={({ isActive }) => `flex items-center gap-3 w-full hover:text-blue-400 ${isActive ? "text-blue-400" : ""}`}>
                            <FaTachometerAlt /> {!collapsed && "Dashboard"}
                        </NavLink>
                       
                       <NavLink to="/admin/users" className={({ isActive }) => `flex items-center gap-3 w-full hover:text-blue-400 ${isActive ? "text-blue-400" : ""}`}>
                            <FaUsers/> {!collapsed && "Users"}
                        </NavLink>
                        
                        <NavLink to="/admin/services" className={({ isActive }) => `flex items-center gap-3 w-full hover:text-blue-400 ${isActive ? "text-blue-400" : ""}`}>
                            <FaTools /> {!collapsed && "Services"}
                        </NavLink>

                        <NavLink to="/admin/transactions" className={({ isActive }) => `flex items-center gap-3 w-full hover:text-blue-400 ${isActive ? "text-blue-400" : ""}`}>
                            <FaExchangeAlt /> {!collapsed && "Transactions"}
                        </NavLink>

                        <NavLink to="/admin/reports" className={({ isActive }) => `flex items-center gap-3 w-full hover:text-blue-400 ${isActive ? "text-blue-400" : ""}`}>
                            <FaFlag /> {!collapsed && "Reports & Complaints"}
                        </NavLink>
                       
                        <NavLink to="/admin/broadcast" className={({ isActive }) => `flex items-center gap-3 w-full hover:text-blue-400 ${isActive ? "text-blue-400" : ""}`}>
                            <FaBell /> {!collapsed && "Broadcast Notification"}
                        </NavLink>

                        <NavLink to="/admin/contacts" className={({ isActive }) => `flex items-center gap-3 w-full hover:text-blue-400 ${isActive ? "text-blue-400" : ""}`}>
                            <FaEnvelope /> {!collapsed && "Support Messages"}
                        </NavLink>

                    </div>

                    <div className="p-4 space-y-3 text-sm lg:absolute lg:bottom-15  w-full">
                        <button
                        onClick={handleLogout}
                        className="flex items-center w-full border-red-500 border-2 text-red-500 px-2 py-4 rounded-lg hover:bg-red-500 hover:text-white"
                    >
                        <FaSignOutAlt /> {!collapsed && "Logout"}
                    </button>
                    </div>
                </nav>
            </aside>
        </>

    );
}
