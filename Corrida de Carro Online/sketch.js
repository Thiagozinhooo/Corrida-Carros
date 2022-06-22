var canvas;
var backgroundImage;
var database;
var form, player;
var playerCount, gameState, count, state;
var allPlayers;

var car1_Img, car2_Img, track
var car1, car2, cars=[];

var fuels, powerCoins;
var fuelImg, powerCoinImg;

var obstacles, obstacle1Img, obstacle2Img;

function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");

  car1_Img = loadImage("./assets/car1.png");
  car2_Img = loadImage("./assets/car2.png");
  track = loadImage("./assets/track.jpg");

  fuelImg = loadImage("./assets/fuel.png");
  powerCoinImg = loadImage("./assets/goldCoin.png");

  obstacle1Img = loadImage("./assets/obstacle1.png");
  obstacle2Img = loadImage("./assets/obstacle2.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();

}

function draw() {
  background(backgroundImage);

  if(playerCount === 2){
    game.update(1);
  }

  if(gameState === 1){
    game.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}