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

var talkedToWeirdNPC = false;

var NPCW = 100;
var NPCH = 100;

var NPC = [];

var gDebugMode = true;


// collect NPCs
var NPC1Int = false;
var NPC2Int = false;
var NPC3Int = false;
var NPC4Int = false;
var NPC5Int = false;
var NPC6Int = false;
var NPC7Int = false;


// adventure manager global  
var adventureManager;
var clickablesManager;
var clickables;
var playerSprite;
var playerAnimation;
var NPCSprite;

// Allocate Adventure Manager with states table and interaction tables
function preload() {
  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  adventureManager = new AdventureManager("data/adventureStates.csv", "data/interactionTable.csv");
  images[0] = loadImage('assets/team0.png');
  images[1] = loadImage('assets/team1.png');
  images[2] = loadImage('assets/team2.png');
  images[3] = loadImage('assets/team3.png');
  images[4] = loadImage('assets/team4.png');
  images[5] = loadImage('assets/team5.png');
  images[6] = loadImage('assets/team6.png');
  images[7] = loadImage('assets/team7.png');

  NPC[1] = loadAnimation('assets/monster1.png','assets/monster4.png');
}


// Setup the adventure manager
function setup() {
  createCanvas(1280, 720);

  clickables = clickablesManager.setup();

  // This will load the images, go through state and interation tables, etc
  adventureManager.setup();

    // create a sprite and add the 3 animations
  playerSprite = createSprite(width/2, height/2, 100, 100);
  playerSprite.addAnimation('regular', loadAnimation('assets/m1.png', 'assets/m9.png'));

  // use this to track movement from toom to room in adventureManager.draw()
  adventureManager.setPlayerSprite(playerSprite);
  adventureManager.setClickableManager(clickablesManager);
  setupClickables(); 
  
  textSize(24);
  textAlign(LEFT);
}


// Adventure manager handles it all!
function draw() {
  // draws background rooms and handles movement from one to another
  adventureManager.draw();
  clickablesManager.draw();

  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].visible = false;
  }

  if( gDebugMode == true ) {
    drawDebugInfo();
  }
  // team list
  image(images[0], 0, 0, 500, 50);


  if( adventureManager.getStateName() !== "Splash" && 
      adventureManager.getStateName() !== "Instructions" ) {
  // responds to keydowns
  	moveSprite();

  // this is a function of p5.js, not of this sketch
  	drawSprite(playerSprite);
  }
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


function mouseReleased() {
  adventureManager.mouseReleased();
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
function drawDebugInfo() {
  fill(255);
  text("X: " + mouseX + "   Y: " + mouseY, 20, height - 20);
}

// keyTyped gets triggered whenever key is down
function keyTyped() {
  if (key === ' ') {
    gDebugMode = !gDebugMode;
  }
}


function setupClickables() {
  // All clickables to have same effects
  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].onHover = clickableButtonHover;
    clickables[i].onOutside = clickableButtonOnOutside;
    clickables[i].onPress = clickableButtonPressed;
  }
}

// tint when mouse is over
clickableButtonHover = function () {
  this.color = "#AA33AA";
  this.noTint = false;
  this.tint = "#FF0000";
}

// color a light gray if off
clickableButtonOnOutside = function () {
  // backto our gray color
  this.color = "#AAAAAA";
}


clickableButtonPressed = function() {
	if(adventureManager.getStateName() == "Instructions"){
		adventureManager.changeState("Room1");
	}


}

//content function
function drawtextbox(content) {
  push();
  fill(0);
  rect(0,height-200,width,200); //textbox

  fill(255);
  textAlign(CENTER);
  textSize(20);
  text(content,0,height-100, width, 200);
  pop();
}


