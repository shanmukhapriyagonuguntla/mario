var man, manimg, man_front, man_jump;

var cloudsGroup, cloudimg, cloud;
var treesGroup, tree1, tree2, tree;
var hillsGroup, hill1, hill2, hill;

var bricks, brick, b1, b2, b3;
var coinimg, coint, coins, coin, coin2, coin3;

var ground, groundimg;

var first, first_img;
var start, stratimg;
var gameover, restart, gameoverimg, restartimg;

var jumpSound;
var score, dist;
var gcollide, d;
var lives;

var enemies, enemy, ene1, ene2;

var gamestate = SERVE;
var SERVE;
var PLAY=1;
var END=0;

function preload(){
    man_front = loadImage("stand.png")
    manimgl = loadAnimation("run1.png","run2.png")
    manimgr = loadAnimation("run1ro.png","run2ro.png")
    man_jump = loadAnimation("run1ro.png")

    // loading cloud images
    cloudimg = loadImage("cloud2.png");

    // loading hills images
    hill1 = loadImage("hill1.png");
    hill2 = loadImage("hill2.png");

    // loading first serve state images
    first_img = loadImage("start-screen.png");
    startimg = loadImage("start-btn.png");
    gameoverimg=loadImage("gameOver.png");
    restartimg = loadImage("restart.png");

    // loading trees images
    tree1 = loadImage("tree1.png");
    tree2 = loadImage("tree21.png");

    // loading bricks images
    b1 = loadImage("b2.png")
    b2 = loadImage("b3.png")
    b3 = loadImage("b4.png")
    //breakbimg = loadImage("b2.png")

    // loading enemies images
    ene1 = loadAnimation("ene1.png","ene2.png")
    ene2 = loadAnimation("ene3.png")

    // coin image
    coinimg  = loadImage("coin.png")

    // loading ground image
    groundimg = loadImage("ground.png")

    // loading jump sound
    jumpSound = loadSound("jump.mp3")

    // loading coin and obstacle touch souns
    coint = loadSound("collect_coin.mp3")

}

function setup(){
    createCanvas(700, 400)

    // create man
    man = createSprite(50, 310, 20, 20)
    man.addAnimation("man_neutral",man_front)
    man.addAnimation("running_left", manimgl)
    man.addAnimation("running_right",manimgr)
    man.addAnimation("jump", man_jump)
    man.scale = 0.2

    first = createSprite(350,200,20,20)
    first.addImage(first_img)
    first.scale = 0.58

    start = createSprite(340,280,20,20)
    start.addImage(startimg)
    start.scale=0.58

    gameover = createSprite(340,300,20,20)
    gameover.addImage(gameoverimg)
    gameover.scale=0.5

    restart = createSprite(340,280,20,20)
    restart.addImage(restartimg)
    restart.scale=0.5

    gcollide = createSprite(350,325,700,20)
    gcollide.shapeColor = "red"
    gcollide.visible=false

    man.debug = true
   // man.setCollider("circle", 0, 0, 40)
   man.setCollider("rectangle",0,0,30,30);

    ground = createSprite(350,320,400,10)
    ground.addImage(groundimg)
    ground.scale = 0.56

    score = 0;
    dist = 0;
    d = 0;
    lives=3;

    cloudsGroup = createGroup();
    treesGroup = createGroup();
    hillsGroup = createGroup();
    bricks = createGroup();
    coins = createGroup();
    enemies = createGroup();
    
}

function draw(){
    background(rgb(115, 161, 235))

    fill("black")
    text("Score: "+score,530,20)
    text("Distance: "+dist,600,20)
    text("Lives: "+lives,460,20)
    man.changeAnimation("man_neutral",man_front)

    gameover.visible=false
        restart.visible=false

    first.depth=man.depth+2

    man.collide(gcollide)

    if (keyWentDown("s")){
        gamestate=PLAY
        console.log(gamestate)
    }
    

    // adding gravity to it
    man.velocityY = man.velocityY + 0.8

    if (gamestate==PLAY){
        first.visible=false
        start.visible=false
        gameover.visible=false
        restart.visible=false

        // brick touches man
        if (bricks.isTouching(man)){
            man.collide(brick)
            console.log("collided")
        }

        // coins touches man
        if (coins.isTouching(man)){
            coint.play()
            score=score+10
            //coins.destroyEach()
        }

        // distance
        d = d + Math.round(frameCount/60);

        if (man.y >= 0){
            man.velocityY+=0.8
            console.log("less than 0")
        }

        // infinite ground
        if (ground.x < 0){
            //ground.x=360
            ground.x = ground.width/2;
        }

        // right arrow pressed
        if (keyDown("RIGHT_ARROW")){
            console.log("right")
            man.x=man.x+5
            dist = dist + Math.round(frameCount/60);
            man.changeAnimation("running_right", manimgr)
            //ground.velocityX=-4
            // calling functions
            spawntrees();

            spawnhills();

            createbricks();

            createcoin();

            createenemeis();

            //spawncoins();

            spawnClouds();
            }

        // left arrow pressed
        if (keyDown("LEFT_ARROW")){
            console.log("left")
            man.x=man.x-5
            man.changeAnimation("running_left", manimgl)
        }

        if (keyDown("UP_ARROW")){
            gamestate=PLAY
            first.visible=false
            start.visible=false
            score=0;
            dist=0;
            d=0;
        }
        
        // when space key pressed man will be jump
        if(keyDown("space")&& man.y >= 100) {
            man.velocityY = -12;
            jumpSound.play();
            man.changeAnimation("jump",man_jump)
        }
    }


    if (lives==0){
        gamestate=END
    }
    if (gamestate===END){
        first.visible=true
        start.visible=false
        gameover.visible=true
        restart.visible=true
        console.log("end state")
    }

    

    drawSprites()
}

