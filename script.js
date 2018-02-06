//getting usere name and then hiding the form
function startGame() {
  const userName = document.getElementById("userName").value;
  document.getElementById("introduction").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  return false;
}


//creating the game map with all the parameters
function createMap(width, height, canvas, startPos, treasurePos, adventureLogger) {
  var map = {
    width: width,
    height: height,
    canvas: canvas,
    startPos: startPos,
    treasurePos: treasurePos,
    currentPos: startPos,
    adventureLogger: adventureLogger,
    treasureFound: false,

    //creating the move function and checking if it is within bounds
    move: function (direction, newPos) {
      const oldPos = this.currentPos;
      if (!this.inBounds(newPos)) {
        this.adventureLogger.log("Cannot move " + direction + "!");
        return;
      }
      this.currentPos = newPos;
      this.adventureLogger.log("Moving " + direction + ".");
      document.getElementById("moveSound").currentTime = 0;
      document.getElementById("moveSound").play();


      if (this.currentPos.x == this.treasurePos.x && this.currentPos.y == this.treasurePos.y) {
        this.treasureFound = true;
        this.adventureLogger.log("Yay! You found the treasure!")

      }
      this.draw();

    },
    moveEast: function () {
      const oldPos = this.currentPos;
      const newPos = makePos(oldPos.x + 1, oldPos.y);
      this.move("east", newPos);

    },
    moveWest: function () {
      const oldPos = this.currentPos;
      const newPos = makePos(oldPos.x - 1, oldPos.y);
      this.move("west", newPos)
    },
    moveNorth: function () {
      const oldPos = this.currentPos;
      const newPos = makePos(oldPos.x, oldPos.y + 1);
      this.move("north", newPos)
    },
    moveSouth: function () {
      const oldPos = this.currentPos;
      const newPos = makePos(oldPos.x, oldPos.y - 1);
      this.move("south", newPos)
    },

    inBounds: function (pos) {
      return pos.x >= 0 && pos.x < this.width && pos.y >= 0 && pos.y < this.height;
    },

    currentPosition: function () {
      return this.currentPos;
    },

    treasurePosition: function () {
      return this.treasurePos;
    },

    draw: function () {
      var ctx = this.canvas.getContext("2d");
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;

      const cellSize = this.canvas.width / this.width;
      const gridSize = width * cellSize

      //draw the vertical lines
      for (i = 0; i <= gridSize; i = i + cellSize) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, gridSize);
        ctx.stroke();
      }
      //draw the horizontal lines
      for (j = 0; j <= gridSize; j = j + cellSize) {
        ctx.moveTo(0, j);
        ctx.lineTo(gridSize, j);
        ctx.stroke();
      }
      //draw user

      //inverse the axis to start from the bottom left
      this.drawSquare(ctx, this.currentPos.x, this.currentPos.y);

      //display treasure icon
      if (this.treasureFound) {
        const x = this.treasurePos.x * cellSize;
        const y = (-(this.treasurePos.y - this.height) - 1) * cellSize;

        var img = new Image();
        img.src = 'images/if_treasure_45274.png';
        img.addEventListener('load', function () {
          ctx.drawImage(img, x, y)
        }, false);

      }
    },

    drawSquare: function (ctx, x, y) {
      ctx.beginPath();
      const cellSize = this.canvas.width / this.width;
      ctx.rect(x * cellSize, (-(y - this.height) - 1) * cellSize, cellSize, cellSize);
      ctx.fillStyle = "crimson";
      ctx.fill();
      ctx.closePath();
    }
  };
  return map;
}

function makePos(x, y) {
  return {
    x: x,
    y: y
  }
}

// generate a random tresaure position
function generateRandomTreasurePos(width, height) {
  const x = Math.floor(Math.random() * width);
  const y = Math.floor(Math.random() * height);
  return makePos(x, y);
}

function createAdventureLogger() {
  return {
    logContainer: document.getElementById("log"),
    //console log for user input
    log: function (message) {
      console.log(message);
      const logEntry = this.formatLogEntry(message);
      this.logContainer.appendChild(logEntry);
      //create a horizontal line under each message
      this.logContainer.appendChild(document.createElement("hr"));
      //scroll to the last message
      this.logContainer.scrollTop = this.logContainer.scrollHeight;

    },
    //create a single adventure log entry
    formatLogEntry: function (message) {
      var logEntry = document.createElement("p");
      var logText = document.createTextNode(message);
      logEntry.appendChild(logText);
      return logEntry;
    },
    //clear the adventure log
    clear: function () {
      console.log("Clearing the adventure log");
      while (this.logContainer.hasChildNodes()) {
        this.logContainer.removeChild(this.logContainer.lastChild);
      }
    }
  }
}

// TODO: remove when done with testing
startGame();

var adventureLogger = createAdventureLogger();
var canvas = document.getElementById("myCanvas");
const width = 5;
const height = 5;
var map = createMap(5, 5, canvas, makePos(0, 0), generateRandomTreasurePos(width, height), adventureLogger);
map.draw();
document.getElementById("imgEast").addEventListener("click", function () {
  map.moveEast();
});
document.getElementById("imgWest").addEventListener("click", function () {
  map.moveWest();
});
document.getElementById("imgNorth").addEventListener("click", function () {
  map.moveNorth();
});
document.getElementById("imgSouth").addEventListener("click", function () {
  map.moveSouth();
});




// Movement
// TODO: Add movement controls and bind to bind to map.moveEast, etc
// document.getElementById(...).addEventListener("click", function() {map.moveNorth();});
// TODO: Disable movement controls if they would take me out of bounds

// Gameplay
// TODO: randomly generate treasure location
// TODO: Detect finding of treasure
// TODO: Countdown number of moves
// TODO: Detect losing and display message

// Overall
// TODO: Add a restart button
// TODO: Add sound on victory, defeat, and on moves
// TODO: Use the player's name in the adventure log and in the display
// TODO: Log a welcome message with directions (how many moves you get, etc)
// TODO: Log a victory or defeat message

//// Logger testing
//adventureLogger.clear();
//adventureLogger.log("My first log><&");
//var i = 0;
//while (i < 50) {
//  adventureLogger.log("some other message " + i);
//  i++;
//}
//adventureLogger.log("my last log");