class InstructionsScreen extends PNGRoom {
  // preload is where we define OUR variables
  preload() {
    // These are out variables in the InstructionsScreen class
    this.textBoxWidth = (width/6)*4;
    this.textBoxHeight = (height/6)*4; 

    // hard-coded, but this could be loaded from a file if we wanted to be more elegant
    this.instructionsText = "Welcome to Salada！You are the protector of social justice, Rey. You have been summoned from the world of Salada. An evil force has appeared here. Your task is to find and destroy the evil force. You will use the arrow keys to move, and try to approach and interact with the residents of Salada, find the clue. Good luck！";
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {

  	clickables[0].visible = true;

    // tint down background image so text is more readable
    tint(128);
      
    // this calls PNGRoom.draw()
    super.draw();
      
    // text draw settings
    fill(255);
    textAlign(CENTER);
    textSize(30);

    // Draw text in a box
    text(this.instructionsText, width/6, height/6, this.textBoxWidth, this.textBoxHeight );
  }
}



class Room1Page extends PNGRoom {
	preload(){
		this.img = [];
		this.img[0] = loadImage('assets/map1.png');
		this.img[1] = loadImage('assets/npc7.png');
		this.NPC= createSprite(590, 145, NPCW, NPCH);
		this.NPC.addImage(this.img[1]);
	}

	draw(){
		super.draw();
		drawSprite(this.NPC);
		image(this.img[0], 1130, 0, 150, 150);
		//image(this.img[1], 590, 145, NPCW, NPCH);
	}
}



class Room2Page extends PNGRoom {
	preload(){
		this.img = [];
		this.img[0] = loadImage('assets/map2.png');
		this.img[1] = loadImage('assets/npc2.png');
		this.NPC= createSprite(550, 302, NPCW, NPCH);
		this.NPC.addImage(this.img[1]);
	}

	draw(){
		super.draw();
		drawSprite(this.NPC);
		image(this.img[0], 1130, 0, 150, 150);
		//image(this.img[1], 550, 302, NPCW, NPCH);
	}
}





class Room3Page extends PNGRoom {
	preload(){
		this.img = [];
		this.img[0] = loadImage('assets/map3.png');
		this.img[1] = loadImage('assets/npc5.png');
		this.NPC= createSprite(252, 348, NPCW, NPCH);
		this.NPC.addImage(this.img[1]);
	}

	draw(){
		super.draw();
		drawSprite(this.NPC);
		image(this.img[0], 1130, 0, 150, 150);
		//image(this.img[1], 252, 348, NPCW, NPCH);
	}
}




class Room4Page extends PNGRoom {
	preload(){
		this.img = [];
		this.img[0] = loadImage('assets/map4.png');
		this.img[1] = loadImage('assets/npc1.png');
		this.img[2] = loadImage('assets/npc3.png');

		this.NPC = [];
		this.NPC[0]= createSprite(58, 280, NPCW, NPCH);
		this.NPC[1]= createSprite(950, 506, NPCW, NPCH);
		this.NPC[0].addImage(this.img[1]);
		this.NPC[1].addImage(this.img[2]);
	}

	draw(){
		super.draw();
		drawSprite(this.NPC[0]);
		drawSprite(this.NPC[1]);
		image(this.img[0], 1130, 0, 150, 150);
		//image(this.img[1], 58, 280, NPCW, NPCH);
		//image(this.img[2], 950, 506, NPCW, NPCH);
	}
}




class Room5Page extends PNGRoom {
	preload(){
		this.img = [];
		this.img[0] = loadImage('assets/map5.png');
		this.img[1] = loadImage('assets/npc6.png');
		this.NPC = createSprite(950, 42, NPCW, NPCH);
		this.NPC.addImage(this.img[1]);
	}

	draw(){
		super.draw();
		drawSprite(this.NPC);
		image(this.img[0], 1130, 0, 150, 150);
		//image(this.img[1], 950, 42, NPCW, NPCH);
	}
}




class Room6Page extends PNGRoom {
	preload(){
		this.img = [];
		this.img[0] = loadImage('assets/map6.png');
		this.img[1] = loadImage('assets/npc4.png');

		this.NPC = createSprite(32, 570, NPCW, NPCH);
		this.NPC.addImage(this.img[1]); 
	}

	draw(){
		super.draw();
		drawSprite(this.NPC);
		image(this.img[0], 1130, 0, 150, 150);
		//image(this.img[1], 32, 570, NPCW, NPCH);
	}
}






class Room7Page extends PNGRoom {
	preload(){
		this.img = [];
		this.img[0] = loadImage('assets/map7.png');

		this.NPC = createSprite(980, height/3, 300, 300);
		this.NPC.addAnimation('regular', NPC[1]);   
	}

	draw(){
		super.draw();
		drawSprite(this.NPC);
		image(this.img[0], 1130, 0, 150, 150);
	}
}