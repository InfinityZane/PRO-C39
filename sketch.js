var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstacle, obstaclesGroup, obstacle1;

var score;

var you_are_a_faliure, tryAgain;

var jumpSound;

function preload(){
  trex_running = loadAnimation("Crewmate_Running_1.png","Crewmate_Running_2.png","Crewmate_Running_3.png", "Crewmate_Running_4.png");
  trex_collided = loadAnimation("Crewmate_Dead.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("Imposter.png");
  
  you_are_a_faliure_image = loadImage("gameOver.png");
  tryAgain_image = loadImage("restart.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
  
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  you_are_a_faliure = createSprite(280,60,5,5);
  you_are_a_faliure.addImage("gameOver", you_are_a_faliure_image);
  you_are_a_faliure.scale = 0.4;
  
  
  tryAgain = createSprite(280,100,5,5);
  tryAgain.addImage("restart", tryAgain_image);
  tryAgain.scale = 0.4;
     
  you_are_a_faliure.visible = false;
  tryAgain.visible = false;
  
  trex.setCollider("circle",0,0,40);
  
  
  score = 0
}

function draw() {
  background(180);
  //displaying score
  text("Score: "+ score, 500,50);
  
  console.log("this is ",gameState)
  
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(6+score/2000);
    
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
      camera.position.x = ground.x;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >=161) {
        trex.velocityY = -11;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(score % 100 === 0 && score>0){
    checkPointSound.play();
    //ground.velocityX=ground.velocityX-5;
    //obstacle.velocityX=obstacle.velocityX-5;
      
  
  }
  
  
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play();
    }
  }
   else if (gameState === END) {
      ground.velocityX = 0;
     trex.velocityY=0;
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);
     
     trex.changeAnimation("collided" , trex_collided);
     
  you_are_a_faliure.visible = true;
  tryAgain.visible = true;
     
   }
  
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  if(mousePressedOver(tryAgain)){
    reset();
  }
  
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   obstacle = createSprite(400,165,10,40);
   obstacle.velocityX = -(8+score/2000);
   obstacle.addImage(obstacle1);
   
    //generate random obstacles
    //var rand = Math.round(random(1,6));
    //switch(rand) {
      //case 1: 
              //break;
      //default: break;
    //}
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
   
   obstacle.setCollider("rectangle",0,0,60,50);
   obstacle.debug=true;
   
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

function reset(){
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  gameState = PLAY;
  
  you_are_a_faliure.visible = false;
  tryAgain.visible = false;
  
  trex.changeAnimation("running", trex_running);
  
  score = 0;
   
  
  
}