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

    window.addEventListener('gamepadconnected', e=>this.onControllerConnected(e));
    window.addEventListener('gamepaddisconnected', e=>this.onControllerDisconnected(e));
  }

  tick() {
    if (this.activeGamepadIndex>=0) {
      let gamepad = navigator.getGamepads().find(g=>{return g!==null && g.index===this.controllerBar[this.activeGamepadIndex].index;})
      if (gamepad) {
        

        //update info
        let infoP = this.element.querySelector(".controller-info > p");
        //I don't have the time so I'm bringing out the <br> tag
        infoP.innerHTML = `<b>Index</b>: ${gamepad.index}`;
        infoP.innerHTML += `<br><b>Id</b>: ${gamepad.id}`;
        infoP.innerHTML += `<br><b>Mapping</b>: ${gamepad.mapping}`;
        infoP.innerHTML += `<br><b>Timestamp</b>: ${gamepad.timestamp}`;

        // infoP.innerHTML += `<br><b>Hand</b>: `; //Firefox is trolling me hard with this one
        // if (gamepad.hand) {
        //   infoP.innerHTML += `${gamepad.hand}`;
        // } else {
        //   infoP.innerHTML += `unavailable in this browser`;
        // }
        //update axis
        let axis = [...this.element.querySelectorAll(".controller-axis > .dual-axis")];
        for (let i=0;i<gamepad.axes.length;++i) {
          let a = Math.floor(i/2);
          if (i&1) {
            axis[a].querySelector(".circle").style.top = `${gamepad.axes[i] * 50 + 25}px`;
          } else {
            axis[a].querySelector(".circle").style.left = `${gamepad.axes[i] * 50 + 25}px`;
          }
        }
        //update buttons
        let buttons = [...this.element.querySelectorAll(".controller-buttons > .button")];
        buttons.forEach((e,i) => {
          let pressed = e.querySelector(".pressed");
          if (gamepad.buttons[i].pressed) {
            pressed.classList.add("active");
          } else {
            pressed.classList.remove("active");
          }
          let analog = e.querySelector(".analog > .analog-fill");
          analog.style.width = `${gamepad.buttons[i].value * 100}%`;
        });
      }
    }
  }

  selectionChanged() {
    let container = this.element.querySelector(".controller-container");
    if (container) {
      container.remove();
    }
    if (this.activeGamepadIndex>=0) {
      /** @type {Gamepad} */
      let gamepad = navigator.getGamepads().find(g=>{return g!==null && g.index===this.controllerBar[this.activeGamepadIndex].index;});
      container = document.createElement("div");
      container.classList.add("controller-container");
      this.element.appendChild(container);
      
      let left = document.createElement("div");
      let right = document.createElement("div");
      left.classList.add("col-2");
      right.classList.add("col-2");

      container.appendChild(left);
      container.appendChild(right);

      //create info section
      let info = document.createElement("div");
      info.classList.add("controller-info")
      let infoH2 = document.createElement("h2");
      infoH2.innerHTML = "Controller info";
      info.appendChild(infoH2);
      let infoP = document.createElement("p");
      info.appendChild(infoP);

      left.appendChild(info);

      //create axis section
      let axis = document.createElement("div");
      axis.classList.add("controller-axis");
      for (let i=0;i<gamepad.axes.length;i+=2) {
        let dualAxis = document.createElement("div");
        dualAxis.classList.add("dual-axis");
        let circle = document.createElement("div");
        circle.classList.add("circle");
        dualAxis.appendChild(circle);
        axis.appendChild(dualAxis);
      }
      left.appendChild(axis);

      //create buttons section
      let buttons = document.createElement("div");
      buttons.classList.add("controller-buttons");

      for (let i=0;i<gamepad.buttons.length;++i) {
        let button = document.createElement("div");
        button.classList.add("button");
        let p = document.createElement("p");
        p.innerHTML = `button ${i}`;
        button.appendChild(p);
        let pressed = document.createElement("div");
        pressed.classList.add("pressed");
        button.appendChild(pressed);
        let analog = document.createElement("div");
        analog.classList.add("analog")
        button.appendChild(analog);
        let analogFill = document.createElement("div");
        analogFill.classList.add("analog-fill");
        analog.appendChild(analogFill);
        buttons.appendChild(button);
      }

      right.appendChild(buttons);
    }
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
      this.selectionChanged();
    });
  }
  removeController(index) {
    this.controllerBar[index].element.remove();
    if (this.activeGamepadIndex>=index) {
      this.unsetIndex(this.activeGamepadIndex);
      this.controllerBar.splice(index,1);
      if (this.activeGamepadIndex===index) {
        this.activeGamepadIndex = -1;
        this.selectionChanged();
      } else if (this.activeGamepadIndex>index) {
        this.activeGamepadIndex--;
        this.setIndex(this.activeGamepadIndex);
      }
      this.selectionChanged();
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
    document.getElementById("no-controller").style.display = "none";
    this.addController(e.gamepad);

    if (this.activeGamepadIndex>=0) {
      this.unsetIndex(this.activeGamepadIndex);
    }
    this.activeGamepadIndex = this.controllerBar.length-1;
    this.setIndex(this.activeGamepadIndex);
    this.selectionChanged();
  }
  onControllerDisconnected(e) {
    this.controllerBar.forEach((c, i)=>{
      if (c.index === e.gamepad.index) {
        this.removeController(i);
      }
    });
    if (this.controllerBar.length===0) {
      document.getElementById("no-controller").style.display = "inline";
    }
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