"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var level = 1;
var saves = [];
var screenHeight = window.innerHeight;
var screenWidth = window.innerWidth;
var tubeHeight = 250;
var tubeWidth = 50;
var numOfTubes = 6;
var marginX = (screenWidth - numOfTubes * tubeWidth) / (numOfTubes + 1);

var makeConfetty = function makeConfetty(duration, x, y) {
  var end = Date.now() + duration;

  var frame = function frame() {
    // launch a few confetti from the left edge
    confetti({
      particleCount: 12,
      angle: 90,
      spread: 55,
      origin: {
        x: x / screenWidth,
        y: y / screenHeight
      }
    }); // and launch a few from the right edge

    /*confetti({
      particleCount: 7,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });*/
    // keep going until we are out of time

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
};

var container = document.getElementById("container");
var tubes = [];

var generateColors = function generateColors(colorArr, level, totalOfTubes) {
  var numOfTubes = colorArr.length;
  var arr = [];
  colorArr.forEach(function (color) {
    for (var i = 0; i < level; i++) {
      arr.push(color);
    }
  }); //shuffle colors

  arr.sort(function () {
    return .5 - Math.random();
  }); //split into tubes

  arrs = new Array(Math.ceil(arr.length / level)).fill().map(function (_) {
    return arr.splice(0, level);
  });

  for (var i = 0, empty = totalOfTubes - colorArr.length; i < empty; i++) {
    var emptyTube = [];

    for (var _i = 0; _i < level; _i++) {
      emptyTube.push("");
    }

    arrs.push(emptyTube);
  }

  return arrs;
}; //const generatedColors = [["red","yellow","yellow","yellow"],["blue","green","red","yellow"],["yellow","red","green","blue"],["","","",""]];


var generatedColors = [];
var counter = 0;

var checkGameWin = function checkGameWin() {
  if (counter === 4) {
    var duration = 3 * 1000;
    var end = Date.now() + duration;
    console.log("win");

    (function frame() {
      // launch a few confetti from the left edge
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: {
          x: 0
        }
      }); // and launch a few from the right edge

      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: {
          x: 1
        }
      }); // keep going until we are out of time

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }
};

var line = document.createElement("div");
line.classList.add('line');
document.body.appendChild(line);
var gameState = [];
/*-----------------------------*/

