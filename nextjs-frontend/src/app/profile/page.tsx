// "use client";
// import React, { useState } from "react";
// import { useSession } from "next-auth/react";
// import { Player } from "../../../../player.mjs";

// const ViewProfile = async () => {

//   const { data: session, status }: any = useSession();
//   const [email, setEmail] = useState<string>("");
//   let player = await new Player();

//   if (status === "loading") {
//     return <div>Loading...</div>;
//   }

//   if (!session) {
//     // Redirect if user is not authenticated
//     return <div>You need to be logged in to view this page.</div>;
//   }

//   try {

//     const response = await fetch(`/player/${email}`);
//     if (!response.ok) {
//       throw new Error("Failed to fetch player details");
//     }
//     player = await response.json();   
//     setEmail(player.email);   

//   } catch (error) {
//     console.error(error);
//   }


//   if (!player) {
//     return <div>Player Not Found</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
//       <div className="max-w-xl w-full bg-white rounded-lg shadow-lg p-8 mt-8">
//         <h1 className="text-3xl font-semibold mb-6">Your Profile</h1>
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700">First Name:</label>
//           <p className="mt-1 text-lg text-gray-900">{player.fname}</p>
//         </div>
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700">Last Name:</label>
//           <p className="mt-1 text-lg text-gray-900">{player.lname}</p>
//         </div>
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700">Email:</label>
//           <p className="mt-1 text-lg text-gray-900">{player.email}</p>
//         </div>
//         <div>
//           <h2 className="text-2xl font-semibold mb-4">Portfolio</h2>
//           <div className="border border-gray-200 p-4 rounded-lg bg-gray-50">
//             <div className="mb-4">
//               <p className="text-lg font-medium text-gray-800">Cash: ${player.portfolio.cash}</p>
//             </div>
//             <div>
//               <h3 className="text-xl font-semibold mb-2">Stocks:</h3>
//               <ul>
//                 {player.portfolio.stocks.map((stock: any, index: any) => (
//                   <li key={index} className="mb-2">
//                     <p className="text-lg text-gray-800">{stock.name}: {stock.quantity} shares</p>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewProfile;
