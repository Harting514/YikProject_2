/***********************************************************************************
  Simple
  by Scott Kildall

  Uses the p5.2DAdventure.js class 

  To do:
  ** cleanup p5.2DAdventure.js class + document it
  ** add mouse events, other interactions
  ** finish MazeMapper
  
------------------------------------------------------------------------------------
	To use:
	Add this line to the index.html

  <script src="p5.2DAdventure.js"></script>
***********************************************************************************/

var images = [];

// adventure manager global  
var adventureManager;

// p5.plau
var playerSprite;
var playerAnimation;

// Allocate Adventure Manager with states table and interaction tables
function preload() {
  adventureManager = new AdventureManager("data/adventureStates.csv", "data/interactionTable.csv");
  images[0] = loadImage('assets/team.png');
  images[1] = loadImage('assets/map1.png');
  images[2] = loadImage('assets/map2.png');
  images[3] = loadImage('assets/map3.png');
  images[4] = loadImage('assets/map4.png');
  images[5] = loadImage('assets/map5.png');
  images[6] = loadImage('assets/map6.png');
  images[7] = loadImage('assets/map7.png');
  images[8] = loadImage('assets/monster.png');

}

// Setup the adventure manager
function setup() {
  createCanvas(1280, 720);

  // This will load the images, go through state and interation tables, etc
  adventureManager.setup();

    // create a sprite and add the 3 animations
  playerSprite = createSprite(width/2, height/2, 100, 100);
  playerSprite.addAnimation('regular', 'assets/m1.png', 'assets/m9.png');

  // use this to track movement from toom to room in adventureManager.draw()
  adventureManager.setPlayerSprite(playerSprite);
}

// Adventure manager handles it all!
function draw() {
  // draws background rooms and handles movement from one to another
  adventureManager.draw();

  image(images[0], 0, 0, 500, 50);

  if ( adventureManager.getStateName() == "Room1"){
  	image(images[1], 1130, 0, 150, 150);
  }

  else if ( adventureManager.getStateName() == "Room2"){
  	image(images[2], 1130, 0, 150, 150);
  }

  else if ( adventureManager.getStateName() == "Room3"){
  	image(images[3], 1130, 0, 150, 150);
  }

  else if ( adventureManager.getStateName() == "Room4"){
  	image(images[4], 1130, 0, 150, 150);
  }
  
  else if ( adventureManager.getStateName() == "Room5"){
  	image(images[5], 1130, 0, 150, 150);
  }

  else if ( adventureManager.getStateName() == "Room6"){
  	image(images[6], 1130, 0, 150, 150);
  }

  else if ( adventureManager.getStateName() == "Room7"){
  	image(images[7], 1130, 0, 150, 150);
  	image(images[8], 980, 240, 300, 300);
  }

  // responds to keydowns
  moveSprite();

  // this is a function of p5.js, not of this sketch
  drawSprites();
}

// pass to adventure manager, this do the draw / undraw events
function keyPressed() {
  // toggle fullscreen mode
  if( key === 'f') {
    fs = fullscreen();
    fullscreen(!fs);
  }

  // dispatch key events for adventure manager to move from state to 
  // state or do special actions - this can be disabled for NPC conversations
  // or text entry
  adventureManager.keyPressed(key);  
}

//-------------- YOUR SPRITE MOVEMENT CODE HERE  ---------------//
function moveSprite() {
  if(keyIsDown(RIGHT_ARROW))
    playerSprite.velocity.x = 10;
  else if(keyIsDown(LEFT_ARROW))
    playerSprite.velocity.x = -10;
  else
    playerSprite.velocity.x = 0;

  if(keyIsDown(DOWN_ARROW))
    playerSprite.velocity.y = 10;
  else if(keyIsDown(UP_ARROW))
    playerSprite.velocity.y = -10;
  else
    playerSprite.velocity.y = 0;
}


//-------------- SUBCLASSES / YOUR DRAW CODE CAN GO HERE ---------------//
