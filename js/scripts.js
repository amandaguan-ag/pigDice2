//Business logic for Game
function Game() {
  this.gameType = 1;
  this.players = 1;
  this.currentRoll = [];
  this.currentPlayer = player1;
  this.turnTotal = 0;
}

Game.prototype.setGameType = function (type, players) {
  this.gameType = type;
  this.players = players;
};

Game.prototype.rollDice = function () {
  this.currentRoll = [];
  for (let i = 0; i < this.gameType; i++) {
    this.currentRoll.push(Math.floor(Math.random() * 6 + 1));
  }

  if (this.currentRoll[1]) {
    if (this.currentRoll[0] === 1 && this.currentRoll[1] === 1) {
      this.currentPlayer.bank = 0;
      this.turnTotal = 0;
      this.switchPlayer();
      window.setTimeout(activePlayerUI, 1000);
      updateBank();
    } else if (this.currentRoll[0] === 1 || this.currentRoll[1] === 1) {
      this.turnTotal = 0;
      this.switchPlayer();
      window.setTimeout(activePlayerUI, 1000);
    } else {
      this.turnTotal += this.currentRoll[0] + this.currentRoll[1];
      if (this.currentPlayer.bank + this.turnTotal >= 10) {
        win();
      }
      return 1;
    }
  } else {
    if (this.currentRoll[0] === 1) {
      this.turnTotal = 0;
      this.switchPlayer();
      window.setTimeout(activePlayerUI, 1000);
    } else {
      this.turnTotal += this.currentRoll[0];
      if (this.currentPlayer.bank + this.turnTotal >= 10) {
        win();
      }
      return 1;
    }
  }
}; // rollDice

Game.prototype.switchPlayer = function () {
  if (this.currentPlayer === player1) {
    this.currentPlayer = player2;
  } else {
    this.currentPlayer = player1;
  }
  if (this.players === "1" && this.currentPlayer === player2) {
    window.setTimeout(computer, 2000);
    disablePlayButtons();
  }
  if (this.players === "3" && this.currentPlayer === player2) {
    window.setTimeout(superComputer, 2000);
    disablePlayButtons();
  }
};

//Business logic for Player
function Player(name) {
  this.bank = 0;
  this.name = name;
}

Player.prototype.addToBank = function () {
  this.bank += game.turnTotal;
  game.turnTotal = 0;
};

Player.prototype.addName = function (name) {
  this.name = name;
};

// UI
let game = new Game();
let player1 = new Player("Player 1");
let player2 = new Player("Player 2");

let computer = function () {
  let firstRoll = game.rollDice();
  displayRoll(game.currentRoll);
  updateFields();
  
  if (firstRoll === 1) {
    firstRoll = game.rollDice();
    window.setTimeout(displayRoll, 1000, game.currentRoll);
    window.setTimeout(updateFields, 1000);
  }
  if (firstRoll === 1) {
    window.setTimeout(game.currentPlayer.addToBank(game.turnTotal), 1000);
    window.setTimeout(game.switchPlayer(), 1000);
    window.setTimeout(activePlayerUI, 3000);
  }
  window.setTimeout(updateBank, 3000);
  window.setTimeout(enablePlayButtons, 3000);
};

let slowRoll = function (firstRoll) {
  debugger;
};

let superComputer = function () {
  let firstRoll = 1;
  for (let i = 0; player2.bank + game.turnTotal < 10; i++) {
    // debugger;
    if (firstRoll === 1) {
      if (player1.bank >= 71 || player2.bank >= 71) {
        firstRoll = game.rollDice();
        displayRoll(game.currentRoll);
        updateFields();
        if (game.turnTotal + player2.bank >= 10) {
          game.switchPlayer();
          break;
        }
      } else if (player1.bank >= 61 || player2.bank >= 61) {
        firstRoll = game.rollDice();
        displayRoll(game.currentRoll);
        updateFields();
        if (game.turnTotal >= 26) {
          game.currentPlayer.addToBank(game.turnTotal);
          game.switchPlayer();
          activePlayerUI();
          break;
        }
      } else if (player1.bank >= 51 || player2.bank >= 51) {
        firstRoll = game.rollDice();
        displayRoll(game.currentRoll);
        updateFields();
        if (game.turnTotal >= 23) {
          game.currentPlayer.addToBank(game.turnTotal);
          game.switchPlayer();
          activePlayerUI();
          break;
        }
      } else {
        firstRoll = game.rollDice();
        displayRoll(game.currentRoll);
        updateFields();
        if (game.turnTotal >= 20) {
          game.currentPlayer.addToBank(game.turnTotal);
          game.switchPlayer();
          activePlayerUI();
          break;
        }
      }
    } else {
      break;
    }
  }
  updateBank();
  enablePlayButtons();
};

