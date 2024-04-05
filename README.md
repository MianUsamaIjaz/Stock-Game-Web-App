# Project Layout

## Directory Structure

### Frontend
- **node_modules**: Contains installed dependencies.
- **.gitignore**: Specifies files and directories ignored by Git.
- **.env**: Stores environment variables.
- **pages**: Contains Next.js pages for the frontend.
- **components**: Holds reusable React components.
- **public**: Contains static assets like images or fonts.
- **api**: Holds API routes for the backend.
- **utils**: Contains utility functions used across the project.

### Backend
- **node_modules**: Contains installed dependencies.
- **tests**: Holds test files for verifying code functionality.
- **docs**: Stores project documentation.
- **.gitignore**: Specifies files and directories ignored by Git.
- **.env**: Stores environment variables.
- **admin.mjs**, **game.mjs**, **player.mjs**: JavaScript files defining classes or modules for different entities.
- **server.mjs**: Main server-side code handling HTTP requests, routing, and interacting with databases.
- **players.json**, **admins.json**: Database files storing player and admin data.

## Architecture Overview

### Frontend
1. **Frontend (Next.js)**:  Utilizes React components for building UIs, Next.js for server-side rendering, and TypeScript for type safety.
2. **Backend (Node.js with Express)**: Handles HTTP requests, routes, and interacts with databases.
3. **Database Files (players.json, admins.json, games.json)**:  Store player, admin, and game data in JSON format.
4. **API Routes (frontend/src/app/api)**: Contains endpoints for frontend-backend communication.
5. **Pages (frontend/src/app)**: Contains Next.js pages responsible for rendering different routes of the application. Each page corresponds to a different URL and represents a React component.
6. **Components (frontend/src/components)**: Holds reusable React components used across multiple pages.

### Backend
1. **Admin Module (admin.mjs)**: Defines the Admin class for managing administrators.
2. **Game Module (game.mjs)**: Defines the Game class for managing game entities.
3. **Player Module (player.mjs)**: Defines the Player class for managing player accounts and portfolios.
4. **Server Module (server.mjs)**: Handles HTTP requests, routes, and interacts with other modules.
5. **Database Files (players.json, admins.json)**: Store player and admin data in JSON format.

The architecture emphasizes modularity, separation of concerns, and scalability to accommodate both frontend and backend development

# HTTP Request/Service Documentation

This document provides an overview of the HTTP requests and services supported by the project.

## GET /stock/:stockName

- **Request Syntax:** `GET /stock/:stockName`
- **Description:** Retrieves stock data for a specific stock by its symbol.
- **Feature Supported:** Fetching real-time stock information. (Not a Required Feature)
- **Related Tests:** Tests verifying the retrieval of stock data for different stock names.

## POST /buy

- **Request Syntax:** `POST /buy`
- **Description:** Allows a player to buy stocks.
- **Feature Supported:** 
    - Allow player to buy stocks at the current NYSE prices.
    - Keep track of each player's portfolio and its value

- **Related Tests:** `POST /buy` Tests verifying the buying functionality for various scenarios like buying existing/non-existing stocks, having sufficient funds, etc.

## POST /sell

- **Request Syntax:** `POST /sell`
- **Description:** Allows a player to sell stocks.
- **Feature Supported:** 
    - Allow player to sell stocks at the current NYSE prices.
    - Keep track of each player's portfolio and its value
- **Related Tests:** `POST /sell` Tests verifying the selling functionality for different scenarios like selling existing/non-existing stocks, having sufficient stocks to sell, etc.

## POST /createPlayer

- **Request Syntax:** `POST /createPlayer`
- **Description:** Creates a new Player and initialize their portfolio with $1000.
- **Feature Supported:** 
    - Provide all players a starting cash account in their portfolio.
    - Maintain player login and profile information.
- **Related Tests:** `POST /createPlayer` Tests validating the player creation and registration functionality under different cases like creating a new player, attempting to create a player with an existing email, etc.

## POST /createAdmin

- **Request Syntax:** `POST /createAdmin`
- **Description:** Creates a new admin.
- **Feature Supported:** Admin registration. (Not a Required Feature)
- **Related Tests:** `POST /createAdmin` Tests ensuring the admin creation and registration functionality works correctly, including cases like creating a new admin, trying to create an admin with an existing email, etc.

