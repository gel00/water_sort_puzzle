

let level = 1;

const screenHeight= window.innerHeight;
const screenWidth = window.innerWidth; 
const tubeHeight = 250;
const tubeWidth = 50;
let numOfTubes = 4;
const marginX = (screenWidth - numOfTubes * tubeWidth) / (numOfTubes+1);



const container = document.getElementById("container");
const tubes = [];
const generatedColors = [["red","yellow","yellow","yellow"],["red","green","blue","yellow"],["yellow","blue","green","red"],["","","",""]];













/*-----------------------------*/
class Tube {
  constructor (colorArr, htmlElement, x,y) {
    this.offsetX = x;
    this.offsetY = y;
    this.el = htmlElement;
    this.colors = colorArr.filter(color => color);
    this.fluids = [];
    this.level = 0;
  }
  lift(){
    if (selectedTube !== this) {
      if(selectedTube) {
        selectedTube.drop();
      }
      selectedTube = this;
    this.el.style.top = this.offsetY - 100 + "px";
    } else {
      selectedTube.drop();
      selectedTube = "";
    }
  }
  drop (){
    
    this.el.style.top = this.offsetY + "px";
  }
  isNotFull(){ 
    return this.colors.length < this.limit;
  }

  isEmpty(){
    return this.colors.join("").length === 0;
  }
  isMixable(destinationTube) {
    return !this.isEmpty() && destinationTube.isNotFull() &&
      this.colors[this.colors.length-1] == destinationTube.colors[destinationTube.colors.length-1] && 
      this.colors !== destinationTube.colors || destinationTube.isEmpty();
  }
  mixTubes (destinationTube) {
    this.moveTo(destinationTube);
    let fill = setInterval(
      ()=>{
        console.log("run");
        this.level--;
        const color = this.colors.pop();
        destinationTube.colors.push(color);
        destinationTube.fill(color);
        let index = this.getState();
        this.rotate(degs[index]);
        this.setFluidLevel(states[index]);
        
       if (!this.isMixable(destinationTube)){
         clearInterval(fill);
         console.log("stop");
       }
      },200
    );
  }
  fill (color) {
    if (this.level < this.limit) {
      //fill direction: backward
      let index = this.limit -1 -this.level;
      this.fluids[index].setColor(color);
      this.fluids[index].setHeight(50);
      this.level++;
    }
  }
  rotate(deg) {
    this.el.style.transform = `rotateZ(-${deg}deg)`;
    this.fluidsEl.style.transform = `rotateZ(${deg}deg)`;
  }
  setFluidLevel(heightArr) {
    this.fluids.forEach((fluid,i) => {
      fluid.setHeight(heightArr[i])
    });
  }
  moveTo(destinationTube) {
    this.el.style.top = destinationTube.offsetY - 100 +  "px";
    this.el.style.left = destinationTube.offsetX + 25 + "px";
    let index = states.length - this.level-1;
    this.rotate(degs[index]);
    this.setFluidLevel(states[index]);
  }
  getState() {
    return states.length - this.level-1;
  }
}

Tube.prototype.limit = 4;

let selectedTube = "";


class Fluid {
  constructor (tube, color, htmlElement, height=50) {
    this.tube = tube;
    this.color = color;
    this.el = htmlElement;
    if(color) {
      this.el.style.backgroundColor = color;
      this.height = height;
      this.el.style.height = height + "px";
    } else {
      this.height = 0;
      this.el.style.height = 0;
    }
    tube.fluids.unshift(this);
  }

  setHeight(num) {
    this.el.style.height = num + "px";
    this.height = num;
  }
  setColor(color) {
    this.el.style.backgroundColor = color;
    this.color = color;
  }
}
let state0 = [50,50,50,50];
let state1 = [22,22,22,90];
let state2 = [0,12,14,104];
let state3 = [0,0,12,110];
let state4 = [0,0,0,110];
let state5 = [0,0,0,97];
let states = [state0,state1,state2,state3,state4,state5];
let degs = [0,63,76,79,85,90];
//create tubes
for (let i=0;i<numOfTubes;i++) {
  const tubeEl = document.createElement("DIV");
  tubeEl.classList.add("test_tube");
  tubeEl.id = `tube${i+1}`;
  tubeEl.style.top = "300px";
  let x = marginX + i * (tubeWidth + marginX) ;
  const tube = new Tube(generatedColors[i],tubeEl,x, 300);
  tubes.push(tube);
  tubeEl.style.left = x+"px"; 

  //create fluids wrapper
  const fluidsEl = document.createElement("DIV");
  fluidsEl.classList.add("fluids");
  tubeEl.appendChild(fluidsEl);
  //create fluid
  generatedColors[i].forEach((colors)=>{
    const fluidEl = document.createElement("DIV");
    fluidEl.classList.add("fluid");
    const fluid = new Fluid(tube,colors,fluidEl);
    fluidsEl.prepend(fluidEl);
    
  });
  //set tube's properties (level,fluidsEl)
  tube.fluidsEl = fluidsEl;
  tube.level = generatedColors[i].filter(color=>color).length;

  //append + eventListener
  container.appendChild(tubeEl);
  tubeEl.addEventListener("click",(event)=>{
    tube.lift();
  })
}


