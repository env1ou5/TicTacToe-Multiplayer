

import boardChecker from './boardChecker.js'

document.getElementById("loading").style.display = "none";
document.getElementById("bigCont").style.display = "none";
document.getElementById("userCont").style.display = "none";
document.getElementById("oppCont").style.display = "none";
document.getElementById("PlayingAs").style.display = "none";
document.getElementById("whoseTurn").style.display = "none";

const socket = io();

let name;
let gameid;
let canclick = true;

const columns = 5;
const rows = 5;

const Animate = (Element, AnimationName, Callback) => {

    const toAnimate = document.querySelector(Element);

    toAnimate.classList.add(AnimationName);

    toAnimate.addEventListener("animationend", function() {
        toAnimate.classList.remove(AnimationName);

        if (Callback) {
          Callback();
        }
    });
}

const CreateBoard = () => {
    
  for (let NRows = 1; NRows <= rows; NRows++) {
    const newrow = document.createElement("div");
    newrow.className = "row";
    newrow.id = "row_" + NRows;

    document.getElementById("cont").appendChild(newrow);

    for (let n = 1; n <= columns; n++) {
      const newspot = document.createElement("button");
      newspot.className = "btn";
      newspot.id = n + (NRows - 1) * columns;

      newspot.addEventListener("click", () => {
        if (!canclick) {
          return;
        }

        canclick = false;
        let val = document.getElementById("As").innerHTML;

        if (val == document.getElementById("currentTurn").innerHTML) {
          socket.emit("playing", {
            value: val,
            id: newspot.id,
            name: name,
            gameid: gameid,
            btn: newspot,
          });
        }
      });

      newrow.appendChild(newspot);
    }
  }
};

document.getElementById("find").addEventListener("click", () => {
  name = document.getElementById("name").value;

  if (name == null || name == "") {
    alert("enter a name");
  } else {
    socket.emit("find", { name: name });
    document.getElementById("loading").style.display = "block";
    document.getElementById("find").disabled = true;
  }
});

socket.on("find", (data) => {
  gameid = data.gameid;

  let allPlayersArray = data.allPlayers;

  document.getElementById("bigCont").style.display = "block";
  document.getElementById("userCont").style.display = "block";
  document.getElementById("oppCont").style.display = "block";
  document.getElementById("PlayingAs").style.display = "block";
  document.getElementById("whoseTurn").style.display = "block";

  document.getElementById("enterName").style.display = "none";
  document.getElementById("find").style.display = "none";
  document.getElementById("name").style.display = "none";
  document.getElementById("loading").style.display = "none";

  document.getElementById("currentTurn").innerHTML = "X";

  const Players = allPlayersArray.find((players) => players.gameid == gameid);

  let user;
  let opp;

  user = Players.p1.name == name ? (user = Players.p1) : (user = Players.p2);
  opp = Players.p1.name == name ? (opp = Players.p2) : (opp = Players.p1);

  document.getElementById("user").innerHTML = user.name;
  document.getElementById("opp").innerHTML = opp.name;

  document.getElementById("As").innerHTML = user.value;

  CreateBoard();
});

socket.on("playing", (data) => {
  if (data.gameid != gameid) {
    return;
  }

  const Players = data.allPlayers.find(
    (players) => players.gameid == data.gameid
  );

  let p1move = Players.p1.move;
  let p2move = Players.p2.move;

  if (Players.sum % 2 == 0) {
    document.getElementById("currentTurn").innerHTML = "O";
  } else {
    document.getElementById("currentTurn").innerHTML = "X";
  }

  if (p1move != "") {
    document.getElementById(`${p1move}`).innerHTML = "X";
    document.getElementById(`${p1move}`).disabled = true;
    Players.board[p1move] = "X";
  }

  if (p2move != "") {
    document.getElementById(`${p2move}`).innerHTML = "O";
    document.getElementById(`${p2move}`).disabled = true;
    Players.board[p2move] = "O";
  }

  let [gameEnded, winner] = boardChecker(Players.board);

  if (gameEnded) {

    const winnertext = document.createElement("h2");
    winnertext.innerHTML = "Winner is " + winner + "!";
    document.body.appendChild(winnertext);
    
    Animate("h2", "Animation", function() {
      location.reload();
    });

    socket.emit("gameOver", gameid)

  } else {
    canclick = true;
  }
});