var Tube =
/*#__PURE__*/
function () {
  function Tube(colorArr, htmlElement, x, y) {
    _classCallCheck(this, Tube);

    this.offsetX = x;
    this.offsetY = y;
    this.el = htmlElement;
    this.colors = colorArr.filter(function (color) {
      return color;
    });
    this.fluids = [];
    this.level = 0;
  }

  _createClass(Tube, [{
    key: "lift",
    value: function lift() {
      if (selectedTube) {
        if (selectedTube !== this) {
          if (selectedTube.isMixable(this)) {
            selectedTube.mixTubes(this);
            selectedTube = "";
          } else {
            selectedTube.drop();
            selectedTube = this;
            this.el.style.top = this.offsetY - 100 + "px";
          }
        } else {
          selectedTube.drop();
          selectedTube = "";
        }
      } else {
        selectedTube = this;
        this.el.style.top = this.offsetY - 100 + "px";
      }
    }
  }, {
    key: "drop",
    value: function drop() {
      this.el.style.top = this.offsetY + "px";
    }
  }, {
    key: "isNotFull",
    value: function isNotFull() {
      return this.colors.length < this.limit;
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return this.colors.join("").length === 0;
    }
  }, {
    key: "isMixable",
    value: function isMixable(destinationTube) {
      return !this.isEmpty() && destinationTube.isNotFull() && this.colors[this.colors.length - 1] == destinationTube.colors[destinationTube.colors.length - 1] && this.colors !== destinationTube.colors || destinationTube.isEmpty();
    }
  }, {
    key: "mixTubes",
    value: function mixTubes(destinationTube) {
      var amount = 0;
      var color = this.colors[this.colors.length - 1];

      do {
        var _color = this.colors.pop();

        destinationTube.colors.push(_color);
        amount++;
      } while (this.isMixable(destinationTube));

      var state = states.length - 1 - (this.level - amount);
      this.pour(color, state, amount, destinationTube);
      saveGame();
    }
  }, {
    key: "checkWinState",
    value: function checkWinState(destinationTube) {
      if (destinationTube.colors.every(function (color, i, arr) {
        return color === arr[0];
      }) && destinationTube.level == this.limit) {
        var x = destinationTube.offsetX;
        var y = destinationTube.offsetY;
        makeConfetty(100, x, y);
        counter++;
        checkGameWin();
      }
    }
  }, {
    key: "pour",
    value: function pour(color, stateIndex, amount, destinationTube) {
      var _this = this;

      var duration = amount * 200;
      setTimeout(function () {
        //move tube back
        setTimeout(function () {
          _this.setOwnDuration(300);

          _this.setFluidDuration(300);

          destinationTube.removeLine();

          _this.clearFluidColors(amount);

          _this.moveBack();

          _this.checkWinState(destinationTube);
        }, duration); //pour tube out
        //this.el.style.transitionDuration = duration + "ms";
        //this.setFluidDuration(duration);

        destinationTube.drawLine(color);

        _this.rotate(degs[stateIndex]);

        _this.setFluidLevel(states[stateIndex]);

        destinationTube.fill(color, amount);
      }, 200); //move tube to destionation
      //this.setOwnDuration(200);
      //this.setFluidDuration(200);

      this.moveTo(destinationTube);
    }
  }, {
    key: "clearFluidColors",
    value: function clearFluidColors(amount) {
      for (var i = 0; i < amount; i++) {
        var index = this.limit - this.level;
        this.fluids[index].setColor("");
        this.level--;
      }
    }
  }, {
    key: "moveBack",
    value: function moveBack() {
      this.el.style.top = this.offsetY + "px";
      this.el.style.left = this.offsetX + "px";
      this.rotate(0);
      this.setFluidLevel(states[0]);
    }
  }, {
    key: "fill",
    value: function fill(color) {
      var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      if (this.level < this.limit) {
        for (var i = 0; i < amount; i++) {
          var index = this.limit - 1 - this.level;
          this.fluids[index].setColor(color);
          this.fluids[index].setHeight(50);
          this.level++;
        }
      }
    }
  }, {
    key: "drawLine",
    value: function drawLine(color) {
      line.style.display = "block";
      line.style.top = this.offsetY - 100 + "px";
      line.style.left = this.offsetX + 21 + "px";
      line.style.height = (this.limit - this.level) * 50 + 150 + "px";
      line.style.backgroundColor = color;
    }
  }, {
    key: "removeLine",
    value: function removeLine() {
      line.style.display = "none";
    }
  }, {
    key: "rotate",
    value: function rotate(deg) {
      this.el.style.transform = "rotateZ(".concat(deg * -1, "deg)");
      this.fluidsEl.style.transform = "rotateZ(".concat(deg, "deg)");
    }
  }, {
    key: "setFluidDuration",
    value: function setFluidDuration(duration) {
      this.fluids.forEach(function (fluid) {
        fluid.setDuration(duration);
      });
    }
  }, {
    key: "setOwnDuration",
    value: function setOwnDuration(duration) {
      this.el.style.transitionDuration = duration + "ms";
    }
  }, {
    key: "setFluidLevel",
    value: function setFluidLevel(heightArr) {
      this.fluids.forEach(function (fluid, i) {
        fluid.setHeight(heightArr[i]);
      });
    }
  }, {
    key: "moveTo",
    value: function moveTo(destinationTube) {
      this.el.style.top = destinationTube.offsetY - 100 + "px";
      this.el.style.left = destinationTube.offsetX + 25 + "px";
      var index = states.length - this.level - 1;
      this.rotate(degs[index]);
      this.setFluidLevel(states[index]);
    }
  }, {
    key: "getState",
    value: function getState() {
      return states.length - this.level - 1;
    }
  }]);

  return Tube;
}();

Tube.prototype.limit = 4;
var selectedTube = "";

