// next.config.mjs
export default {
    async rewrites() {
      return [
        {
          source: '/stock/:path*', // Match requests to /stock/:stockName and any additional path
          destination: 'http://localhost:4000/stock/:path*', // Proxy to corresponding route on backend server
        },
        {
          source: '/leaderboard/:path*', // Match requests to /leaderboard and any additional path
          destination: 'http://localhost:4000/leaderboard/:path*', // Proxy to corresponding route on backend server
        },
        {
          source: '/checkWinner/:path*', // Match requests to /checkWinner and any additional path
          destination: 'http://localhost:4000/checkWinner/:path*', // Proxy to corresponding route on backend server
        },
        // Add more rewrite rules for other routes as needed
      ];
    },
  };
  