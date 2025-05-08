// src/Layout.tsx
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/Sidebar";
import Navbar from "@/components/shared/Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-screen w-full ">
        <AppSidebar />

        <div className="flex-1 flex flex-col ">
          <main>
            <Navbar />
            <div className="flex-1 overflow-y-auto p-4 md:p-6  z-10">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