var Fluid =
/*#__PURE__*/
function () {
  function Fluid(tube, color, htmlElement) {
    var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 50;

    _classCallCheck(this, Fluid);

    this.tube = tube;
    this.color = color;
    this.el = htmlElement;

    if (color) {
      this.el.style.backgroundColor = color;
      this.height = height;
      this.el.style.height = height + "px";
    } else {
      this.height = 0;
      this.el.style.height = 0;
    }

    tube.fluids.unshift(this);
  }

  _createClass(Fluid, [{
    key: "setDuration",
    value: function setDuration(duration) {
      this.el.style.transitionDuration = duration + "ms";
    }
  }, {
    key: "setHeight",
    value: function setHeight(num) {
      this.el.style.height = num + "px";
      this.height = num;
    }
  }, {
    key: "setColor",
    value: function setColor(color) {
      this.el.style.backgroundColor = color;
      this.color = color;
    }
  }]);

  return Fluid;
}();

var state0 = [50, 50, 50, 50];
var state1 = [22, 22, 22, 90];
var state2 = [0, 12, 14, 104];
var state3 = [0, 0, 12, 110];
var state4 = [0, 0, 0, 110];
var state5 = [0, 0, 0, 97];
var states = [state0, state1, state2, state3, state4, state5];
var degs = [0, 64, 76, 79, 85, 90]; //create tubes

var newGame = function newGame() {
  saves = [];
  counter = 0;
  generatedColors = generateColors(["red", "green", "blue", "yellow"], 4, 6);
  gameState = _toConsumableArray(generatedColors);
  createGame();
};

var createGame = function createGame() {
  container.innerHTML = "";

  var _loop = function _loop(i) {
    var tubeEl = document.createElement("DIV");
    tubeEl.classList.add("test_tube");
    tubeEl.id = "tube".concat(i + 1);
    tubeEl.style.top = "300px";
    var x = marginX + i * (tubeWidth + marginX);
    var tube = new Tube(generatedColors[i], tubeEl, x, 300);
    tubes.push(tube);
    tube.tubeIndex = i;
    tubeEl.style.left = x + "px"; //create fluids wrapper

    var fluidsEl = document.createElement("DIV");
    fluidsEl.classList.add("fluids");
    tubeEl.appendChild(fluidsEl); //create fluid

    generatedColors[i].forEach(function (colors) {
      var fluidEl = document.createElement("DIV");
      fluidEl.classList.add("fluid");
      var fluid = new Fluid(tube, colors, fluidEl);
      fluidsEl.prepend(fluidEl);
    }); //set tube's properties (level,fluidsEl)

    tube.fluidsEl = fluidsEl;
    tube.level = generatedColors[i].filter(function (color) {
      return color;
    }).length; //append + eventListener

    container.appendChild(tubeEl);
    tubeEl.addEventListener("click", function (event) {
      tube.lift();
    });
  };

  for (var i = 0; i < numOfTubes; i++) {
    _loop(i);
  }
};

newGame();

var saveGame = function saveGame() {
  var btn = document.getElementById("undo");
  btn.classList.remove("disabled");
  var save = [];
  tubes.forEach(function (tube) {
    var colors = [];
    tube.fluids.forEach(function (fluid) {
      colors.push(fluid.color);
    });
    save.push(colors.reverse());
  });
  saves.push(save);
};

loadGame = function loadGame() {
  var btn = document.getElementById("undo");

  if (saves.length > 0) {
    var lastState = saves.pop();
    generatedColors = lastState;
    createGame();
    btn.classList.remove("disabled");

    if (saves.length === 0) {
      btn.classList.add("disabled");
    }
  }
};

var myCanvas = document.createElement('canvas');
var confettiEL = document.getElementById("confetti");
confettiEL.appendChild(myCanvas);
var myConfetti = confetti.create(myCanvas, {
  resize: true
});
myConfetti({
  particleCount: 100,
  startVelocity: 30,
  spread: 360,
  origin: {
    x: 125,
    // since they fall down, start a bit higher than random
    y: 300
  }
});