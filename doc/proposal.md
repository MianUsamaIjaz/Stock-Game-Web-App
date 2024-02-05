## Description

The web app of stock trading game simulates the experience of stock trading in the New York Stock Exchange (NYSE). The players can register for a specific game, where they will receive a starting cash account in their portfolio. They can use this cash to buy and sell stocks at the current NYSE prices, while paying transaction fees and taxes. The players can also view their portfolio value, transaction history, and portfolio analysis, as well as the portfolios of their competitors. The game has a fixed duration, and the winner is the player who has the highest portfolio value at the end of the game. The app also provides various features and resources to help the players learn and improve their skills, such as a tutorial, a news feed, a chat room, a leaderboard, a notification system, and a rating system.

The web app of stock trading game also has admins who can create and manage games for other players. The admins can set the parameters of the game, such as the duration, the starting amount, the fees, and the taxes. The admins can also monitor the progress and performance of the players, as well as their feedback and ratings. The admins are responsible for ensuring the smooth operation and maintenance of the app, as well as resolving any issues or bugs that may arise. They play a vital role in providing a fun and educational experience for the players of the web app of stock trading game.

### Screens



## Features

|ID|Name|Access By|Short Description|Expected Implementation|Source of Idea|
|--|----|---------|-----------------|--------|--------------|
|01|Player registration|Player|players register for a specific game|Must implement|Project instructions|
|02|Initial Cash|Player|provide all players a starting cash account in their portfolio|Must implement|Project instructions|
|03|Buying/Selling|Player/Admin|allow player buy and sell actions at the current NYSE prices|Must implement|Project instructions|
|04|Tracking Portfolio|Player|keep track of each player's portfolio and its value|Must implement|Project instructions|
|05|Declaring Results|Admin|declare a winner at the end of the game|Must implement|Project instructions|
|06|Maintaining Profile|Player/Admin|maintain player/admin login and profile information|Must implement|Project instructions|
|07|Initiating Games|Admin|admin users that can create games|Must implement|Project instructions|
|08|Competitor's Portfolio|Player|viewing of competitor's portfolios|Probably yes|Project instructions|
|09|Transaction Fee|Player/Admin|costs to buy/sell transactions (fees)|Must implement|Project instructions|
|10|Tracking Activities|Admin|tracking all trades and activities of a player during the game|Must implement|Project instructions|
|11|Game Configuration|Admin|time and starting amount game configuration|Must implement|Project instructions|
|12|Moving average|Player|An added feature to candlestick charts|Probably not unless its easy|Project instructions|
|13|Chat Room|Player|where players can communicate with each other, share tips, and discuss strategies|Probably yes|Idea from my personal project|
|14|Help/Support|Admin|provides the admins with assistance, troubleshooting, and contact form to reach the developer|Must implement|Personal idea|
|15|Rating|Player|allows players to rate the app|Probably no unless enough time|Personal idea|
|16|Dark/Light Mode|Player|allows player to choose the theme of the app|Must implement|Personal idea|
|17|Tutorial|Player|explains the basics of stock trading, the rules of the game, and the features of the app|Must implement|Idea from my CS 2005 academic project|
|18|Customization|Player|players choose their own avatar, username, color scheme, and sound effects|Probably yes|Idea from my CS 2005 academic project|
|19|Dashboard|Admin|gives the admins an overview of the app’s performance, such as the number of games, players, transactions, feedback, and ratings.|Probably no|Idea from workplace project|
|20|Tickets|Admin/Player|allow the admins to receive and respond to support requests from the players|Probably no unless easy|Discord Feature|
|21|News Feed|Player|displays the latest market news, trends, and events that may affect the stock prices|Probably not|Websites like [Questrade](https://www.questrade.com/)|
|22|FAQs|Player|answers to most frequently asked questions from players|Probably yes|Websites like [Questrade](https://www.questrade.com/)|
|23|Leaderboard|Player|shows the ranking of all players based on their portfolio value|Must implement|Websites like [MarketWatch](https://www.marketwatch.com/)|
|24|Notification System|Player|alerts players of any changes in their portfolio/stock price|Likely to be implemented if enough time|Websites like [CoinMarketCap](https://www.coinmarketcap.com/)|
|25|Portfoilio Analysis|Player|gives players detailed information and statistics about their portfolio|Less Likely|Websites like [CoinMarketCap](https://www.coinmarketcap.com/)|
|26|Rewards|Player|gives players incentives to play more, such as extra cash|Likely to be implemented|Websites like [CoinGecko](https://www.coingecko.com/)|
|27|Sharing achievemnets|Player|lets players share their achievements with their friends on social media platforms|Probably no unless easy|Websites like [CoinMarketCap](https://www.coinmarketcap.com/)|
|28|Ban System|Admin|enables the admins to manage the behavior and conduct of the players|Likely to be implemented|ChatGPT|
|29|Quizes|Player|tests players’ knowledge of stock trading, the market, or the app|Probably not|ChatGPT|
|30|Quest System|Player|gives players specific goals or tasks to complete|Probably not|ChatGPT|

## Implementation

### Tools and packages

* HTML/CSS/JavaScript
* Node.js
* Express.js
* React.js
* MongoDB
* Mongoose
* Jest
* Postman
* Git
* Material-UI
* Bcrypt
* OAuth 2.0
* Passport.js
* Hashing
* Chart.js

### App API

1. GET /games
   - responds with a list of all the games available to join or create
2. POST /games
   - creates a new game with the given parameters, such as name, duration, starting amount, fees, and taxes
3. GET /games/:gameid
   - responds with the details of the game with the given ID, such as name, duration, starting amount, fees, taxes, and number of players
4. DELETE /games/:gameid
   - deletes the game with the given ID, if the requester is the admin of the game
5. GET /players
   - responds with a list of all the players registered in the app
6. POST /players
   - registers a new player with the given information, such as username, password, and email
7. GET /players/:playerid
   - responds with the profile of the player with the given ID, such as username, email, and current portfolio value
8. PUT /players/:playerid
   - updates the profile of the player with the given ID, if the requester is the player
9. DELETE /players/:playerid
   - deletes the player with the given ID, if the requester is the player or the admin
10. GET /portfolio?player=*playername*&game=*gameid*
    - responds with the current portfolio of the player with the given name in the game with the given ID, such as the cash balance, the stocks owned, and the portfolio value
11. POST /buy?player=*playername*&game=*gameid*&stock=*tickersymbol*&quant=*nnn*
    - requests that a pretend purchase is made within the game with the given ID, using the current NYSE price of the stock with the given symbol and the quantity specified
12. POST /sell?player=*playername*&game=*gameid*&stock=*tickersymbol*&quant=*nnn*
    - requests that a pretend sale is made within the game with the given ID, using the current NYSE price of the stock with the given symbol and the quantity specified

### Stock API

- Alpha Vantage API
- Polygon.io

1. alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo
   - The API will return the most recent 100 intraday OHLCV bars by default when the outputsize parameter is not set
2. api.polygon.io/v3/trades/AAPL?apiKey=*
   - Get trades for a ticker symbol in a given time range.
3. api.polygon.io/v2/reference/news?apiKey=*
   - Get the most recent news articles relating to a stock ticker symbol, including a summary of the article and a link to the original source.
