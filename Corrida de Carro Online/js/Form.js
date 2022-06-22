class Form {
  constructor() {
    this.input = createInput("").attribute("placeholder", "Digite seu nome");
    this.playButton = createButton("Jogar");
    this.titleImg = createImg("./assets/TITULO.png", "nome do jogo");
    this.greeting = createElement("h2");
  }

  hide() {
    this.greeting.hide();
    this.playButton.hide();
    this.input.hide();
  }

  setElementsPosition(){

    this.input.position(width/2 - 250, height/2 -80);
    this.playButton.position(width/2 - 190, height/2 + 50);
    this.titleImg.position(300,160);
    this.greeting.position(width/2 - 300, height/2 - 100);

    this.titleImg.size(3000,500);
    this.input.size(500,100);
    this.playButton.size(400,70);
  }

  setElementsStyle(){

    this.input.class("customInput");
    this.playButton.class("customButton");
    this.titleImg.class("gameTitle");
    this.greeting.class("greeting");

  }


  handleMousePressed(){

    this.playButton.mousePressed(() => {
      this.input.hide();
      this.playButton.hide();

      var message = `Olá ${this.input.value()} 
      </br> espere o outro jogador entrar...`;

      this.greeting.html(message);

      playerCount +=1;
      player.name = this.input.value();
      player.index = playerCount;
      player.addPlayer();
      player.updateCount(playerCount);
      player.getDistance();

    });

  }

  display(){
    this.setElementsPosition();
    this.setElementsStyle();
    this.handleMousePressed();
  }

}