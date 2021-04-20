/***********************************************************************************
  Salada : Discrimination
  by Yik Hung

  Uses the p5.2DAdventure.js class 

  Virsion: 4/20/21
  
------------------------------------------------------------------------------------
	To use:
	Add this line to the index.html

  <script src="p5.2DAdventure.js"></script>
***********************************************************************************/

var images = [];

var content;

var talkedToWeirdNPC = false;

var NPCW = 100;
var NPCH = 100;

var NPC = [];

var gDebugMode = true;

var index = 0;

var ina = 0;
var groupIndex = 0;

var ImageIndex = 0;

var file = [];
var logo = [];

//For Room4 content (2 NPC)
var inaMen = 0;
var inaWomen = 0;
var groupIndexMen = 0;
var groupIndexWomen = 0;

//team array
var teamList = [];

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
  content = new Content_Man('data/Content.csv');
  adventureManager = new AdventureManager("data/adventureStates.csv", "data/interactionTable.csv");
  images[0] = loadImage('assets/team0.png');
  images[1] = loadImage('assets/team1.png');
  images[2] = loadImage('assets/team2.png');
  images[3] = loadImage('assets/team3.png');
  images[4] = loadImage('assets/team4.png');
  images[5] = loadImage('assets/team5.png');
  images[6] = loadImage('assets/team6.png');
  images[7] = loadImage('assets/team7.png');

  logo[0] = loadImage('assets/key1.png');
  logo[1] = loadImage('assets/key2.png');
  logo[2] = loadImage('assets/key3.png');
  logo[3] = loadImage('assets/key4.png');

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
  content.setup();

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
  image(images[ImageIndex],0, 0, 500, 50);

  if( adventureManager.getStateName() !== "Splash" && 
      adventureManager.getStateName() !== "Instructions" ) {
  // responds to keydowns
  	moveSprite();

  // this is a function of p5.js, not of this sketch
  	drawSprite(playerSprite);

    if (file[0]) image(logo[0], 40, 70);
    if (file[1]) image(logo[1], 40, 170);
    if (file[2]) image(logo[2], 40, 270);
    if (file[3]) image(logo[3], 40, 370);

 
  }
    if (playerSprite.position.x <= 0 || playerSprite.position.x >= width || 
     playerSprite.position.y <= 0 || playerSprite.position.y >= height) {
       groupIndex = 0;
       ina = 0;
       groupIndexMen = 0;
       groupIndexWomen = 0;
       inaMen = 0;
       inaWomen = 0;
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

//Just for set up, will call it again in each different class
clickableButtonPressed = function() {
}

//content function (also learn this from Jiaquan)
function drawtextbox(content) {
  push();
  fill(0);
  rect(0,height-200,width,200); //textbox
  fill(255);
  textAlign(CENTER);
  textSize(20);
  text(content,0,height-150, width, 200);
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
  	clickables[0].onPress = function temp(){
  		adventureManager.changeState("Room1");
  	}
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

		this.key = createSprite(338, 617);
		this.key.addImage(logo[0]);

    ina = 0;
    groupIndex = 0;
	}
	draw(){
		super.draw();
		drawSprite(this.NPC);
		drawSprite(this.key);
		playerSprite.overlap(this.NPC, this.talkable);
		playerSprite.overlap(this.key, this.collect);
		image(this.img[0], 1130, 0, 150, 150);
    if (file[0] == true) this.key.remove();
    if (ina == 6) this.NPC.remove();
	}
	talkable() {
		content.ChangeToState('Room1');
		let conversation = content.GroupContent(groupIndex);
		if (ina < conversation.length) {
			clickables[1].visible = true;
			drawtextbox(conversation[ina]);
			clickables[1].onPress = function temp() { 
        		ina++;
      		} 
		}
    if (ina == 6) {
      ImageIndex = 1;
    }
	}
	collect() {
    	file[0] = true;
  	}
}

class Room2Page extends PNGRoom {
	preload(){
		this.img = [];
		this.img[0] = loadImage('assets/map2.png');
		this.img[1] = loadImage('assets/npc2.png');
		this.NPC= createSprite(550, 302, NPCW, NPCH);
		this.NPC.addImage(this.img[1]);

    this.key = createSprite(330, 617);
    this.key.addImage(logo[1]);

		ina = 0;
		groupIndex = 0;
	}
	draw(){
		super.draw();
		drawSprite(this.NPC);
    drawSprite(this.key);
		playerSprite.overlap(this.NPC, this.talkable);
    playerSprite.overlap(this.key, this.collect);
		image(this.img[0], 1130, 0, 150, 150);
		if (file[1] == true) this.key.remove();
		if (ina == 12) this.NPC.remove();
	}
	talkable() {
		content.ChangeToState('Room2');
		let conversation = content.GroupContent(groupIndex);
    if (ina == 12) {
      ImageIndex = 2;
    }
		if (ina < conversation.length) {
			clickables[1].visible = true;
			drawtextbox(conversation[ina]);
			clickables[1].onPress = function temp() { 
        		ina++;
      		} 
		}
		else{
			clickables[2].visible = true;
			clickables[2].onPress = function temp(){
			}
			if (file[0] && file[1] && file[2] && file[3]){
        clickables[2].visible = false;
				clickables[3].visible = true;
				clickables[3].onPress = function temp(){
					groupIndex = 1;
					ina = 0;
				}
			}
		}
	}
  collect() {
      file[1] = true;
  }
}

