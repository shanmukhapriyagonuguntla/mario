var man, manimg, man_front, man_jump;

var cloudsGroup, cloudimg, cloud;
var treesGroup, tree1, tree2, tree;
var hillsGroup, hill1, hill2, hill;

var bricks, brick, b1, b2, b3;
var coinimg, coint, coins;
var breakb;

var ground, groundimg, edges, ensg;

var first, first_img;
var start, stratimg;
var gameover, restart, gameoverimg, restartimg;

var jumpSound;
var score, dist;
var gcollide, d;
var lives;

var enemies, enemy, ene1, ene2, ens;

var gamestate = 1;
var SERVE=1;
var PLAY=2;
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
    b1 = loadImage("b2.png");
    b2 = loadImage("b3.png");
    b3 = loadImage("b4.png");
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
    //first.visible = false

    start = createSprite(340,280,20,20)
    start.addImage(startimg)
    start.scale=0.58
    //start.visible=false

    gameover = createSprite(340,300,20,20)
    gameover.addImage(gameoverimg)
    gameover.scale=0.5
    gameover.visible=false

    restart = createSprite(340,280,20,20)
    restart.addImage(restartimg)
    restart.scale=0.5
    restart.visible=false

    gcollide = createSprite(350,325,700,20)
    gcollide.shapeColor = "red"
    gcollide.visible=false

    man.debug = true
   // man.setCollider("circle", 0, 0, 40)
   man.setCollider("rectangle",0,0,30,30);

    //ground = createSprite(230,320,400,10)
    ground = createSprite(350,320,400,10)
    ground.addImage(groundimg)
    //ground.x=ground.width/2
    //ground.velocityX = -4
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
    ensg = createGroup();
    
}

function draw(){
    background(rgb(115, 161, 235))

    fill("black")
    text("Score: "+score,530,20)
    text("Distance: "+dist,600,20)
    text("Lives: "+lives,460,20)
    man.changeAnimation("running_right",manimgr)

    edges = createEdgeSprites();
    man.collide(edges)

    if (gamestate===SERVE){
        first.visible=true
        start.visible=true
        man.collide(gcollide)
        if (keyWentDown("s")){
            gamestate=PLAY
            console.log(gamestate)
        }
        man.changeAnimation("man_neutral",man_front)
    }

    //first.depth=man.depth

    man.collide(gcollide)
    first.depth=man.depth
    man.depth=man.depth+1
    

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

        // distance
        d = d + Math.round(frameCount/60);
        dist = dist + Math.round(frameCount/60);

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

        if (enemies.isTouching(man)){
            gamestate=SERVE;
            lives=lives-1
            console.log("man dead")
        }

        if (coins.isTouching(man)){
            coins.destroyEach()
            score=score+10
            coint.play()
        }

        if (lives===0){
            gamestate=END
        }
        if (gamestate===END){
            first.visible=true
            start.visible=false
            gameover.visible=true
            restart.visible=true
            console.log("end state")
            man.changeAnimation("man_neutral",man_front)
        }

        if (ensg.isTouching(man)){
            enemy.changeAnimation("enemy dead",ene2)
            console.log("enemy dead")
            man.collide(ens)
            ens.destroy()
        }

        ground.depth = man.depth
        man.depth=man.depth+1
    
        spawntrees();
    
        //spawnhills();
    
        createbricks();
    
        createenemeis();
    
        spawnClouds();
    
        createcoin();
    }


    
  

    drawSprites()
}

function createenemeis(){
    if (frameCount % 300 === 0){
        enemy = createSprite(690,320,20,20);
        enemy.addAnimation("enemy_running",ene1)
        enemy.addAnimation("enemy dead",ene2)
        enemy.scale=0.12
        //enemy.lifetime=100
        enemy.velocityX=-3

        ens = createSprite(enemy.x,enemy.y-10,80,5)
        ens.velocityX=-3


        enemy.depth = man.depth
        man.depth = man.depth +1

        ensg.add(ens)
        enemies.add(enemy);
    }
}

function createbricks(){
    if (frameCount % 150 === 0){
        brick = createSprite(random(180,380),random(180,280),50, 20);
        //brick.shapeColor = "red";
        brick.addImage(b3)
        brick.scale = 0.2
        brick.lifetime = 300


        brick.depth=man.depth
        man.depth=man.depth+1

        bricks.add(brick);
        console.log("bricks created")
        
    }
}

function createcoin(){
    if (frameCount % 100 === 0){
        var coin = createSprite(690,310,20,20)
        coin.addImage(coinimg)
        coin.scale = 0.25
        coin.lifetime = 300
        coin.velocityX=-2

        var coin2 = createSprite(690+30,310,20,20)
        coin2.addImage(coinimg)
        coin2.scale = 0.25
        coin2.lifetime = 300
        coin2.velocityX=-2

        var coin3 = createSprite(690+60,310,20,20)
        coin3.addImage(coinimg)
        coin3.scale = 0.25
        coin3.lifetime = 300
        coin3.velocityX=-2  

        coin3.depth=man.depth
        man.depth=man.depth+1

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

       tree.depth = man.depth
       man.depth = man.depth+1
      //add each obstacle to the group
       treesGroup.add(tree);
    }
}

function spawnhills(){
    if (frameCount % 160 === 0){
        hill = createSprite(500,230,20,20);
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

        hill.depth = man.depth
        man.depth = man.depth+1

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
      cloud.depth = man.depth
      man.depth = man.depth+1
      
      //add each cloud to the group
      cloudsGroup.add(cloud);
    }
  }
