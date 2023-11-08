"use strict";

class ControllerReader {
  constructor(gamepad) {
    this.index = gamepad.index;
    /** @type {Element} */
    this.element = document.createElement("li");
    this.element.innerHTML = `controller ${this.index}`; //TEMP
  }
}
class GamepadReader {
  constructor(element) {
    /**@type {Element} */
    this.element = element;

    this.activeGamepadIndex = -1;
    /**@type {ControllerReader[]} */
    this.controllerBar = [];

    this.element.addEventListener('gamepadconnected', e=>this.onControllerConnected(e));
    this.element.addEventListener('gamepaddisconnected', e=>this.onControllerDisconnected(e));

    this.onControllerConnected({gamepad: {index: 0}});
    this.onControllerConnected({gamepad: {index: 1}});
    this.onControllerConnected({gamepad: {index: 2}});

    //this.onControllerDisconnected({index: 1});
  }

  tick() {
    
  }

  addController(gamepad) {
    let controllerReader = new ControllerReader(gamepad);
    this.controllerBar.push(controllerReader);
    this.element.querySelector(".controller-bar").appendChild(controllerReader.element);
    //onclick event
    controllerReader.element.addEventListener("click", (e)=>{
      if (this.activeGamepadIndex>=0) {
        this.unsetIndex(this.activeGamepadIndex);
      }
      this.activeGamepadIndex = this.controllerBar.indexOf(controllerReader);
      this.setIndex(this.activeGamepadIndex);
    });
  }
  removeController(index) {

    if (this.activeGamepadIndex>=index) {
      this.unsetIndex(this.activeGamepadIndex);
      this.controllerBar[index].element.remove();
      this.controllerBar.splice(index,1);
      if (this.activeGamepadIndex===index) {
        this.activeGamepadIndex = -1;
      } else if (this.activeGamepadIndex>index) {
        this.activeGamepadIndex--;
        this.setIndex(this.activeGamepadIndex);
      }
    } else {
      this.controllerBar.splice(index,1);
    } 
  }

  unsetIndex(i) {
    this.controllerBar[i].element.setAttribute("data-selected",false);
  }
  setIndex(i) {
    this.controllerBar[i].element.setAttribute("data-selected",true);
  }

  onControllerConnected(e) {
    this.addController(e.gamepad);

    if (this.activeGamepadIndex>=0) {
      this.unsetIndex(this.activeGamepadIndex);
    }
    this.activeGamepadIndex = this.controllerBar.length-1;
    this.setIndex(this.activeGamepadIndex);
  }
  onControllerDisconnected(e) {
    this.controllerBar.forEach((c, i)=>{
      if (c.index === e.index) {
        this.removeController(i);
      }
    });
  }
} 


const frameDelay = 1000/60;
let running = true;

async function main() {
  let gamepadReaders = [];
  [...document.getElementsByClassName("gamepad-reader")].forEach(element=>{
    gamepadReaders.push(new GamepadReader(element));
  });
  while (running) { //I want to do while (true) so badly here
    gamepadReaders.forEach(g=>{
      g.tick();
    });
    await sleep(frameDelay);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


main();