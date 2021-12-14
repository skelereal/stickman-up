var dissapointed;
var bruh;
var boing;
var shutdown;
var superidol;
var slider;

function preload() {
  dissapointed = loadSound('../sound/dissapointed.mp3');
  bruh = loadSound('../sound/bruh.mp3');
  boing = loadSound('../sound/boing.mp3');
  shutdown = loadSound('../sound/shutdown.mp3');
  superidol = loadSound('../sound/super-idol.mp3');
  slider = createSlider(0, 1, 0.5, 0.01);
}

function setup() {
  createCanvas(400, 600);
  platforms = [];
  score = 0;
  deathBg = createImg('../pics/death.jpg');
  deathBg.hide();
  playerLeft = createImg('../pics/playerLeft.png');
  playerLeft.hide();
  playerRight = createImg('../pics/playerRight.png');
  playerRight.hide();
  player = new Player(playerLeft, playerRight);
  platformCount = 5;
  gap = 600 / platformCount;
  for (let i = 0; i < 5; i++) {
    platforms.push(new Platform(random(0, 360), 600 - i * gap));
  }
  superidol.setVolume(slider.value());
  if (!superidol.isPlaying()) {
    superidol.play();
    superidol.loop();
  } else {
    superidol.stop();
    superidol.play();
  }

}
  
function draw() {
  background('#FFFFFF');
  if (player.velocity > 10) {
    noLoop();
    gameOver();
  } else {
    translate(0, 600/2.5 - player.y);
    player.update();
    player.offScreen();
    player.booster();
    for (let platform of platforms) {
      platform.show();
      if (player.y < platforms[platforms.length - 1].y + 200) {
        platforms.push(new Platform(random(25, 300), platforms[platforms.length - 1].y - gap));
      }
    }
    player.show();
    textSize(30);
    fill('#000000');
    textAlign(CENTER);
    text(score, 200, player.y - 150);
    superidol.setVolume(slider.value());
  }
}

function keyPressed() {
  if (key == ' ') {
    setup();
    loop();
  }
}

class Player {
  constructor(left, right) {
    this.x = 200;
    this.y = 300;
    this.width = 40;
    this.height = 60;
    this.velocity = 0;
    this.gravity = 0.1;
    this.jumpForce = -5;
    this.left = left;
    this.right = right;
    this.goingLeft = true;
  }
  show() {
    if (this.goingLeft) {
      image(this.left, this.x, this.y, this.width, this.height);
    } else {
      image(this.right, this.x, this.y, this.width, this.height);
    }
  }
  update() {
    this.y += this.velocity;
    this.velocity += this.gravity;
    if (keyIsDown(37)) {
      player.x -= 2.5;
      this.goingLeft = true;
    }
    if (keyIsDown(39)) {
      player.x += 2.5;
      this.goingLeft = false;
    }
    for (let platform of platforms) {
      if (this.y + this.height >= platform.y && this.y + this.height <= platform.y + platform.height) {
        let minX = platform.x - this.width;
        let maxX = platform.x + platform.width;
        if (this.x >= minX && this.x <= maxX) {
          this.jump();
          if (!boing.isPlaying()){
            boing.play();
          } else {
            boing.stop();
            boing.play();
          }
        }
      }
    }
    if (this.x + this.width < 0) {
      this.x = width;
    }
    if (this.x > width) {
      this.x = 0;
    }
  }
  offScreen() {
    if (platforms[0].y > player.y + 400) {
      platforms.splice(0, 1);
      score++;
    }
  }
  jump() {
    this.velocity = this.jumpForce;
  }
  booster() {
    if (score !== 0 && score % 20 === 0) {
      this.jumpForce = -20;
    } else {
      this.jumpForce = -5;
    }
  }
}

class Platform {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.height = 15;
    this.width = 60;
    this.radius = 5;
  }
  show() {
    fill('#FFD700');
    rect(this.x, this.y, this.width, this.height, this.radius);
  }
}

function gameOver() {
  image(deathBg, 0, 0, 400, 600);
  fill('#000000');
  text(`Bruh, you got ${score}!`, 200, 300);
  textSize(25);
  text(`Hit space to play again..`, 200, 400);

  // Checks if bruh was playing, if then stops then plays
  if (bruh.isPlaying()) {
    bruh.stop();
  } else {
    bruh.play();
  }
  // Checks if dissapointed was playing, if then stops then plays
  if (dissapointed.isPlaying()) {
    dissapointed.stop();
  } else {
    dissapointed.play();
  }
  //d
  shutdown.play();
}