//define canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");




//first position of square
function drawSquare() {
  ctx.beginPath();
  ctx.rect(0, 0, 25, 25);
  ctx.fillStyle = "crimson";
  ctx.fill();
  ctx.closePath();
}
drawSquare();

function createMap(width, height, canvas, startPos, treasurePos) {
  var map = {
    width: width,
    height: height,
    canvas: canvas,
    startPos: startPos,
    treasurePos: treasurePos,
    currentPos: startPos,

    moveEast: function () {
      const oldPos = this.currentPos;
      this.currentPos = makePos(oldPos.x + 1, oldPos.y);
      console.log("Moving east from ", oldPos, " to ", this.currentPos);
    },
    moveWest: function () {
      const oldPos = this.currentPos;
      this.currentPos = makePos(oldPos.x - 1, oldPos.y);
      console.log("Moving west from ", oldPos, " to ", this.currentPos);
    },
    moveNorth: function () {
      const oldPos = this.currentPos;
      this.currentPos = makePos(oldPos.x, oldpos.y + 1);
      console.log("Moving north from ", oldPos, " to ", this.currentPos);
    },
    moveSouth: function () {
      const oldPos = this.currentPos;
      this.currentPos = makePos(oldPos.x, oldPos.y - 1);
      console.log("Moving south from ", oldPos, " to ", this.currentPos);
    },

    currentPosition: function () {
      return this.currentPos;
    },

    treasurePosition: function () {
      return this.treasurePos;
    },

    isAtTreasurePos: function () {
      return this.currentPos == this.treasurePos;
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


var map = createMap(3, 3, canvas, makePos(0, 0), makePos(2, 2));
console.log("hello");
