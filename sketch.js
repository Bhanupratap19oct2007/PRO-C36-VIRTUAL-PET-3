var database;
var gameState;
var dog, happyDog, foodS, foodStock, fedTime, lastFed, foodObj, feedDog;
var bedRoom,garden,washRoom,bedRoomImg,gardenImg,washRoomImg;

function preload() {
	dogImage = loadImage("images/Dog.png");
  happyDog = loadImage("images/happydog.png");
  //bedRoomImg = loadImage("images/petImg/bedRoom.png");
  //gardenImg = loadImage("images/petImg/Garden.png");
  //washRoomImg = loadImage("images/petImg/washRoom.png");
  //sadDog = loadImage("images/petImg/sadDog.png")
}

function setup() {
	createCanvas(500, 500);
  
  dog = createSprite(400,200);
  dog.addImage(dogImage);
  dog.scale = 0.2;
  
  database = firebase.database();

  foodStock = database.ref('Food');
  foodStock.on("value", readstock);

  foodObj = new Food();

  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add food");
  addFood.position(800,95);
  addFood.mousePressed(addFood);

  //read game state from database
  readState = database.ref('gameState');
  readState.on("value",function(data) {
    gameState = data.val();
  })
}

function draw() {
  background(46,139,87);

  fedTime = database.ref('feedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  });

  if(gameState != "hungry") {
    feed.hide();
    addFood.hide();
    dog.remove();
  } else {
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }

  currentTime = hour();
  if(currentTime == (lastFed+1)) {
    update("playing");
    foodObj.garden();
  } else if(currentTime == (lastFed+2)) {
    update("sleeping");
    foodObj.bedRoom();
  } else if(currentTime>(lastFed+2) && currentTime<= (lastFed+4)) {
    update("bathing");
    foodObj.washRoom();
  } else {
    update("hungry");
    foodObj.display();
  }
  drawSprites();
}

//functions to update gamestates in database
function update(state) {
  database.ref('/').update({
    gameState : state
  });
}

function addFood() {
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function feedDog() {
  dog.addImage("happyDog", happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);

  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function readstock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function readPosition(data) {
  position = data.val();
  foodobj.updateFoodStock(position);
}

function writePosition(pos) {
  if(pos > 0) {
    pos = pos-1;
  } else {
    pos=0;
  }
  database.ref('/').set ({
    'Food': pos
  })
}