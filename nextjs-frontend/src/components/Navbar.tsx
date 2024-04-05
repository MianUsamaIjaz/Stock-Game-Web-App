"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const Navbar = (user: any) => {
  const { data: session }: any = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminCheck, setAdminCheck] = useState(false);

  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        if (session && session.user.email) {
          const res = await fetch("/api/Navbar", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: session.user.email,
            }),
          });
          if (res.status === 200) {
            setAdminCheck(true);
          } else if (res.status === 403) {
            setAdminCheck(false);
          }
        }
      } catch (err) {
        console.error("Error fetching admin status:", err);
      }
    };

    fetchAdminStatus();
  }, [session]);


  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };


  return (
    <div>
      <ul className="flex justify-between m-10 item-center">
        <div>
          <Link href="/" passHref>
            <li>Home</li>
          </Link>
        </div>
        <div className="flex gap-10">
          
          {!session ? (
            <>
              <Link href="/login" passHref>
                <li>Login</li>
              </Link>
              <Link href="/register" passHref>
                <li>Register</li>
              </Link>
            </>
          ) : (
            <>
              {session.user?.name || session.user?.email}
              <li>
                <button
                  onClick={() => {
                    signOut();
                  }}
                  className="p-2 px-5 -mt-1 bg-blue-800 rounded-full"
                >
                  Logout
                </button>
              </li>
              <li></li>
            </>
          )}
          
          {session && (
            <div
              className="relative"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button
                onClick={toggleMenu}
                className="p-2 rounded-full bg-black"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>
              {menuOpen && (
                <ul className="absolute top-10 right-0 bg-gray shadow-md">
                  <li className="py-2 px-4 hover:bg-gray-800">

                  {adminCheck ? (
                    <>
                    <Link href="/dashboard-admin" passHref onClick={closeMenu}>
                       Dashboard
                    </Link>
                    </>
                    ) : (
                    <>
                    <Link href="/dashboard-player" passHref onClick={closeMenu}>
                       Dashboard
                    </Link>
                    </>
                  )}
                  
                  </li>
                  <li className="py-2 px-4 hover:bg-gray-800">
                  <Link href="/profile" passHref onClick={closeMenu}>
                       Profile
                    </Link>
                  </li>
                  <li className="py-2 px-4 hover:bg-gray-800">
                  <Link href="/leaderboard" passHref onClick={closeMenu}>
                       Leaderborad
                    </Link>
                  </li>
                  <li className="py-2 px-4 hover:bg-gray-800">
                    <Link href="/joinGame" passHref onClick={closeMenu}>
                       View Games
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
      </ul>
    </div>
  );
};

export default Navbar;