class Room3Page extends PNGRoom {
	preload(){
		this.img = [];
		this.img[0] = loadImage('assets/map3.png');
		this.img[1] = loadImage('assets/npc5.png');
		this.NPC= createSprite(252, 348, NPCW, NPCH);
		this.NPC.addImage(this.img[1]);

    this.key = createSprite(1197, 306);
    this.key.addImage(logo[2]);

    ina = 0;
    groupIndex = 0;
	}
	draw(){
		super.draw();
		drawSprite(this.NPC);
    drawSprite(this.key);
    playerSprite.overlap(this.NPC, this.talkable);
    playerSprite.overlap(this.key, this.collect);
		image(this.img[0], 1130, 0, 150, 150);

    if (file[2] == true) this.key.remove();
    if (ina == 11) this.NPC.remove();
	}
  talkable(){
    content.ChangeToState('Room3');
    let conversation = content.GroupContent(groupIndex);
    if (ina == 11) {
      ImageIndex = 3;
    }
    if (ina < conversation.length) {
      clickables[1].visible = true;
      drawtextbox(conversation[ina]);
      clickables[1].onPress = function temp() { 
            ina++;
          } 
    }
    else{
      clickables[2].visible = true;
      clickables[2].onPress = function temp(){
      }
      if (file[0] && file[1] && file[2] && file[3]){
        clickables[2].visible = false;
        clickables[3].visible = true;
        clickables[3].onPress = function temp(){
          groupIndex = 1;
          ina = 0;
        }
      }
    }
  }
  collect() {
    file[2] = true;
  }
}

class Room4Page extends PNGRoom {
	preload(){
		this.img = [];
		this.img[0] = loadImage('assets/map4.png');
		this.img[1] = loadImage('assets/npc1.png');
		this.img[2] = loadImage('assets/npc3.png');

		this.NPC = [];
		this.NPC[0] = createSprite(58, 280, NPCW, NPCH);
		this.NPC[1] = createSprite(950, 506, NPCW, NPCH);
		this.NPC[0].addImage(this.img[1]);// Men
		this.NPC[1].addImage(this.img[2]);// Women

    inaMen = 0;
    inaWomen = 0;

    groupIndexMen = 0;
    groupIndexWomen = 0;
	}
	draw(){
		super.draw();
		drawSprite(this.NPC[0]);
		drawSprite(this.NPC[1]);
    playerSprite.overlap(this.NPC[0], this.talkableMen);
    playerSprite.overlap(this.NPC[1], this.talkableWomen);
		image(this.img[0], 1130, 0, 150, 150);
    if (inaMen == 10) this.NPC[0].remove();
    if (inaWomen == 10) this.NPC[1].remove();
	}
  talkableMen() {
    content.ChangeToState('Room4_M');
    let conversation = content.GroupContent(groupIndexMen);
    if (inaMen == 10) {
      ImageIndex = 4;
    }
    if (inaMen < conversation.length) {
      clickables[1].visible = true;
      drawtextbox(conversation[inaMen]);
      clickables[1].onPress = function temp() { 
            inaMen++;
          } 
    }
    else{
      clickables[2].visible = true;
      clickables[2].onPress = function temp(){
      }
      if (file[0] && file[1] && file[2] && file[3]){
        clickables[2].visible = false;
        clickables[3].visible = true;
        clickables[3].onPress = function temp(){
          inaMen = 0;
          groupIndexMen = 1;
        }
      }
    }
  }
  talkableWomen() {
    content.ChangeToState('Room4_W');
    let conversation = content.GroupContent(groupIndexWomen);
    if (inaWomen == 10) {
      ImageIndex = 5;
    }
    if (inaWomen < conversation.length) {
      clickables[1].visible = true;
      drawtextbox(conversation[inaWomen]);
      clickables[1].onPress = function temp() { 
            inaWomen++;
          } 
    }
    else{
      clickables[2].visible = true;
      clickables[2].onPress = function temp(){
      }
      if (file[0] && file[1] && file[2] && file[3]){
        clickables[2].visible = false;
        clickables[3].visible = true;
        clickables[3].onPress = function temp(){
          inaWomen = 0;
          groupIndexWomen = 1;
        }
      }
    }
  }
}

