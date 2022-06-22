class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leaderboardTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data){
      gameState = data.val();
    })
  }

  start() {
    form = new Form();
    form.display();
    player = new Player();
    playerCount = player.getCount();

    fuels = new Group();
    powerCoins = new Group();
    obstacles = new Group();

    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Img },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Img },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Img },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Img },
      { x: width / 2, y: height - 2800, image: obstacle2Img },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Img },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Img },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Img },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Img },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Img },
      { x: width / 2, y: height - 5300, image: obstacle1Img },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Img }
    ];

    car1 = createSprite(width/2 -200, height -150);
    car1.addImage("White", car1_Img);
    car1.scale=0.2

    car2 = createSprite(width/2 +200, height -150);
    car2.addImage("Red", car2_Img);
    car2.scale = 0.2

    cars=[car1, car2];

    this.addSprites(fuels, 4, fuelImg, 0.02);
    this.addSprites(powerCoins, 20, powerCoinImg, 0.09);
    this.addSprites(obstacles, obstaclesPositions.length, obstacle1Img, 0.04);
    
  }

  update(state){
    database.ref("/").update({
      gameState: state
    });
  }

  handleElements(){
    form.hide();
    form.titleImg.position(100, 50);
    form.titleImg.size(200,50);

    this.resetTitle.html("Reiniciar Jogo");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width/2+200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width/2+230, 100);

    this.leaderboardTitle.html("Placar");
    this.leaderboardTitle.class("resetText");
    this.leaderboardTitle.position(width/3-60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width/3-50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width/3-50, 130);
  }

  play(){
    this.handleElements();
    this.handleResetButton();

    Player.getPlayersInfo();
    player.getCarsAtEnd();

    if(allPlayers !== undefined){
      image(track, 0, -height*5, width, height*6);

      this.showLeaderboard();

      var index = 0;
      for(var plr in allPlayers){
        index = index+1;

        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        cars[index-1].position.x = x;
        cars[index-1].position.y = y;

        if(index === player.index){
          stroke(50);
          fill("blue");
          ellipse(x, y, 200, 200);

          this.handleFuel(index);
          this.handlePowerCoins(index);

          camera.position.x = cars[index-1].position.x;
          camera.position.y = cars[index-1].position.y;
        }
      }

      this.handlePlayerControls();

      const finishLine = height*6 -100;

      if(player.positionY > finishLine){
        gameState = 2;
        player.rank +=1;
        Player.updateCarsAtEnd(player.rank);
        player.update();
        this.showRank();
      }

      drawSprites();
    }
  }

  handlePlayerControls(){
    if(keyIsDown(UP_ARROW)){
      player.positionY +=10;
      player.update();
    }
    if(keyIsDown(LEFT_ARROW) && player.positionX > width/4){
      player.positionX -=5;
      player.update()
    }
    if(keyIsDown(RIGHT_ARROW) && player.positionX < width/2*2){
      player.positionX +=5;
      player.update()
    }
  }

  showLeaderboard(){
    var leader1, leader2;
    var players = Object.values(allPlayers);

    if(players[0].rank === 0 && players[1].rank === 0 || players[0].rank === 1);{
      leader1 = players[0].rank +"          "+ players[0].name +"         "+ players[0].score;
      leader2 = players[1].rank +"          "+ players[1].name +"         "+ players[1].score;
    }

    if(players[1].rank === 1){
      leader2 = players[1].rank +"          "+ players[1].name +"         "+ players[1].score;
      leader1 = players[0].rank +"          "+ players[0].name +"         "+ players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  handleResetButton(){
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        carsAtEnd: 0,
        playerCount: 0,
        gameState:0,
        players: {}
      });
      window.location.reload();
    });
  }

  addSprites(spriteGroup, numberOfSprites, spriteImage,escale){
    for(var i=0; i<numberOfSprites; i++){
      var x = random(width/2 +150, width/2-150);
      var y = random(-height*4.5, height -400);

      var newSprite = createSprite(x,y);
      newSprite.addImage("new", spriteImage);

      newSprite.scale = escale;
      spriteGroup.add(newSprite);
    }
  }

  addSpritesObs(spriteGroup, numberOfSprites, spriteImage,escale, positions = []){
    for(var i=0; i<numberOfSprites; i++){
      var x,y;

      if(positions.length > 0){
        x = positions[i].x;
        y = positions[i].y;
        spriteImage = positions[i].image;
      }else{
        var x = random(width/2 +150, width/2-150);
        var y = random(-height*4.5, height -400);
      }

      var newSprite = createSprite(x,y);
      newSprite.addImage("new", spriteImage);

      newSprite.scale = escale;
      spriteGroup.add(newSprite);
    }
  }

  handleFuel(index){
    cars[index-1].overlap(fuels, function(collector, collected){
      player.fuel = 185;
      collected.remove();
    })

  }

  handlePowerCoins(index){
    cars[index-1].overlap(powerCoins, function(collector, collected){
      player.score +=5;
      player.update();
      collected.remove();
    })
  }
  


}