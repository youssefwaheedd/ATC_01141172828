import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { SidebarTrigger } from "../ui/sidebar";
import { Theme } from "../Theme";
import { Button } from "../ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { Calendar, Menu, X } from "lucide-react";
import {
  getAdminSidebarItems,
  getUserSidebarItems,
} from "@/constants/functions";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  let items;
  if (user && user.isAdmin) {
    items = getAdminSidebarItems();
  } else {
    items = getUserSidebarItems(user?.id);
  }

  return (
    <nav className="dark:bg-black bg-white dark:text-white text-black p-4 shadow-md sticky -top-1 z-50">
      <div className=" mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="  p-6 cursor-pointer flex max-lg:hidden justify-center items-center border-b" />{" "}
          <Link
            to="/"
            className="flex max-lg:hidden text-xl font-bold hover:text-gray-300"
          >
            AREEB TECHNOLOGY
          </Link>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild className=" max-lg:inline hidden">
              <Menu className="h-7 w-7" />
            </SheetTrigger>
            <SheetContent
              side="left"
              className=" border-none max-lg:inline hidden"
            >
              <div className="absolute top-4 right-4">
                {" "}
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" aria-label="Close panel">
                    <X className="h-2 w-2" />
                  </Button>
                </SheetClose>
              </div>
              <Link
                to="/"
                className="flex items-center gap-2 mb-8 w-full border-b-2 border-border p-6"
                onClick={() => setIsSheetOpen(false)}
              >
                <Calendar className="h-5 w-5 text-primary" />
                <p className="title text-sm">Booking System</p>
              </Link>
              <div className="flex flex-col gap-3 p-4 ">
                {items?.map((item) => (
                  <Link
                    className="flex gap-2 items-centershadow-md w-full p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-white text-black dark:text-white"
                    key={item?.name}
                    to={item?.path}
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <item.icon />
                    {item?.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex items-center gap-4">
          <Theme />
          {user ? (
            <>
              <Button
                onClick={logout}
                className="hover:text-red-400 cursor-pointer"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button className="cursor-pointer ">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="cursor-pointer ">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
