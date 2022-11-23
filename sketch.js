var PLAY = 1
var END = 0;
var gameState = PLAY;

var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombie, zombieImg;
var edges;
var life =3;
var heart_1, heart_2, heart_3;
var lifeImg, lifeImg2, lifeImg3;
var bones, bonesImg;
var shot, shotImg;
var tumulo, tumuloImg;
var resetButtom, resetButtomImg;
var sonWin, sonLose;

function preload(){
  
  shooterImg = loadImage("./assets/shooter_2.png")
  shooter_shooting = loadImage("./assets/shooter_3.png")
  zombieImg = loadImage("./assets/zombie.png")
  lifeImg3 = loadImage("./assets/heart_3.png")
  lifeImg2 = loadImage("./assets/heart_2.png")
  lifeImg = loadImage("./assets/heart_1.png")
  bonesImg = loadImage("./assets/ghost.png")
  shotImg = loadImage("./assets/bullet.png")
  tumuloImg = loadImage("./assets/tumulo.png")
  resetButtomImg = loadImage ("./assets/restart.png")

  sonWin = loadSound ("./assets/win.mp3")
  sonLose = loadSound("./assets/lose.mp3")

  bgImg = loadImage("assets/bg.jpeg")

}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

  //adicione a imagem de fundo
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
bg.addImage(bgImg)
bg.scale = 1.1
  

//crie o sprite do jogador
player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
 player.addImage(shooterImg);
   player.scale = 0.3;
   player.debug = false;
   player.setCollider("rectangle",0,0,300,300);

//criar vida
 heart_3 = createSprite(width-1200, height-550, 15, 15);
 heart_3.addImage("3heart",lifeImg3);
 heart_3.scale = 0.50;

 heart_2 = createSprite(width-1200, height-550, 15, 15);
 heart_2.addImage("2heart",lifeImg2);
 heart_2.scale = 0.50;

 heart_1 = createSprite(width-1200, height-550, 15, 15);
 heart_1.addImage("1heart",lifeImg);
 heart_3.scale = 0.50;

//criar tumulo
 tumulo = createSprite(0, 0, 50, 50);
 tumulo.addImage("gameover", tumuloImg);
 tumulo.scale = 0.5;
 tumulo.x = player.x;
 tumulo.y = player.y;
 tumulo.visible = false;

// botão de restart
 resetButtom = createSprite(width-650, height-300, 50, 50);
 resetButtom.addImage("reset", resetButtomImg);
 resetButtom.scale = 1;
 resetButtom.visible = false;

  zombieGroup = new Group();
  bonesGroup = new Group();
  shotGroup = new Group();
}

function draw() {
  background(bgImg); 

  if (gameState === PLAY) {
    //mova o jogador para cima e para baixo e torne o jogo compatível com dispositivos móveis usando touches (toques)
if(keyDown("UP_ARROW")||touches.length>0){
  player.y = player.y-30
}
if(keyDown("DOWN_ARROW")||touches.length>0){
 player.y = player.y+30
}
if(keyDown("RIGHT_ARROW")||touches.length>0){
  player.x = player.x+30
 }
 if(keyDown("LEFT_ARROW")||touches.length>0){
  player.x = player.x-30
 }

//colisões
 edges = createEdgeSprites(); 
 player.collide(edges);
 zombieGroup.bounceOff(edges);
 bonesGroup.bounceOff(edges);

 shotGroup.overlap(zombieGroup, function (collector, collected) { 
    collected.remove();
    collector.remove();
    sonWin.play();
   });
 shotGroup.overlap(bonesGroup, function (collector, collected) { 
    collected.remove();
    collector.remove();
    sonWin.play();
   });


if (zombieGroup.isTouching(player) || bonesGroup.isTouching(player)) {
  life = life-1;
  player.x = player.x - 80;
  sonLose.play();
}
if (life === 3) {
  heart_3.visible = true;
  heart_2.visible = false;
  heart_1.visible = false;
}
if (life === 2) {
  heart_3.visible = false;
  heart_2.visible = true;
  heart_1.visible = false;
}
if (life === 1) {
  heart_3.visible = false;
  heart_2.visible = false;
  heart_1.visible = true;
}
//libere as balas e mude a imagem do atirador para a posição de tiro quando a tecla espaço for pressionada
if(keyWentDown("space")){
  player.addImage(shooter_shooting);
  spawShots();
}
//o jogador volta à imagem original quando pararmos de pressionar a tecla espaço
else if(keyWentUp("space")){
  player.addImage(shooterImg)
}

 spawZombieGroup();
 spawBonesGroup();

if (life === 0) {
  gameState = END;
}
}

if (gameState === END) {
  zombieGroup.destroyEach();
  zombieGroup.setVelocityXEach(0);
  zombieGroup.setLifetimeEach(-1);

  bonesGroup.destroyEach();
  bonesGroup.setVelocityXEach(0);
  bonesGroup.setLifetimeEach(-1);

  shotGroup.destroyEach();

  player.visible = false;
  heart_1.visible = false;
  heart_2.visible = false;
  heart_3.visible = false;
  tumulo.visible = true;
  resetButtom.visible = true;

  if (keyDown("space") || mousePressedOver(resetButtom)) {
    reset();
  }
}

drawSprites();

}

function spawZombieGroup() {
  if (frameCount % 75 === 0) {
    zombie = createSprite(width, random(300,600), 55, 55);
    zombie.addImage("villan", zombieImg);
    zombie.scale = 0.15;
    zombie.velocityX = -8;
    zombie.debug = false;
    zombie.setCollider("rectangle",0,0,550,900);
    zombie.lifetime = 1300;
    zombieGroup.add(zombie)
  } 
}
function spawBonesGroup() {
  if (frameCount % 65 === 0) {
    bones = createSprite(random(1200,1400), random(100,150), 15, 15);
    bones.addImage("attack", bonesImg);
    bones.scale = 1;
    bones.velocityX = -5;
    bones.velocityY = 5;
    bones.debug = false;
    bones.setCollider("rectangle",0,0,40,40);
    bones.lifetime = 1150;
    bonesGroup.add(bones);
  }
}
function spawShots() {
  if (keyWentDown("space")) {
    shot = createSprite(50, 50, 40, 10);
    shot.addImage("yourAttack", shotImg);
    shot.scale = 0.1;
    shot.velocityX = 6;
    shot.x = player.x;
    shot.y = player.y;
    shot.lifetime = 1200;
    shotGroup.add(shot);
  }
}
function reset() {
  gameState = PLAY;
  player.visible = true;
  heart_1.visible = false;
  heart_2.visible = false;
  heart_3.visible = true;
  tumulo.visible = false;
  resetButtom.visible = false;
  life = 3;
}