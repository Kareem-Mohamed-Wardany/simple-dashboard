import React from "react";
import { useDispatch } from "react-redux";
import { setLogOut } from "@/store/auth-slice";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  function handleLogout() {
    dispatch(setLogOut());
    toast.success("Logged out successfully!");
    router.push("/auth/login");
  }
  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-indigo-600">BOOK STORE</h1>
            <div className="flex space-x-4">
              <button
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
