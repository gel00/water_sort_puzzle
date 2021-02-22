"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var level = 1;
var screenHeight = window.innerHeight;
var screenWidth = window.innerWidth;
var tubeHeight = 250;
var tubeWidth = 50;
var numOfTubes = 4;
var marginX = (screenWidth - numOfTubes * tubeWidth) / (numOfTubes + 1);
var container = document.getElementById("container");
var tubes = [];
var generatedColors = [["red", "yellow", "yellow", "yellow"], ["red", "green", "blue", "yellow"], ["yellow", "blue", "green", "red"], ["", "", "", ""]];
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
      if (selectedTube !== this) {
        if (selectedTube) {
          selectedTube.drop();
        }

        selectedTube = this;
        this.el.style.top = this.offsetY - 100 + "px";
      } else {
        selectedTube.drop();
        selectedTube = "";
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
      var _this = this;

      this.moveTo(destinationTube);
      var fill = setInterval(function () {
        console.log("run");
        _this.level--;

        var color = _this.colors.pop();

        destinationTube.colors.push(color);
        destinationTube.fill(color);

        var index = _this.getState();

        _this.rotate(degs[index]);

        _this.setFluidLevel(states[index]);

        if (!_this.isMixable(destinationTube)) {
          clearInterval(fill);
          console.log("stop");
        }
      }, 200);
    }
  }, {
    key: "fill",
    value: function fill(color) {
      if (this.level < this.limit) {
        //fill direction: backward
        var index = this.limit - 1 - this.level;
        this.fluids[index].setColor(color);
        this.fluids[index].setHeight(50);
        this.level++;
      }
    }
  }, {
    key: "rotate",
    value: function rotate(deg) {
      this.el.style.transform = "rotateZ(-".concat(deg, "deg)");
      this.fluidsEl.style.transform = "rotateZ(".concat(deg, "deg)");
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
var degs = [0, 63, 76, 79, 85, 90]; //create tubes

var _loop = function _loop(i) {
  var tubeEl = document.createElement("DIV");
  tubeEl.classList.add("test_tube");
  tubeEl.id = "tube".concat(i + 1);
  tubeEl.style.top = "300px";
  var x = marginX + i * (tubeWidth + marginX);
  var tube = new Tube(generatedColors[i], tubeEl, x, 300);
  tubes.push(tube);
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