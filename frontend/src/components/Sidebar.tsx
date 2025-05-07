import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { adminSidebarItems, userSidebarItems } from "@/constants/sidebar-items";
import { Calendar } from "lucide-react";

export function AppSidebar() {
  const { user } = useAuth();
  let items;
  if (user && user.isAdmin) {
    items = adminSidebarItems;
  } else {
    items = userSidebarItems;
  }
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-9 py-6">
            <Calendar className="h-5 w-5 mr-2" /> Booking System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items?.map((item) => (
                <SidebarMenuItem className="p-1" key={item?.name}>
                  <SidebarMenuButton className="shadow-md w-full p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-white text-black dark:text-white">
                    <a href={item?.path}>
                      <item.icon />
                      <span>{item?.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
