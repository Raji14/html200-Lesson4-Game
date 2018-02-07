//getting usere name and then hiding the form
function startGame() {
  const userName = document.getElementById("userName").value;

  var adventureLogger = createAdventureLogger();
  adventureLogger.clear();

  var canvas = document.getElementById("myCanvas");
  const width = 5;
  const height = 5;
  var map = createMap(width, height, canvas, makePos(0, 0), generateRandomTreasurePos(width, height), adventureLogger, userName);
  map.draw();


  //set up move controls
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

  // Hide intro
  document.getElementById("introduction").classList.add("hidden");
  // Show game
  document.getElementById("game").classList.remove("hidden");

  return false;
}


//creating the game map with all the parameters
function createMap(width, height, canvas, startPos, treasurePos, adventureLogger, userName) {
  var map = {
    width: width,
    height: height,
    canvas: canvas,
    startPos: startPos,
    treasurePos: treasurePos,
    currentPos: startPos,
    adventureLogger: adventureLogger,
    treasureFound: false,
    userName: userName,

    //creating the move function and checking if it is within bounds
    move: function (direction, newPos) {
      const oldPos = this.currentPos;
      if (!this.inBounds(newPos)) {
        this.adventureLogger.log(this.userName + ", you cannot move " + direction + "!");
        return;
      }
      this.currentPos = newPos;
      this.adventureLogger.log(this.userName + ", you are moving " + direction + ".");

      //play sound on move
      document.getElementById("moveSound").currentTime = 0;
      document.getElementById("moveSound").play();

      //when treasure is found, the player wins
      if (this.currentPos.x == this.treasurePos.x && this.currentPos.y == this.treasurePos.y) {
        this.treasureFound = true;
        this.adventureLogger.log("Yay! You found the treasure!")

        //disable the move controls when treasure is found
        document.getElementById("moveControls").classList.add("disabled");
      }
      this.draw();
    },

    //Move east
    moveEast: function () {
      const oldPos = this.currentPos;
      const newPos = makePos(oldPos.x + 1, oldPos.y);
      this.move("east", newPos);
    },

    //Move west
    moveWest: function () {
      const oldPos = this.currentPos;
      const newPos = makePos(oldPos.x - 1, oldPos.y);
      this.move("west", newPos)
    },

    //Move North
    moveNorth: function () {
      const oldPos = this.currentPos;
      const newPos = makePos(oldPos.x, oldPos.y + 1);
      this.move("north", newPos)
    },

    //Move South
    moveSouth: function () {
      const oldPos = this.currentPos;
      const newPos = makePos(oldPos.x, oldPos.y - 1);
      this.move("south", newPos)
    },

    //Check if position is inbound
    inBounds: function (pos) {
      return pos.x >= 0 && pos.x < this.width && pos.y >= 0 && pos.y < this.height;
    },

    // Draws the map
    draw: function () {
      var ctx = this.canvas.getContext("2d");
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;

      //Defines the width
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

      //draw the player at current position
      this.drawPlayer(ctx, this.currentPos.x, this.currentPos.y);

      //when treasure is found, proclaim victory!
      if (this.treasureFound) {
        const x = this.treasurePos.x * cellSize;
        const y = (-(this.treasurePos.y - this.height) - 1) * cellSize;
        //display treasure icon
        var img = new Image();
        img.src = 'images/if_treasure_45274.png';
        img.addEventListener('load', function () {
          ctx.drawImage(img, x, y)
        }, false);
        //display victory message
        ctx.font = "30px Arial";
        ctx.fillText("Yay, you found the treasure!", 10, 50);
      }
    },

    //draw the player at a given position
    drawPlayer: function (ctx, x, y) {
      ctx.beginPath();
      const cellSize = this.canvas.width / this.width;
      //inverse the axis to start from the bottom left
      ctx.rect(x * cellSize, (-(y - this.height) - 1) * cellSize, cellSize, cellSize);
      ctx.fillStyle = "crimson";
      ctx.fill();
      ctx.closePath();
    }
  };
  return map;
}

//
function makePos(x, y) {
  return {
    x: x,
    y: y
  }
}

// generate a random treasure position
function generateRandomTreasurePos(width, height) {
  const x = Math.floor(Math.random() * width);
  const y = Math.floor(Math.random() * height);
  return makePos(x, y);
}

//generate the console logger
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
