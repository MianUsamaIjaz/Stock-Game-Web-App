"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Footer from "@/components/Footer";
import { fetchData } from "next-auth/client/_utils";

const ViewProfile = () => {
  const { data: session, status }: any = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [wealth, setWealth] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (session && session.user.email) {
          const res = await fetch("/api/profile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: session.user.email,
            }),
          });
          if (res.status === 200) {
            const data = await res.json();
            setProfile(data);
          } else if (res.status === 400) {
            setProfile(null);
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    const fetchWealth = async () => {
        try {
          if (session && session.user.email) {
            const res = await fetch("/api/generateWealth", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: session.user.email,
              }),
            });
            if (res.status === 200) {
              const data = await res.json();
              setWealth(data);
            } else if (res.status === 400) {
              setWealth(null);
            }
          }
        } catch (err) {
          console.error("Error fetching wealth:", err);
        }
      };

    fetchWealth();
    fetchProfile();
    
  }, [session]);

  if (status === "loading") {
    <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h1>Loading...</h1>
      </div>
  }

  if (!session) {
    return (
    <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h1>You need to be logged in to view this page.</h1>
      </div>
    )
  }

  if (!profile) {
    return <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <h1>Loading...</h1>
  </div>
  }

  // if (!wealth) {
  //   return <div
  //   style={{
  //     display: "flex",
  //     justifyContent: "center",
  //     alignItems: "center",
  //     height: "100vh",
  //   }}
  // >
  //   <h1>Loading...</h1>
  // </div>
  // }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="max-w-xl w-full bg-gray-800 rounded-lg shadow-lg p-8 mt-8">
        <h1 className="text-3xl font-semibold mb-6">Your Profile</h1>
        <div className="mb-6">
          <label className="block text-sm font-medium text-white">First Name:</label>
          <p className="mt-1 text-lg text-white">{profile.fname}</p>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-white">Last Name:</label>
          <p className="mt-1 text-lg text-white">{profile.lname}</p>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-white">Email:</label>
          <p className="mt-1 text-lg text-white">{profile.email}</p>
        </div>
        {profile.portfolio ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Portfolio</h2>
          <div className="border border-gray-700 p-4 rounded-lg bg-gray-700">
            {wealth && wealth != 0 && <h2 className="text-xl font-semibold mb-2">Total Wealth: ${wealth.toFixed(2)}</h2>}
            <div className="mb-4">
              <p className="text-lg font-medium text-white pt-2">Cash: ${profile.portfolio.cash.toFixed(2)}</p>
            </div>
            <div>
                <h3 className="text-xl font-semibold mb-2">Stocks:</h3>
                {profile.portfolio.stocks.length === 0 ? (
                    <p className="text-lg text-white">No Stocks Bought!</p>
                ) : (
                <ul>
                {profile.portfolio.stocks.map((stock: any, index: any) => (
                    <li key={index} className="mb-2">
                    <p className="text-lg text-white">{stock.name}: {stock.quantity} shares, last buying price was ${stock.lastBuyingPrice}/share.</p>
                    </li>
                ))}
                </ul>
                )}
            </div>

          </div>
        </div>
        ) : (<p></p>)}
      </div>
      <Footer />
    </div>
  );
};

export default ViewProfile;