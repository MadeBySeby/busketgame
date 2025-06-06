import { Container, Sprite } from "pixi.js";

export function addApples(app, apples, appleCount, appleSpeed) {
  // const appleCount = 5;
  //   const appleContainer = new Container();
  for (let i = 0; i < appleCount; i++) {
    const apple = Sprite.from("apple");
    apple.x = app.screen.width * Math.random();
    apple.scale.set(0.2 + Math.random() * 0.2);
    apple.anchor.set(0.5);
    apple.height = 50;
    apple.width = 50;
    // const apple_speed = 2;
    apple.speed = Math.random() * appleSpeed + 1;
    apples.push(apple);
    app.stage.addChild(apple);
  }
}
