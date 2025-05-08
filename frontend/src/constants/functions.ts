import { supabase } from "@/lib/supabase";
import type { SidebarItem } from "./interfaces";
import { CalendarDays, PlusSquare, Ticket } from "lucide-react";

export const uploadImageToSupabase = async (
  file: File
): Promise<string | null> => {
  if (!file) return null;

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `events/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("images")
    .upload(filePath, file);

  if (uploadError) {
    throw new Error("Image upload failed: " + uploadError.message);
  }

  const { data: urlData } = supabase.storage
    .from("images")
    .getPublicUrl(filePath);
  return urlData.publicUrl;
};

export const getAdminSidebarItems = (): SidebarItem[] => [
  {
    name: "Events",
    path: "/admin/events",
    icon: CalendarDays,
  },
  {
    name: "Create Event",
    path: "/admin/create-event",
    icon: PlusSquare,
  },
];

export const getUserSidebarItems = (
  userId: number | string | undefined | null
): SidebarItem[] => {
  const items: SidebarItem[] = [
    {
      name: "Events",
      path: "/",
      icon: CalendarDays,
    },
  ];

  if (userId) {
    items.push({
      name: "My Bookings",
      path: "/my-bookings",
      icon: Ticket,
    });
  }

  return items;
};