const activePlayerUI = function () {
  if (game.currentPlayer.name === player1.name) {
    document.getElementById("player1Working").classList.add("currentPlayer");
    document.getElementById("player2Working").classList.remove("currentPlayer");
  } else {
    document.getElementById("player2Working").classList.add("currentPlayer");
    document.getElementById("player1Working").classList.remove("currentPlayer");
  }
  document.getElementById("currentPlayer").textContent =
    game.currentPlayer.name;
  };

const updateBank = function () {
  document.getElementById("p1BankTotal").textContent = player1.bank;
  document.getElementById("p2BankTotal").textContent = player2.bank;
};

const displayRoll = function () {
  for (let i = 0; i < game.gameType; i++) {
    const output1 = "&#x268" + (game.currentRoll[i] - 1) + ";";
    document.querySelector(".displayDice" + (i + 1)).innerHTML = output1;
  }
};

const updateFields = function () {
  document.getElementById("p1BankTotal").textContent = player1.bank;
  document.getElementById("p2BankTotal").textContent = player2.bank;
  document.getElementById("turnTotal").textContent = game.turnTotal;
  document.getElementById("currentPlayer").textContent =
    game.currentPlayer.name;
};

const clearFields = function () {
  document.getElementById("rollOutput").textContent = "";
  document.getElementById("turnTotal").textContent = "";
  document.getElementById("currentPlayer").textContent = "";
};

const win = function () {
  document.getElementById("winner").style.display = "block";
  document.getElementById("winner").textContent =
    game.currentPlayer.name +
    " Wins! Bank: " +
    game.currentPlayer.bank +
    " Current turn:" +
    game.turnTotal;
  document.getElementById("gameStart").style.display = "block";
  document.getElementById("rollButton").style.display = "none";
  document.getElementById("bankButton").style.display = "none";
  clearFields();
};

const disablePlayButtons = function () {
  document.getElementById("rollButton").style.display = "none";
  document.getElementById("bankButton").style.display = "none";
};

const enablePlayButtons = function () {
  document.getElementById("rollButton").style.display = "block";
  document.getElementById("bankButton").style.display = "block";
};

window.addEventListener("load", function () {
  document.getElementById("gameType").addEventListener("change", function () {
    let diceNumber = document.getElementById("gameType").value;
    if (diceNumber === "1") {
      document.getElementById("twoDice").style.display = "none";
      document.getElementById("oneDie").style.display = "block";
    } else {
      document.getElementById("twoDice").style.display = "block";
      document.getElementById("oneDie").style.display = "none";
    }
  });

  document.getElementById("startGame").addEventListener("click", function () {
    game = new Game();
    player1.bank = 0;
    player2.bank = 0;
    console.log(game);
    updateBank();
    document.getElementById("gameStart").style.display = "none";
    document.querySelector(".nameEntry1").style.display = "block";
    document.getElementById("winner").style.display = "none";
    document.getElementById("p1NameOutput").textContent = "Player 1";
    document.getElementById("p2NameOutput").textContent = "Player 2";
    let type = document.getElementById("gameType").value;
    let players = document.getElementById("playerCount").value;
    game.setGameType(type, players);
    activePlayerUI();
  });

  document.getElementById("rollButton").addEventListener("click", function () {
    game.rollDice();
    displayRoll(game.currentRoll);
    updateFields();
  });

  document.getElementById("bankButton").addEventListener("click", function () {
    console.log(game.currentPlayer);
    game.currentPlayer.addToBank();
    updateBank();
    game.switchPlayer();
    activePlayerUI();
    document.getElementById("rollOutput").textContent = "";
    document.getElementById("turnTotal").textContent = "";
    document.getElementById("currentPlayer").textContent =
      game.currentPlayer.name;
  });

  document
    .getElementById("p1NameSubmit")
    .addEventListener("click", function () {
      let name = document.getElementById("p1Name").value;
      player1.addName(name);
      document.getElementById("p1NameOutput").textContent = player1.name;
      document.querySelector(".nameEntry1").style.display = "none";
      document.querySelector(".nameEntry2").style.display = "block";
      document.getElementById("player2Working").classList.add("currentPlayer");
      document
        .getElementById("player1Working")
        .classList.remove("currentPlayer");
    });

  document
    .getElementById("p2NameSubmit")
    .addEventListener("click", function () {
      let name = document.getElementById("p2Name").value;
      player2.addName(name);
      document.getElementById("p2NameOutput").textContent = player2.name;
      document.querySelector(".nameEntry2").style.display = "none";
      document.getElementById("player1Working").classList.add("currentPlayer");
      document
        .getElementById("player2Working")
        .classList.remove("currentPlayer");
      document.getElementById("rollButton").style.display = "block";
      document.getElementById("bankButton").style.display = "block";
      game.currentPlayer = player1;
    });
});