## POST /createGame

- **Request Syntax:** `POST /createGame`
- **Description:** Creates a new game.
- **Feature Supported:** Admin users that can create games.
- **Related Tests:** `POST /createGame` Tests validating the game creation and initialization functionality, covering scenarios like creating a new game by an admin, attempting to create a game by a non-admin, etc.

## POST /registerPlayer

- **Request Syntax:** `POST /registerPlayer`
- **Description:** Registers a player for a game and starts the game when 4 players are registered for a game.
- **Feature Supported:** Register players for the game.
- **Related Tests:** `POST /registerPlayer` Tests verifying the player registration for a game, including cases like registering players for existing and non-existing games/players.


## POST /checkWinner

- **Request Syntax:** `POST /checkWinner`
- **Description:** Checks for the winner of a game.
- **Feature Supported:** Declare a winner at the end of the game.
- **Related Tests:** `POST /checkWinner` Tests ensuring the correct determination of the game winner, covering scenarios like checking for the winner in an ongoing game, checking for the winner in a non-existing game, etc.

## POST /otherPlayersPortfolio

- **Request Syntax:** `POST /otherPlayersPortfolio`
- **Description:** Retrieves portfolios of other players in the same game.
- **Feature Supported:** Viewing other players' portfolios. (Own Feature, also useful for the frontend)
- **Related Tests:** `POST /otherPlayersPortfolio` Tests verifying the retrieval of other players' portfolios, including cases like fetching portfolios for existing and non-existing games, fetching portfolios for existing and non-existing players, etc.

## POST /leaderboard

- **Request Syntax:** `POST /leaderboard`
- **Description:** Retrieves the leaderboard for a specific game, listing players based on their cash amounts in descending order.
- **Feature Supported:** Viewing the leaderboard of a game. (Own Feature)
- **Related Tests:** `POST /leaderboard` Test cases verifying the retrieval of the leaderboard.


# Project Setup and Run Instructions

To set up and run the project, follow these steps:

## 1. Installation

1. Download the entire project folder.
2. Navigate to the project directory in your terminal.
3. Run the following command to install all required packages:

    ```bash
    npm install
4. Create a .env file in the main project folder and set `stockAPIKey = eBVCeMBXRMkLRfR496hXGpWOxgSwFcaS`
5. For frontend, make a .env file inside `nextjs-frontend` directory and include the following in it:
`NEXTAUTH_URL="http://localhost:3000/"`
`NEXTAUTH_SECRET="COMP3100project"`
    #### For SignIn with GitHub:
    `GITHUB_ID=f02031cba4cb46944aa5`
    `GITHUB_SECRET=7c7a417a59da290058022e2bac0f719ccef2ae17`


## 2. Database Setup

1. Ensure you have MongoDB installed and running on your system.
2. Import the provided database files (admins.json and players.json) into MongoDB Compass.
3. Import these files into a database named `project3100`.

## 3. Starting the Backend Server

After installing dependencies and setting up the database, start the server by running the following command:

    node server.mjs

The backend server will start on `localhost:4000`.

## 4. Starting the Frontend Server

After starting the backend server, now start the frontend server by running the following command after navigating to `project > nextjs-frontend`:

    npm install

then:

    npm run dev

## 5. Running Tests

Open a separate terminal window or tab, navigate to the `tests` folder within the project directory, and run the following command to execute the tests:

    npx mocha serverTests.mjs


## 6. Login Info

If you want to play the game, please use the following or create your own custom player/admin:

### Play as a Player:
#### Email: `testp1@test.com` Password: `testp1@test.com`
#### Email: `testp2@test.com` Password: `testp1@test.com`
#### Email: `testp3@test.com` Password: `testp1@test.com`
#### Email: `testp4@test.com` Password: `testp1@test.com`


### Play as an Admin:
#### Email: `admin@test.com` Password: `admin@test.com`

## 6. Additional Notes

- If you need to rerun the tests for any reason, delete the two last players, two last admins, and the `id = 1` game from relative collections inside MongoDB Compass.

- Afterward, you can rerun the tests using the command provided in step 5.

- The project includes a total of 34 tests, and all of them were updated after frontend and are passing according to the provided testing and database setup.

- The project is completed and fully functional based on all concepts of Part 2 including some minor upgrades.


