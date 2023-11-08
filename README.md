# Reading Controller inputs with the Gamepad API
With javascript, you can develop games that can run in anyone's web browser. Keyboard and Mouse inputs work fine but have you ever wanted to make your games playable with a controller? To make your game play just like a console game? With the controller api, you can do that.

## The main loop
Since there is no event for when a button is pressed on the gamepad, we will have to use a loop on a timer instead. Fortunately, this is already how most games run.  
For this project's main loop, I will be using setTimout to run code 60 times every second.  
![const frameDelay = 1000/60; let running = true; async function main() { while (running) { /* ... */ await sleep(frameDelay); }}](src/img/main.png)