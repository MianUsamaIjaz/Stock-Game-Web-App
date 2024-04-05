import assert from 'assert'
import supertest from 'supertest'
import { dbClean, dbCount, dbClose } from "./db.mjs"

var request = supertest("http://localhost:4000")

after(async () => {  
    await dbClose()
})

describe('GET /stock', function() {
    var tests = [{ name: 'AAPL', expect: 200 },
                 { name: 'WMT', expect: 200 },
                 { name: 'DUMBS', expect: 404}]
    tests.forEach(function(test){
        it(`GET /stock/${test.name}`, async function() {

            let response = await request.get(`/stock/${test.name}`)

            if (response.status == 200) {
            assert.equal(test.name,response.body[0].symbol)
            }

        });
    })
});

    describe('POST /buy', function() {
        var tests = [
            { player: {fname: "Mian", lname: "Usama", email: "mianusama@test.com"}, stockName: 'AAPL', quantity: 1, expect: 200 },
            { player: {fname: "Usama", lname: "Ijaz", email: "usamaijaz@test.com"}, stockName: 'WMT', quantity: 2, expect: 200 },
            { player: {fname: "Usama", lname: "Ijaz", email: "usamaijaz@test.com"}, stockName: 'AAPL', quantity: 2, expect: 200 },
            { player: {fname: "Mian", lname: "Usama", email: "mianusama@test.com"}, stockName: 'DUMBS', quantity: 3, expect: 404 },  // Stock does not exist
            { player: {fname: "No", lname: "Player", email: "noplayer@test.com"}, stockName: 'WMT', quantity: 2, expect: 404 },  // This player does not exist in database
            { player: {fname: "Usama", lname: "Ijaz", email: "usamaijaz@test.com"}, stockName: 'AAPL', quantity: 10, expect: 403 },  // Should not be enough money to buy

        ];
    
        tests.forEach(function(test) {
            it(`POST /buy for ${test.player.fname} ${test.player.lname} buying ${test.quantity} ${test.stockName} stocks`, async function() {
                let requestBody = {
                    player: test.player,
                    stockName: test.stockName,
                    quantity: test.quantity
                };
    
                let response = await request.post('/buy').send(requestBody);
    
                assert.equal(response.status, test.expect);

                 if( response.status == 200 ) {

                    assert.equal(response.body.name, test.stockName) 
                 }
            });
        });
    });

    describe('POST /sell', function() {
        var tests = [
            { player: {fname: "Mian", lname: "Usama", email: "mianusama@test.com"}, stockName: 'AAPL', quantity: 1, expect: 200 },
            { player: {fname: "Usama", lname: "Ijaz", email: "usamaijaz@test.com"}, stockName: 'WMT', quantity: 2, expect: 200 },
            { player: {fname: "Mian", lname: "Usama", email: "mianusama@test.com"}, stockName: 'DUMBS', quantity: 3, expect: 404 },  // Stock does not exist
            { player: {fname: "No", lname: "Player", email: "noplayer@test.com"}, stockName: 'WMT', quantity: 2, expect: 404 },  // This player does not exist in database
            { player: {fname: "Usama", lname: "Ijaz", email: "usamaijaz@test.com"}, stockName: 'AAPL', quantity: 10, expect: 403 },  // Should not be enough stock to sell

        ];
    
        tests.forEach(function(test) {
            it(`POST /sell for ${test.player.fname} ${test.player.lname} selling ${test.quantity} ${test.stockName} stocks`, async function() {
                let requestBody = {
                    player: test.player,
                    stockName: test.stockName,
                    quantity: test.quantity
                };
    
                let response = await request.post('/sell').send(requestBody);
    
                assert.equal(response.status, test.expect);

                if( response.status == 200 ) {
                    assert.equal(response.body.name, test.stockName) 
                }
            });
        });
    });

    describe('POST /createPlayer', function() {
        var tests = [
            { fname: 'James', lname: 'Doe', email: 'james@test.com', password: "123", expect: 200 },
            { fname: 'Jane', lname: 'Lee', email: 'jane@test.com', password: "123", expect: 200 },
            { fname: 'Alisa', lname: 'Basklanova', email: 'james@test.com', password: "123", expect: 403 }
        ];
    
        tests.forEach(function(test) {
            it(`POST /createPlayer for ${test.fname} ${test.lname}`, async function() {
                let requestBody = {
                    fname: test.fname,
                    lname: test.lname,
                    email: test.email,
                    password: test.password
                };
    
                let response = await request.post('/createPlayer').send(requestBody);
    
                assert.equal(response.status, test.expect);

                if( response.status == 200 ) {
                    assert.equal(response.body.email, test.email)
                }

            });
        });
    });

    describe('POST /createAdmin', function() {
        var tests = [
            { fname: 'James', lname: 'Doe', email: 'john@example.com', password: "123", expect: 200 },
            { fname: 'Jane', lname: 'Lee', email: 'jane@example.com', password: "123", expect: 200 },
            { fname: 'Cillian', lname: 'Murphy', email: 'cillian@test.com', password: "123", expect: 403 }  // Admin already exists with this data in database
        ];
    
        tests.forEach(function(test) {
            it(`POST /createAdmin for ${test.fname} ${test.lname}`, async function() {
                let requestBody = {
                    fname: test.fname,
                    lname: test.lname,
                    email: test.email,
                    password: test.password
                };
    
                let response = await request.post('/createAdmin').send(requestBody);
    
                assert.equal(response.status, test.expect);

                if( response.status == 200 ) {
                    assert.equal(response.body.email, test.email)
                }

            });
        });
    });

    describe('POST /createGame', function() {
        var tests = [
            { gameID: 1, name: 'Test Game', owner: {fname: 'Cillian', lname: 'Murphy', email: 'cillian@test.com'}, expect: 200 },  // Admin creating game should be okay
            { gameID: 2, name: 'Test Game 2', owner: {fname: 'Mian', lname: 'Usama', email: 'mianusama@test.com'}, expect: 403 }, // Not an admin
        ];
    
        tests.forEach(function(test) {
            it(`POST /createGame for ${test.name}`, async function() {
                let requestBody = {
                    gameID: test.gameID,
                    name: test.name,
                    owner: test.owner
                };
    
                let response = await request.post('/createGame').send(requestBody);
    
                assert.equal(response.status, test.expect);

                if (response.status == 200) {
                    assert.equal(response.body.id, test.gameID);
                }
            });
        });
    });

    describe('POST /registerPlayer', function() {
        var tests = [
            { gameID: 1, player: { fname: 'Mian', lname: 'Usama', email: 'mianusama@test.com' }, expect: 200 },
            { gameID: 3, player: { fname: 'Usama', lname: 'Ijaz', email: 'usamaijaz@test.com' }, expect: 403 },  // Game not found
            { gameID: 1, player: { fname: 'Alice', lname: 'Johnson', email: 'alice@example.com' }, expect: 404 },  // Player Does not exist
            { gameID: 1, player: { fname: 'Usama', lname: 'Ijaz', email: 'usamaijaz@test.com' }, expect: 200 },
            { gameID: 1, player: { fname: 'Tony', lname: 'Stark', email: 'tonystark@test.com' }, expect: 200 },
            { gameID: 1, player: { fname: 'John', lname: 'Doe', email: 'johndoe@test.com' }, expect: 201 }  // This would complete 4 successful registrations and the game should now be started sicne the capacity is full

        ];
    
        tests.forEach(function(test) {
            it(`POST /registerPlayer for ${test.player.email} in game ${test.gameID}`, async function() {
                let requestBody = {
                    gameID: test.gameID,
                    player: test.player
                };
    
                let response = await request.post('/registerPlayer').send(requestBody);
    
                assert.equal(response.status, test.expect);

                if (response.status == 201) {
                    assert.ok(response.body.startTime > 0);  //Game started
                }
            });
        });

    });

    describe('POST /leaderboard', function() {
        var tests = [
            { gameID: 1 , expect: 200},
            { gameID: 5, expect: 404}
        ];
    
        tests.forEach(function(test) {
            it(`POST /leaderboard for Game ${test.gameID}`, async function() {
                let requestBody = {
                    gameID: test.gameID,
                };
    
                let response = await request.post('/leaderboard').send(requestBody);
    
                assert.equal(response.status, test.expect);

            });
        });

    });

    

    describe('POST /checkWinner', function() {
        var tests = [
            { gameID: 1, expect: 200 },  // On purpose increased Mian Usama's portfolio value up so he could be the winner
            { gameID: 5, expect: 404 }  // Game does not exist
        ];
    
        tests.forEach(function(test) {
            it(`POST /checkWinner for game ${test.gameID}`, async function() {
                let requestBody = { gameID: test.gameID };
                let response = await request.post('/checkWinner').send(requestBody);
       
                assert.equal(response.status, test.expect);

                if (response.status === 200) {
                    assert.equal(response.body.email, 'mianusama@test.com');
                }
            });
        });
    });

    describe('POST /otherPlayersPortfolio', function() {
        var tests = [
            { gameID: 1, email: 'usamaijaz@test.com', expect: 200 },
            { gameID: 5,email: 'player@example.com', expect: 404 }
        ];
    
        tests.forEach(function(test) {
            it(`POST /otherPlayersPortfolio for game ${test.gameID}`, async function() {
                let requestBody = { gameID: test.gameID, email: test.email };
                let response = await request.post('/otherPlayersPortfolio').send(requestBody);
       
                assert.equal(response.status, test.expect);
    
                if (response.status === 200) {
                    assert.ok(response.body.length == 3);  //Since there will be 4 players in a game
                }
            });
        });
    });