"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const { data: session, status: sessionStatus } = useSession();
  let adminCheck = false;


  useEffect(() => {
    if (sessionStatus === "authenticated") {
      if (adminCheck) {
        router.replace("/dashboard-admin");
      } else {        
        router.replace("/dashboard-player");
      }
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password is invalid");
      return;
    }    

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });   
    
    try {

      let res = await fetch(`/getAdmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      adminCheck = res.ok;

    } catch (err) {
      console.log(err);
      
    }

    if (res?.error) {
      setError("Invalid email or password");
      if (res?.url && adminCheck) router.replace("/dashboard-admin");
      if (res?.url && !adminCheck) router.replace("/dashboard-player");

    } else {
      setError("");

      if (adminCheck) {
        router.replace("/dashboard-admin");
      } else {
        router.replace("/dashboard-player");
      }

    }
  };

  if (sessionStatus === "loading") {
    return (
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
    );
  }

  return (
    sessionStatus !== "authenticated" && (
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="bg-[#212121] p-8 rounded shadow-md w-96">
          <h1 className="text-4xl text-center font-semibold mb-8">Login</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-400 focus:text-black"
              placeholder="Email"
              required
            />
            <input
              type="password"
              className="w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-400 focus:text-black"
              placeholder="Password"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              {" "}
              Sign In
            </button>
            <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
          </form>
          <button
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
            onClick={() => {
              signIn("github");
            }}
          >
            Sign In with Github
          </button>
          <div className="text-center text-gray-500 mt-4">- OR -</div>
          <Link
            className="block text-center text-blue-500 hover:underline mt-2"
            href="/register"
          >
            Register Here
          </Link>
        </div>
        <Footer />
      </div>
    )
  );
};

export default Login;