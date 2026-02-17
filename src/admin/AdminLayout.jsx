import Sidebar from "../components/admin/Sidebar";
import AdminTopNav from "../components/admin/AdminTopNav";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex flex-row h-screen overflow-hidden w-full">
      <Sidebar />
      <div className="m-auto w-full flex flex-col flex-1 overflow-auto">
        <AdminTopNav />
        <div className="h-[100vh] scroll-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
