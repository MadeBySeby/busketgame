import {
  Application,
  Assets,
  Text,
  Sprite,
  Container,
  Graphics,
} from "pixi.js";
import { addApples } from "./apples";
import { Button } from "@pixi/ui";

(async () => {
  // Create a new application
  const app = new Application();
  const apples = [];
  // Initialize the application
  await app.init({ background: "#1099bb", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container").appendChild(app.canvas);
  await Assets.load([
    {
      alias: "shopping-cart",
      src: "/assets/shopping-cart-icon.svg",
    },
    {
      alias: "apple",
      src: "/assets/apple.svg",
    },
  ]);
  const gameControll = {
    KeyD: "right",
    ArrowRight: "right",
    KeyA: "left",
    ArrowLeft: "left",
  };
  let keys = {
    right: { pressed: false },
    left: { pressed: false },
  };
  window.addEventListener("keydown", (e) => keydownHandler(e));
  window.addEventListener("keyup", (e) => keyupHandler(e)); // შემეძლო controller კლასსში გადამეტანა

  function keydownHandler(e) {
    const key = gameControll[e.code];
    if (!key) return;
    keys[key].pressed = true;
  }
  function keyupHandler(e) {
    const key = gameControll[e.code];
    if (!key) return;
    keys[key].pressed = false;
  }
  const busket = Sprite.from("shopping-cart");
  let score = 0;
  const counter = new Text({
    text: score,
    style: {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xff1010,
      align: "center",
    },
  });
  const btnContainer = new Container();
  btnContainer.y = app.screen.height * 0.9;
  // btnContainer.y = 100;
  btnContainer.x = 200;

  // Create the button (rectangle)
  const button = new Graphics();

  // Create the text
  let startingText = "click to start";
  const btnText = new Text({
    text: startingText,
    fill: 0xffffff,
    fontSize: 20,
  });
  btnText.anchor.set(0.5);
  // btnText.x = 200 / 2;
  // btnText.y = 50 / 2;

  btnContainer.addChild(button);
  btnContainer.addChild(btnText);

  btnContainer.interactive = true;
  btnContainer.buttonMode = true;
  btnContainer.cursor = "pointer";
  let start = false;
  btnContainer.on("pointerdown", () => {
    start = true;
  });

  app.stage.addChild(btnContainer);

  app.stage.addChild(counter);
  busket.x = 100;
  busket.anchor.set(0.5);
  const minbasketHeight = 800;
  busket.y = Math.min(minbasketHeight, app.screen.height * 0.7);
  app.stage.addChild(busket);
  let busket_speed = 15;
  let apple_count = 5;
  let apple_speed = 2;
  addApples(app, apples, apple_count, apple_speed);

  app.stage.addChild(button);
  app.stage.addChild(busket);
  app.ticker.add((time) => {
    // console.log(busket.x, busket.y);
    if (keys.right.pressed) {
      busket.x = Math.min(
        busket.x + busket_speed,
        app.screen.width - busket.width / 2
      );
    } else if (keys.left.pressed) {
      busket.x = Math.max(busket.x - busket_speed, 0);
    }
    if (!start) return;
    apples.forEach((apple, i) => {
      apple.y += apple.speed;
      const appleLeft = apple.x - apple.width / 2;
      const appleRight = apple.x + apple.width / 2;
      const appleTop = apple.y - apple.height / 2;
      const appleBottom = apple.y + apple.height / 2;
      const basketLeft = busket.x - busket.width / 2;
      const basketRight = busket.x + busket.width / 2;
      const basketTop = busket.y - busket.height / 2;
      const basketBottom = busket.y + busket.height / 2;
      if (
        appleRight > basketLeft &&
        appleLeft < basketRight &&
        appleBottom > basketTop &&
        appleTop < basketBottom - 20
      ) {
        app.stage.removeChild(apple);
        if (app) score++;
        apples.splice(i, 1);
        counter.text = score.toString();
      }
      if (apples.length < 1) {
        start = false;
        alert("well done now level 2");
        startingText = `click to start level 2`;
        apple_speed += 1;
        apple_count += 2;
        busket_speed += 0.5;
        score = 0;
        addApples(app, apples, apple_count, apple_speed);
      }
    });
  });
})();
