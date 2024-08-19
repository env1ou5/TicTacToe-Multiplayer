
const express = require('express');
const app = express();

const path = require('path');
const http = require('http');
const {Server} = require('socket.io');

const server = http.createServer(app);
const io = new Server(server)

let arr = [];
let playingArr = [];

io.on("connection", socket => {
   
    socket.on("find", e => {

        if (e.name != null) {
            arr.push(e.name);
            
            if (arr.length >= 2) {
                
                let p1 = {
                    name: arr[0],
                    value: "X",
                    move: "",
                    gameid: socket.id,
                }

                let p2 = {
                    name: arr[1],
                    value: "O",
                    move: "",
                    gameid: socket.id,
                }

                let players = {
                    p1 : p1,
                    p2 : p2,
                    sum : 1,
                    gameid : socket.id,
                    board : {},
                }

                playingArr.push(players);

                arr.splice(0,2);

                io.emit("find", {allPlayers: playingArr, gameid: socket.id});
            }
        }
    })

    socket.on("playing", data => {

        const Players = playingArr.find(players => players.gameid == data.gameid)

        if (data.value == "X") {       
            Players.p1.move = data.id;
        } else if (data.value == "O") {
            Players.p2.move = data.id;
        }

        Players.sum++
        Players.board[data.id] = data.value;
        io.emit("playing", {allPlayers:playingArr, gameid:data.gameid});
    })

    socket.on("gameOver", data => {
        playingArr = playingArr.filter(players => players.gameid != data.gameid);
    })
})

app.use(express.static(path.resolve("")));

app.get("/", (req, res) => res.sendFile('../index.html')); 

server.listen(3000, () => {
    console.log('port connected to 3000');
});