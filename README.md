# Reading Controller inputs with the Gamepad API
With javascript, you can develop games that can run in anyone's web browser. Keyboard and Mouse inputs work fine but have you ever wanted to make your games playable with a controller? To make your game play just like a console game? With the controller api, you can do that.

## Events
There are 2 events in the gamepad api: **'gamepadconnected'** and **'gamepaddisconnected'**.  
The gamepadconnected event is called whenever a gamepad is connected or, when a button is first pressed if the controller was connected before the page loaded.  
The gamepaddisconnected event is called whenever a gamepad is disconnected.
Gamepad events will have a **'gamepad'** property which whill be a Gamepad object.

## navigator.getGamepads
The navigator.getGamepads method will return an array of all connected gamepads. This is
## The main loop
Since there is no event for when a button is pressed on the gamepad, we will have to use a loop on a timer instead. Fortunately, this is already how most games run.  
For this project's main loop, I will be using setTimout to run code 60 times every second.  
![const frameDelay = 1000/60; let running = true; async function main() { while (running) { /* ... */ await sleep(frameDelay); }}](src/img/main.png)

## The Gamepad object
The gamepad object has 4 non-array properties and 2 array properties.  
index: Unique id given by the browser to this controller. No 2 controller will share the same index.

![](src/img/controller.png)