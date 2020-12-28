//gamestates
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//global var
var jet, jetImage;
var sky, skyImage;
var misrand, birdrand;
var missile, missile1, missile2, missileGroup;
var bird, birdGroup;
var swiftImg, eagleImg, parrotImg;
var time, score;
var restart, restartImg, over, overImg;
var bullet, bulletGroup;

function preload() {
  //loading the images for background, jet, missile, birds
  jetImage = loadImage("jet.png");
  skyImage = loadImage("sky.png");
  missile1 = loadImage("missile1.png");
  missile2 = loadImage("missile2.png");
  swiftImg = loadImage("swift.png");
  eagleImg = loadImage("eagle.png");
  parrotImg = loadImage("parrot.png");
  restartImg = loadImage("restart.png");
  overImg = loadImage("over.png");
}

function setup() {
  //creating the canvas
  createCanvas(windowWidth, windowHeight);

  //creating edges
  edges = createEdgeSprites();

  //sky background
  sky = createSprite(width / 2, height / 2, 10, 10);
  sky.addImage(skyImage);
  sky.scale = 2;
  sky.velocityX = -5;
  sky.x = sky.width / 2;

  //making the jet
  jet = createSprite(width / 2.5, height / 2, 30, 30);
  jet.addImage(jetImage);
  jet.scale = 0.3;
  jet.setCollider("circle",0,0,200);
  //jet.debug = true;
  
  //restart icon
  restart = createSprite(width/2, 4*height/5, 40, 40);
  restart.addImage(restartImg);
  restart.scale = 0.08;
  
  //over banner
  over = createSprite(width/2, height/4, 10, 10);
  over.addImage(overImg);
  over.scale = 0.15;

  //groups for bird, bullet and missile
  birdGroup = createGroup();
  missileGroup = createGroup();
  bulletGroup = createGroup();

  time = 0;
  score = 0;
}

function draw() {
  //background colour
  background(220);

  //making infinite background
  if (sky.x < 0) {
    sky.x = sky.width / 2;
  }

  //making the jet collide on edges
  jet.collide(edges);

  fill("black");
  textSize(20);
  stroke("black");
  text("SURVIVAL TIME: " + time, 3 * width / 5, height / 7);
  text("SCORE: "+score, 3*width/5, height/5);

  if (gameState === 1) {
    
    //making restart icon and over banner invisible
    restart.visible = false;
    over.visible = false;

    //controlling the jet right
    if (keyDown("up_arrow")) {
      jet.y = jet.y - 5;
    }

    //controlling the jet left
    if (keyDown("down_arrow")) {
      jet.y = jet.y + 5;
    }

    //counting time
    time = Math.round(frameCount / getFrameRate());
    
    //counting score
    if(bulletGroup.isTouching(missileGroup)) {
      score = score + 2;
      bulletGroup.destroyEach();
      missileGroup.destroyEach();
    }
    
    if(bulletGroup.isTouching(birdGroup)) {
      score = score + 1;
      bulletGroup.destroyEach();
      birdGroup.destroyEach();
    }

    //spawn the missile, bullets and birds
    spawnMissiles();
    spawnBirds();
    bullets();
    
    //collision of bird and missile
    if(birdGroup.isTouching(missileGroup)) {
      birdGroup.destroyEach();
      missileGroup.destroyEach();
    }

    //ending the game
    if (jet.isTouching(birdGroup) ||
      jet.isTouching(missileGroup)) {
      gameState = 0;
    }

  } else if (gameState === 0) {
    //making the background stop
    sky.velocityX = 0;

    //set lifetime for objects so that they are never destroyed
    birdGroup.setLifetimeEach(-1);
    missileGroup.setLifetimeEach(-1);

    //setting up an velocity for food and obstacle
    birdGroup.setVelocityXEach(0);
    missileGroup.setVelocityXEach(0);
    
    //making restart icon and over banner visible
    restart.visible = true;
    over.visible = true;
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }

  //displaying the sprites
  drawSprites();
}

function reset() {
  gameState = 1;
  birdGroup.destroyEach();
  missileGroup.destroyEach();
  time = 0;
  score = 0;
  sky.velocityX = -5;
  jet.y = height/2;
}

function bullets() {
  if(keyDown("space")) {
    bullet = createSprite(width/2, height/2, 10,3);
    bullet.x = jet.x;
    bullet.y = jet.y;
    bullet.velocityX = 8;
    bullet.lifetime = 800;
    bulletGroup.add(bullet);
  }
}

function spawnBirds() {
  if (frameCount % 120 === 0) {
    bird = createSprite(width, height / 2, 20, 20);
    bird.y = Math.round(random(height - 100, -height - 100));
    bird.velocityX = -6;
    bird.lifetime = 1200;
    bird.scale = 1;
    birdGroup.add(bird);
    //bird.debug = true;

    birdrand = Math.round(random(1, 3));
    console.log(birdrand);
    switch (birdrand) {
      case 1:
        bird.addImage(swiftImg);
        bird.scale = 0.085;
        bird.setCollider("circle",0,0,625);
        break;

      case 2:
        bird.addImage(eagleImg);
        bird.scale = 0.3;
        bird.setCollider("circle",0,0,200);
        break;

      case 3:
        bird.addImage(parrotImg);
        bird.scale = 0.1;
        bird.setCollider("circle",0,0,420);
        break;

      default:  break;
    }
  }
}

function spawnMissiles() {
  if (frameCount % 100 === 0) {
    missile = createSprite(-width, height / 2, 30, 30);
    missile.y = Math.round(random(height - 50, -height - 50));
    missile.velocityX = 7;
    missile.lifetime = 1200;
    missile.scale = 0.5;
    missileGroup.add(missile);
    //missile.debug = true;

    misrand = Math.round(random(1, 2));
    //console.log(misrand);
    switch (misrand) {
      case 1:
        missile.addImage(missile1);
        missile.setCollider("rectangle",0,0,665,150);
        missile.scale = 0.2;
        break;

      case 2:
        missile.addImage(missile2);
        missile.setCollider("rectangle",0,0,420,100);
        missile.scale = 0.4;
        break;

      default:  break;
    }
  }
}