class Room5Page extends PNGRoom {
	preload(){
		this.img = [];
		this.img[0] = loadImage('assets/map5.png');
		this.img[1] = loadImage('assets/npc6.png');
		this.NPC = createSprite(950, 42, NPCW, NPCH);
		this.NPC.addImage(this.img[1]);

    ina = 0;
    groupIndex = 0;
	}
	draw(){
		super.draw();
		drawSprite(this.NPC);
    
		image(this.img[0], 1130, 0, 150, 150);
    playerSprite.overlap(this.NPC, this.talkable);
    if (ina == 10) this.NPC.remove();
	}
  talkable() {
    content.ChangeToState('Room5');
    let conversation = content.GroupContent(groupIndex);
    if (ina == 10) {
      ImageIndex = 6;
    }
    if (ina < conversation.length) {
      clickables[1].visible = true;
      drawtextbox(conversation[ina]);
      clickables[1].onPress = function temp() { 
            ina++;
          } 
    }
    else{
      clickables[2].visible = true;
      clickables[2].onPress = function temp(){
      }
      if (file[0] && file[1] && file[2] && file[3]){
        clickables[2].visible = false;
        clickables[3].visible = true;
        clickables[3].onPress = function temp(){
          groupIndex = 1;
          ina = 0;
        }
      }
    }
  }
}

class Room6Page extends PNGRoom {
	preload(){
		this.img = [];
		this.img[0] = loadImage('assets/map6.png');
		this.img[1] = loadImage('assets/npc4.png');

		this.NPC = createSprite(32, 570, NPCW, NPCH);
		this.NPC.addImage(this.img[1], ); 

    this.key = createSprite(116, 157);
    this.key.addImage(logo[3]);

    ina = 0;
    groupIndex = 0;
	}
	draw(){
		super.draw();
		drawSprite(this.NPC);
    drawSprite(this.key);
		image(this.img[0], 1130, 0, 150, 150);
    playerSprite.overlap(this.NPC, this.talkable);
    playerSprite.overlap(this.key, this.collect);
		if (file[3] == true) this.key.remove();
    if (ina == 10) this.NPC.remove();
	}
  talkable() {
    content.ChangeToState('Room6');
    let conversation = content.GroupContent(groupIndex);
    if (ina == 10) {
      ImageIndex = 7;
    }
    if (ina < conversation.length) {
      clickables[1].visible = true;
      drawtextbox(conversation[ina]);
      clickables[1].onPress = function temp() { 
            ina++;
          } 
    }
    else{
      clickables[2].visible = true;
      clickables[2].onPress = function temp(){
      }
      if (file[0] && file[1] && file[2] && file[3]){
        clickables[2].visible = false;
        clickables[3].visible = true;
        clickables[3].onPress = function temp(){
          groupIndex = 1;
          ina = 0;
        }
      }
    }
  }
  collect() {
    file[3] = true;
  }
}

class Room7Page extends PNGRoom {
	preload(){
		this.img = [];
		this.img[0] = loadImage('assets/map7.png');

		this.NPC = createSprite(980, height/3, 300, 300);
		this.NPC.addAnimation('regular', NPC[1]); 

    ina = 0;
    groupIndex = 0;  
	}
	draw(){
		super.draw();
		drawSprite(this.NPC);
		image(this.img[0], 1130, 0, 150, 150);
    playerSprite.overlap(this.NPC, this.talkable);
	}
  talkable() {
    content.ChangeToState('Room7');

    if (ImageIndex !== 7){
      let conversation = content.GroupContent(0);
      clickables[1].visible = true;
      drawtextbox(conversation[0]);
      clickables[1].onPress = function temp() {
        file[0] = false;
        file[1] = false;
        file[2] = false;
        file[3] = false;
        adventureManager.changeState("BadEnding");
      }
    }
    else{
      let conversation = content.GroupContent(1);
      clickables[1].visible = true;
      drawtextbox(conversation[0]);
      clickables[1].onPress = function temp() {
        file[0] = false;
        file[1] = false;
        file[2] = false;
        file[3] = false;
        adventureManager.changeState("GoodEnding");
      }
    }
  }
}
// I learn this class function from Jiaquan
class Content_Man {
  //Use csv file location as parameter.
  constructor(filename) {
    this.file = loadTable(filename,'csv','header');
    this.state = [];
    this.group = [];
  } 
  //set up the Content, with State name.
  setup() {
    let statetotal = 0;
    for (let i = 0; i < this.file.getRowCount(); i++) {
      let statename = this.file.getString(i, 'State');

      if (statename == '') return 'Not Valid State Name';
      else if (this.state.indexOf(statename) == -1) {
        this.state[statetotal] = statename;
        statetotal++;
      }
    }
  }
  //This will change to the state with the parameter "stateName", find the correct State in csv
  ChangeToState(stateName) {
    if (this.state.indexOf(stateName) == -1) return 'Not Valid State Name';
    else this.group = this.file.findRows(stateName,'State');
    return this.group;
  }
  //This will change to correct group with the parameter "groupID", find the correct Group in csv, return as array of content.
  GroupContent(groupID) {
    let content = [];
    for (let i = 0; i < this.group.length; i++) {
      if (this.group[i].getNum('Group') == groupID) {
        content[this.group[i].getNum('Index')] = this.group[i].getString('Content');
      }
    }
    return content;
  }
  //Not useful
  getAllStateName() {
    return this.state;
  }
  //Not useful
  getS() {
    return this.group;
  }
}