/*function spawncoins(y){
    for(let a=0; a<3; a++){
        var coin = createSprite(35+31*a,y,20,15);
        coin.shapeColor = "green"
        coin.scale = 0.1
    }
}*/

function createenemeis(){
    if (frameCount % 400 === 0){
        enemy = createSprite(690,320,20,20);
        enemy.addAnimation("enemy_running",ene1)
        enemy.scale=0.12
        //enemy.lifetime=100
        enemy.velocityX=-3

        enemies.add(enemy);
    }
    if (enemies.isTouching(man)){
        console.log("end game over")
        gamestate=SERVE;
        first.visible=true
        start.visible=true
        lives=lives-1
    }
}

function createbricks(){
    if (frameCount % 200 === 0){
        brick = createSprite(random(180,380),random(180,280),50, 20);
        //brick.shapeColor = "red";
        brick.addImage(b3)
        brick.scale = 0.2
        brick.lifetime = 300

        bricks.add(brick);
        
    }
}

function createcoin(){
    if (frameCount % 200 === 0){
        coin = createSprite(brick.x-30,brick.y-30,20,20)
        coin.addImage(coinimg)
        coin.scale = 0.25
        coin.lifetime = 300

        coin2 = createSprite(coin.x+30,brick.y-30,20,20)
        coin2.addImage(coinimg)
        coin2.scale = 0.25
        coin2.lifetime = 300

        coin3 = createSprite(coin2.x+30,brick.y-30,20,20)
        coin3.addImage(coinimg)
        coin3.scale = 0.25
        coin3.lifetime = 300

        coins.add(coin);
        coins.add(coin2);
        coins.add(coin3);
    }
}

function spawntrees(){
    if (frameCount % 100 === 0){
       tree = createSprite(600,270,10,40);
       //assign scale and lifetime to the obstacle           
       tree.scale = 0.15;
       tree.lifetime = 300;
       tree.velocityX = -5;

       var rand = Math.round(random(1,2))
       switch (rand){
           case 1: tree.addImage(tree1);
                   break;
           case 2: tree.addImage(tree2);
                   break;
           default: break;
       }
       man.depth = tree.depth+2
       ground.depth = tree.depth+1
      
      //add each obstacle to the group
       treesGroup.add(tree);
    }
}

function spawnhills(){
    if (frameCount % 160 === 0){
        hill = createSprite(700,250);
        hill.scale = 0.35;
        hill.lifetime = 400
        hill.velocityX =-2

        var rand = Math.round(random(1,2))
        switch (rand){
            case 1: hill.addImage(hill1);
                    break;
            case 2: hill.addImage(hill1);
                    break;
            default: break;
        }
        //man.depth = hill.depth+2
        //tree.depth = hill.depth+2
        //ground.depth = hill.depth+2
        //cloud.depth = hill.depth+2
        //brick.depth = hill.depth+2
        //breakb.depth = hill.depth+2

        hillsGroup.add(hill)
    }
    
}

function spawnClouds() {
    //write code here to spawn the clouds
   if (frameCount % 50 === 0) {
      cloud = createSprite(600,120,40,10);
      cloud.y = Math.round(random(40,120));
      cloud.addImage(cloudimg);
      cloud.scale = 0.05;
      cloud.velocityX = -3;
      
       //assign lifetime to the variable
      cloud.lifetime = 200;
      
      //adjust the depth
      cloud.depth = man.depth;
      man.depth = man.depth + 1;
      
      //add each cloud to the group
      cloudsGroup.add(cloud);
    }
  }