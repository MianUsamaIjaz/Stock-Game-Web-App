// next.config.mjs
export default {

  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.resolve.fallback = {
  //       fs: false, // Exclude 'fs' module
  //       child_process: false, // Exclude 'child_process' module
  //       net: false,
  //       tls: false,
  //       dns: false,
  //       aws4: false,

  //       // Add other exclusions if needed
  //     };
  //   }
  //   return config;
  // },

    async rewrites() {
      return [
        {
          source: '/stock/:path*', // Match requests to /stock/:stockName and any additional path
          destination: 'http://localhost:4000/stock/:path*', // Proxy to corresponding route on backend server
        },
        {
          source: '/player/:path*', // Match requests to /player/:playerEmail and any additional path
          destination: 'http://localhost:4000/player/:path*', // Proxy to corresponding route on backend server
        },
        {
          source: '/leaderboard/:path*', // Match requests to /leaderboard and any additional path
          destination: 'http://localhost:4000/leaderboard/:path*', // Proxy to corresponding route on backend server
        },
        {
          source: '/checkWinner/:path*', // Match requests to /checkWinner and any additional path
          destination: 'http://localhost:4000/checkWinner/:path*', // Proxy to corresponding route on backend server
        },
        {
          source: '/getAdmin/:path*', // Match requests to /checkWinner and any additional path
          destination: 'http://localhost:4000/getAdmin/:path*', // Proxy to corresponding route on backend server
        },
        // Add more rewrite rules for other routes as needed
      ];
    },
  };
  