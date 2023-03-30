class Kirby extends Phaser.Physics.Arcade.Sprite{
    
    constructor(scene, positionX, positionY){
        super(scene, positionX, positionY, "kirbyIdle"); 
        this.setOrigin(0.5);
        this.transformations = {
            NORMAL: 0,
            FIRE: 1,
            BEAM: 2,
            SPARK: 3
        }
        
        this.enemies = {
            NONE: 0,
            BEAM: 1,
            SPARK: 2,
            OTHER: 3,
            FIRE: 4
        }
        
        this.states = {
            NONE: 0,
            WALK: 1,
            RUN: 2,
            JUMP: 3,
            TAKE_AIR: 4,
            FLY: 5,
            IDLE: 6,
            THROW_AIR: 7,
            HURT: 8,
            ATTACK: 9,
            TRANSFORM: 10,
            SWIM: 11
        }  
        
        this.state = this.states.IDLE;
        this.transformation = config.transformation;
        this.inMouth = this.enemies.NONE;
        
        // Init particles
        this.particles = [];
        this.particles.push(scene.physics.add.sprite(-10,-10,"beamKirbyParticle").setScale(0.8));
        this.particles.push(scene.physics.add.sprite(-10,-10,"beamKirbyParticle").setScale(0.8));
        this.particles.push(scene.physics.add.sprite(-10,-10,"beamKirbyParticle").setScale(0.8));
        this.particles.push(scene.physics.add.sprite(-10,-10,"beamKirbyParticle").setScale(0.8));
        this.particles.push(scene.physics.add.sprite(-10,-10,"beamKirbyParticle").setScale(0.8));
        
        this.particleAngle = 0;
        
        // Init Animations
        this.createNormalAnims(scene);
        this.createSparkAnims(scene);
        this.createBeamAnims(scene);
        this.createFireAnims(scene);
        this.createSwimAnims(scene);
        
        // Variables
        this.maxHealth = 6;
        this.jumpForce = -150;
        this.flyForce = -75;
        this.walkSpeed = 1;
        this.runSpeed = 2;
        this.direction = 1;
        this.isBig = false;
        this.isFlying = false;
        this.scene = scene;
        this.touchesGroundFirstTime = false;
        this.isInvulnerable = false;
        this.depth = 1;
        
        this.flyTimer = 0;
        
        // Add to scene with his current physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(this);
        
        
        this.updateSize(false);
        
        this.airAttack = new AirAttack(this.scene, this.x, -config.height);    
        this.sparkAttack = new SparkAttack(this.scene, this.x, -config.height);    
        this.fireAttack = new FireAttack(this.scene, this.x, -config.height);    
    }
      
	preUpdate(time, delta){
        super.preUpdate(time, delta);
        
        if(this.airAttack.x > config.width*1.1 || this.airAttack.x < -10)
            this.airAttack.y = -config.height;
            
        
        if(this.y > config.height){
            config.health = 0;
            this.scene.HUD.updateHealth();
        }
            
        if (this.state != this.states.HURT && this.state != this.states.THROW_AIR)
            this.readInput();
                
        switch(this.state){
            case this.states.WALK:
                if(this.isBig)
                    this.playAnimation("kirbyBigWalk");
                else
                    this.playAnimation("kirbyWalk");
                break;
            case this.states.RUN:
                    this.playAnimation("kirbyRun");
                break;
            case this.states.JUMP:
                if(this.body.velocity.y == 0 && (this.scene.world.checkWorldColliders(this.body.left,this.body.bottom) ||
                   this.scene.world.checkWorldColliders(this.body.right,this.body.bottom))){
                    // this.updateSize(false);
                    this.isFlying = false;
                    this.state = this.states.WALK;
                    if (!this.touchesGroundFirstTime){
                        this.touchesGroundFirstTime = true;
                        this.scene.sound.play("fallToGroundSound");
                    }
                    
                    if(this.transformation == this.transformations.BEAM)
                            this.body.setOffset(0, 5);
                }
                else if(this.body.velocity.y > 0){ 
                    if(this.isBig){
                        this.playAnimation("kirbyBigFall2");
                    }             
                    else {
                        this.playAnimation("kirbyFall");
                        
                        if(this.transformation == this.transformations.BEAM)
                            this.body.setOffset(0, 15);
                    }
                }
                else{
                    if(this.isBig){
                        this.playAnimation("kirbyBigJump");
                    }      
                    else
                        this.playAnimation("kirbyJump");
                }
                
                break;
            case this.states.TAKE_AIR:
                if(this.isFlying){
                   this.updateSize(true);
                }
                else {
                    var posX;
                    if (this.direction == 1)
                        posX = this.body.right+20;
                    else
                        posX = this.body.left-20;
                    for (var i = 0; i < this.scene.enemies.getLength(); i++){
                        var currentEnemy = this.scene.enemies.getFirstNth(i, true);
                        if(currentEnemy.body.hitTest(posX, this.body.center.y)) {
                            currentEnemy.death(this.body.center, true);
                            switch(currentEnemy.id){
                                case 0:
                                    this.inMouth = this.enemies.BEAM;
                                    break;
                                case 1:
                                    this.inMouth = this.enemies.SPARK;
                                    break;
                                case 2:
                                    this.inMouth = this.enemies.OTHER;
                                    break;
                                case 3:
                                    this.inMouth = this.enemies.FIRE;
                                    break;
                                case 4:
                                    this.inMouth = this.enemies.OTHER;
                                    break;
                                case 5:
                                    this.inMouth = this.enemies.OTHER;
                                    break;
                            }
                            //this.scene.sound.play("swallowSound");
                            break;
                        }
                    }
                }
                break;
            case this.states.THROW_AIR:
                break;
            case this.states.FLY:
                if(this.body.velocity.y > 0){       
                    this.playAnimation("kirbyBigFall");
                }
                else{
                    this.playAnimation("kirbyBigFly");
                }
                break;
            case this.states.IDLE:
                 if(this.isBig)
                    this.playAnimation("kirbyBigIdle");
                 else
                    this.playAnimation("kirbyIdle");
                break;
            case this.states.HURT:
                if(this.hitDirection==-1) {
                    if(!this.scene.world.checkWorldColliders(this.body.left-2, this.body.bottom-1)) {
                        if(this.scene.world.level.x < 0 && this.x <= config.width/2) {
                            this.scene.world.move(this.scene, 1);
                            this.scene.enemies.incX(1);
                            this.scene.powerUps.incX(1);
                        }
                        else{
                            this.x -= 1;
                        }
                    }
                }
                else {
                    if(!this.scene.world.checkWorldColliders(this.body.right+2, this.body.bottom-1)){
                        if(this.scene.world.level.x > -(World.getWorldWidth()-config.width) && this.x >= config.width/2) {
                            this.scene.world.move(this.scene, -1);
                            this.scene.enemies.incX(-1);
                            this.scene.powerUps.incX(-1);
                        }
                        else{
                            this.x += 1;
                        }
                    }
                }
                break;
            case this.states.ATTACK:
                
                if(this.transformation == this.transformations.NORMAL){
                    
                }
                else if(this.transformation == this.transformations.BEAM){
                    this.particleAngle += 4*this.direction;
                    var i;
                    for (i = 0; i < this.particles.length; i++){
                        this.particles[i].x = this.body.center.x + (18+10*i)*Math.cos((this.particleAngle-(90-40*this.direction)-i*7*this.direction)*Math.PI/180);
                        this.particles[i].y = this.body.center.y + (18+10*i)*Math.sin((this.particleAngle-(90-40*this.direction)-i*7*this.direction)*Math.PI/180);
                    }
                    this.updateSize(false);
                }
                else if(this.transformation == this.transformations.SPARK){
                    this.playAnimation("kirbyAttack");
                    this.sparkAttack.attack(this);
                }
                else if(this.transformation == this.transformations.FIRE){
                    this.playAnimation("kirbyAttack");
                    this.fireAttack.attack(this);
                }
                
                 if(this.body.velocity.y == 0 && (this.scene.world.checkWorldColliders(this.body.left,this.body.bottom) ||
                   this.scene.world.checkWorldColliders(this.body.right,this.body.bottom)) && this.isFlying){
                    // this.updateSize(false);
                    this.isFlying = false;
                    if (!this.touchesGroundFirstTime){
                        this.touchesGroundFirstTime = true;
                        this.scene.sound.play("fallToGroundSound");
                    }
                 }
                break;
            case this.states.TRANSFORM:
                    break;
            case this.states.SWIM:
                this.playAnimation("swimKirbyWalk");
                if(this.transformation == this.transformations.SPARK){
                    this.sparkAttack.x = -200;
                    this.scene.specialAtack2Audio.stop();
                }
                else if(this.transformation == this.transformations.FIRE){
                    this.fireAttack.x = -200;
                    this.fireAttack.attackSpriteBg.x = -200;
                    this.scene.specialAtack4Audio.stop();
                }
             
                break;
        }
	}
      
    readInput(){
        // Horizontal input movement
        if(this.scene.cursores.left.isDown){
            this.direction = -1;
            if(this.state == this.states.IDLE)
                this.state = this.states.WALK;
        }
        else if(this.scene.cursores.right.isDown){
           this.direction = 1;
            if(this.state == this.states.IDLE)
                this.state = this.states.WALK;
        }
        else if(!this.isFlying && this.state != this.states.TAKE_AIR && this.state != this.states.ATTACK && this.state != this.states.TRANSFORM && this.state != this.states.SWIM)
                this.state = this.states.IDLE;
          
        // Input Jump
         if(Phaser.Input.Keyboard.JustDown(this.scene.spaceBar)){       
            if(this.state == this.states.JUMP){
                if(!this.isBig) {
                    this.state = this.states.FLY; 
                    this.takeAir();
                    this.body.velocity.y = this.flyForce;
                    this.scene.sound.play("jumpFlySound");
                }
            }
            else if(this.state == this.states.FLY || (this.state == this.states.TAKE_AIR && this.isFlying)){
                this.body.velocity.y = this.flyForce;
                this.scene.sound.play("jumpFlySound");
            }
            else if(this.state != this.states.ATTACK && this.state != this.states.TRANSFORM)
                this.jump();
             
            this.startedRunning = true;
         }
       
        if(this.state != this.states.SWIM) {
            // Check if taking Air
            if(Phaser.Input.Keyboard.JustDown(this.scene.e)){   
                if(!this.isBig){
                    if(!this.isFlying){
                        if(this.transformation == this.transformations.NORMAL)
                            this.takeAir();
                        else {
                            this.attack();
                        }
                    }
                    else if(this.state == this.states.FLY){
                        this.throwAir(false); //no entra mai aqui
                    }
                    else{
                        this.attack();
                    }
                }
                else{
                    if(this.inMouth == this.enemies.NONE){
                        this.throwAir(false);
                    } else {
                        this.inMouth = this.enemies.NONE
                        this.throwAir(true);
                    }
                    this.updateSize(false);
                }
            }
            else if(Phaser.Input.Keyboard.JustUp(this.scene.e)){
                if(this.state == this.states.TAKE_AIR){
                    this.state = this.states.IDLE;
                    this.scene.xuclarAudio.stop();
                }
                else if(this.state == this.states.ATTACK){
                    if (this.transformation != this.transformations.BEAM) {
                        if(this.transformation == this.transformations.SPARK){
                            this.sparkAttack.x = -200;
                            this.scene.specialAtack2Audio.stop();
                        }
                        else if(this.transformation == this.transformations.FIRE){
                            this.fireAttack.x = -200;
                            this.fireAttack.attackSpriteBg.x = -200;
                            this.scene.specialAtack4Audio.stop();
                        }

                        if(this.isFlying)
                            this.state = this.states.JUMP;
                        else
                            this.state = this.states.IDLE;
                    }
                }

            }

            // Check if transform
            if(Phaser.Input.Keyboard.JustDown(this.scene.cursores.down)){
                if (this.inMouth != this.enemies.OTHER){
                    if(this.isBig && !this.isFlying) {
                        this.state = this.states.TRANSFORM;
                        this.playAnimation("kirbyTransform");
                        this.scene.sound.play("transformation1Sound");
                        this.once('animationcomplete', function() {
                            this.scene.time.addEvent({delay: 250, callback: () => {
                                this.state = this.states.IDLE;
                                switch(this.inMouth){
                                    case this.enemies.BEAM:
                                        this.transformation = this.transformations.BEAM;
                                        this.isBig = false;
                                        break;
                                    case this.enemies.SPARK:
                                        this.transformation = this.transformations.SPARK;
                                        this.isBig = false;
                                        break;
                                    case this.enemies.FIRE:
                                        this.transformation = this.transformations.FIRE;
                                        this.isBig = false;
                                        break;
                                    case this.enemies.OTHER:
                                        break;
                                }
                                this.scene.HUD.showIcon();
                                this.updateSize(false);
                                this.inMouth = this.enemies.NONE;
                            }, callbackScope: this, repeat: 0});
                        });  
                    }
                }
                else {
                    this.inMouth = this.enemies.NONE;
                    this.state = this.states.IDLE;
                    this.updateSize(false);
                }
            }

            // Running Logic
            if(this.scene.shift.isDown){
                if(!this.isBig && this.state == this.states.WALK){
                    this.state = this.states.RUN;
                    this.scene.sound.play("startRunningSound");
                }
            }
            else if(Phaser.Input.Keyboard.JustUp(this.scene.shift)){
                if(!this.isFlying && this.state == this.states.RUN)
                    this.state = this.states.WALK;
            }    
        }
    }
    
    jump(){
        if(this.isBig)
            this.playAnimation("kirbyBigJump");
        else
            this.playAnimation("kirbyJump");
        
        
        if(this.state == this.states.SWIM){
            this.body.velocity.y = this.jumpForce/2;
        }
        else {
            this.body.velocity.y = this.jumpForce;
        }
        
        this.state = this.states.JUMP;
        this.isFlying = true;
        this.touchesGroundFirstTime = false;
        this.scene.xuclarAudio.stop();
        
        if (this.states.SWIM){
            this.scene.sound.play("jumpSound");//swimSound
        } else {
            this.scene.sound.play("jumpSound");
        }
    }
    
    attack(){
        this.state = this.states.ATTACK;
        if(this.transformation == this.transformations.NORMAL){
            this.state = this.states.JUMP;
        }
        else if(this.transformation == this.transformations.BEAM){
            this.playAnimation("kirbyAttack");
            this.scene.sound.play("specialAtack1Sound");
            this.once('animationcomplete', function() {
                this.state = this.states.IDLE;
                this.particleAngle = 0;
                this.particles.forEach(particle => particle.x = particle.y = -10);
            });        
        }
        else if(this.transformation == this.transformations.SPARK){
            this.sparkAttack.attack(this);
            this.scene.specialAtack2Audio.play();
        }
        else if(this.transformation == this.transformations.FIRE){
            this.scene.specialAtack4Audio.play();
        }
    }  
        
    takeAir(){
        this.state = this.states.TAKE_AIR;
        this.playAnimation("kirbyTakeAir");
        
        if(!this.isFlying) {
            this.scene.xuclarAudio.play();
            if(this.direction == 1)
                this.once('animationcomplete', function() {this.setTexture("kirbyTakeAir", 4)});
            else 
                this.once('animationcomplete', function() {this.setTexture("kirbyTakeAir", 9)});
        }
        else{        
            this.once('animationcomplete', function() {this.playAnimation("kirbyBigFly"); this.state = this.states.FLY;}); 
        }
    }
    
    updateSize(isBig){
        if(isBig){
            this.isBig = true;
            this.body.setSize(24,24, false);
            switch(this.transformation){
                case this.transformations.BEAM:
                    // this.body.setSize(26,31, false);
                    this.body.setOffset(0, 5);
                    break;
                case this.transformations.SPARK:
                    // this.body.setSize(26,40, false);
                    this.body.setOffset(0, 15);
                    break;
                 case this.transformations.NORMAL:
                    // this.body.setSize(24,24, false);
                    this.body.setOffset(0, 0);
                    break;
                 case this.transformations.FIRE:
                    // this.body.setSize(26,40, false);
                    this.body.setOffset(0, 15);
                    break;
            }
            
            if(this.state == this.states.SWIM)
                this.body.setOffset(0, 0);
        }
        else{
             this.isBig = false;
             this.body.setSize(22,19,true);
             switch(this.transformation){
                    case this.transformations.BEAM:
                        // this.body.setSize(25,25,false);
                        this.body.setOffset(0, 5);
                        break;
                    case this.transformations.SPARK:       
                        // this.body.setSize(23,35,false);
                        this.body.setOffset(0, 15);
                        break;
                     case this.transformations.NORMAL:
                        // this.body.setSize(22,19,false);
                        this.body.setOffset(0, 0);
                        break;
                    case this.transformations.FIRE:
                        // this.body.setSize(23,35,false);
                        this.body.setOffset(0, 15);
                        break;
            }
            
            if(this.state == this.states.SWIM)
                this.body.setOffset(0, 0);
        }
    }
    
    throwAir(throwEnemy){
        this.state = this.states.THROW_AIR;
        this.playAnimation("kirbyBigThrowAir");   
        this.once('animationcomplete', function() {this.state = this.states.JUMP;});
        if(this.isBig){
            this.scene.sound.play("throwSound");
            this.airAttack.throwAir(this, throwEnemy);
        }
        else{
            this.scene.sound.play("throwAirSound");
            this.airAttack.throwAir(this, throwEnemy);
        }
    }
    
    playAnimation(animName){
        if(!animName.includes("Hurt") && this.state != this.states.SWIM){
            if(this.transformation == this.transformations.BEAM){
                animName = "K" + animName.substring (0 + 1);
                animName = "beam" + animName;
            }
            else if(this.transformation == this.transformations.SPARK){
                animName = "K" + animName.substring (0 + 1);
                animName = "spark" + animName;
            }
            else if(this.transformation == this.transformations.FIRE){
                animName = "K" + animName.substring (0 + 1);
                animName = "fire" + animName;
            }
        }
        
        if(this.direction == 1)
            this.play(animName + "Right", true);
        else
             this.play(animName + "Left", true);   
    }
    
    hurt(damagePos){
        if(this.transformation == this.transformations.SPARK){
            this.sparkAttack.x = -200;
            this.scene.specialAtack2Audio.stop();
        }
        else if(this.transformation == this.transformations.FIRE){
            this.fireAttack.x = -200;
            this.fireAttack.attackSpriteBg.x = -200;
            this.scene.specialAtack4Audio.stop();
        }
        this.inMouth = this.enemies.NONE;
        this.isInvulnerable = true;
        this.state = this.states.HURT;
        this.transformation = this.transformations.NORMAL;
        this.scene.HUD.showIcon();
        this.updateSize(false);     
        this.tint = 0xffff11;
        this.scene.time.addEvent({delay: 2000, callback: () => {this.isInvulnerable = false;this.clearTint();}, callbackScope: this, repeat: 0});
        this.scene.time.addEvent({delay: 500, callback: () => {this.state = this.states.JUMP;}, callbackScope: this, repeat: 0});
        this.scene.xuclarAudio.stop();
        this.body.velocity.y = -30;
        this.scene.sound.play("enemyHitMele");
        if (this.x > damagePos.x) {
            this.hitDirection = 1;
            this.play("kirbyHurtLeft", true);
        }
        else {
            this.hitDirection = -1;
            this.play("kirbyHurtRight", true);
        }
    }
    
    getStateMovingSpeed(){
        if (this.isFlying || this.state == this.states.WALK || this.state == this.states.SWIM)
            return this.walkSpeed;
        else if (this.state == this.states.RUN)
            return this.runSpeed;
        else
            return 0;
    }
    
    createNormalAnims(scene){
        // Walk
        scene.anims.create({
            key: "kirbyWalkRight",
            frames:
            scene.anims.generateFrameNumbers("kirbyWalk", {start: 0, end: 9}),
            frameRate: 10,
            repeat: -1
        }) 
        scene.anims.create({
            key: "kirbyWalkLeft",
            frames:
            scene.anims.generateFrameNumbers("kirbyWalk", {start: 19, end: 10}),
            frameRate: 10,
            repeat: -1
        })
        
        // Idle
        scene.anims.create({
            key: "kirbyIdleRight",
            frames:
            scene.anims.generateFrameNumbers("kirbyIdle", {start: 0, end: 1}),
            frameRate: 1,
            repeat: -1
        })
        scene.anims.create({
            key: "kirbyIdleLeft",
            frames:
            scene.anims.generateFrameNumbers("kirbyIdle", {start: 2, end: 3}),
            frameRate: 1,
            repeat: -1
        })
        
        // Jump
        scene.anims.create({
            key: "kirbyJumpRight",
            frames:
            scene.anims.generateFrameNumbers("kirbyJump", {start: 0, end: 0}),
            frameRate: 1,
            repeat: 1
        })
        scene.anims.create({
            key: "kirbyJumpLeft",
            frames:
            scene.anims.generateFrameNumbers("kirbyJump", {start: 1, end: 1}),
            frameRate: 1,
            repeat: 1
        })
        
        // Fall
        scene.anims.create({
            key: "kirbyFallLeft",
            frames:
            scene.anims.generateFrameNumbers("kirbyLand", {start: 3, end: 3}),
            frameRate: 1,
            repeat: 0
        })
        scene.anims.create({
            key: "kirbyFallRight",
            frames:
            scene.anims.generateFrameNumbers("kirbyLand", {start: 0, end: 0}),
            frameRate: 1,
            repeat: 0
        })
        
        // Land
        scene.anims.create({
            key: "kirbyLandLeft",
            frames:
            scene.anims.generateFrameNumbers("kirbyLand", {start: 4, end: 5}),
            frameRate: 10,
            repeat: 0
        })
        scene.anims.create({
            key: "kirbyLandRight",
            frames:
            scene.anims.generateFrameNumbers("kirbyLand", {start: 1, end: 2}),
            frameRate: 10,
            repeat: 0
        })
        
        // Hurt
        scene.anims.create({
            key: "kirbyHurtLeft",
            frames:
            scene.anims.generateFrameNumbers("kirbyHurt", {start: 9, end: 17}),
            frameRate: 15,
            repeat: 0
        })
        scene.anims.create({
            key: "kirbyHurtRight",
            frames:
            scene.anims.generateFrameNumbers("kirbyHurt", {start: 0, end: 8}),
            frameRate: 15,
            repeat: 0
        })
        
        // Take Air
        scene.anims.create({
            key: "kirbyTakeAirRight",
            frames:
            scene.anims.generateFrameNumbers("kirbyTakeAir", {start: 0, end: 4}),
            frameRate: 15,
            repeat: 0
        })
        scene.anims.create({
            key: "kirbyTakeAirLeft",
            frames:
            scene.anims.generateFrameNumbers("kirbyTakeAir", {start: 5, end: 9}),
            frameRate: 15,
            repeat: 0
        })          
        
        // Big Walk
        scene.anims.create({
            key: "kirbyBigWalkRight",
            frames:
            scene.anims.generateFrameNumbers("kirbyBigWalk", {start: 0, end: 15}),
            frameRate: 10,
            repeat: -1
        })  
        scene.anims.create({
            key: "kirbyBigWalkLeft",
            frames:
            scene.anims.generateFrameNumbers("kirbyBigWalk", {start: 16, end: 31}),
            frameRate: 10,
            repeat: -1
        })  
        
        // Big Idle
        scene.anims.create({
            key: "kirbyBigIdleLeft",
            frames:
            scene.anims.generateFrameNumbers("kirbyBigIdle", {start: 2, end: 3}),
            frameRate: 1,
            repeat: -1
        })
        scene.anims.create({
            key: "kirbyBigIdleRight",
            frames:
            scene.anims.generateFrameNumbers("kirbyBigIdle", {start: 0, end: 1}),
            frameRate: 1,
            repeat: -1
        })  
        
        // Big Throw Air
        scene.anims.create({
            key: "kirbyBigThrowAirRight",
            frames:
            scene.anims.generateFrameNumbers("kirbyBigThrowAir", {start: 2, end: 3}),
            frameRate: 10,
            repeat: 0
        })  
        scene.anims.create({
            key: "kirbyBigThrowAirLeft",
            frames:
            scene.anims.generateFrameNumbers("kirbyBigThrowAir", {start: 6, end: 7}),
            frameRate: 10,
            repeat: 0
        }) 
        
        // Big Land
        scene.anims.create({
            key: "kirbyBigLandRight",
            frames:
            scene.anims.generateFrameNumbers("kirbyBigLand", {start: 0, end: 7}),
            frameRate: 10,
            repeat: 0
        }) 
        scene.anims.create({
            key: "kirbyBigLandLeft",
            frames:
            scene.anims.generateFrameNumbers("kirbyBigLand", {start: 8, end: 15}),
            frameRate: 10,
            repeat: 0
        }) 
        
        // Run 
        scene.anims.create({
            key: "kirbyRunRight",
            frames:
            scene.anims.generateFrameNumbers("kirbyRun", {start: 0, end: 7}),
            frameRate: 15,
            repeat: -1
        }) 
        scene.anims.create({
            key: "kirbyRunLeft",
            frames:
            scene.anims.generateFrameNumbers("kirbyRun", {start: 8, end: 15}),
            frameRate: 15,
            repeat: -1
        }) 
        
        // Fly
        scene.anims.create({
            key: "kirbyBigFlyRight",
            frames:
            scene.anims.generateFrameNumbers("kirbyBigFly", {start: 0, end: 7}),
            frameRate: 10,
            repeat: 0
        }) 
        scene.anims.create({
            key: "kirbyBigFlyLeft",
            frames:
            scene.anims.generateFrameNumbers("kirbyBigFly", {start: 8, end: 15}),
            frameRate: 10,
            repeat: 0
        }) 
        
        // Big Fall while Flying
        scene.anims.create({
            key: "kirbyBigFallRight",
            frames:
            scene.anims.generateFrameNumbers("kirbyBigFly", {start: 0, end: 1}),
            frameRate: 10,
            repeat: 0
        }) 
        scene.anims.create({
            key: "kirbyBigFallLeft",
            frames:
            scene.anims.generateFrameNumbers("kirbyBigFly", {start: 8, end: 9}),
            frameRate: 10,
            repeat: 0
        }) 
        
        // Big Fall 2
        scene.anims.create({
            key: "kirbyBigFall2Right",
            frames:
            scene.anims.generateFrameNumbers("kirbyBigJump", {start: 4, end: 5}),
            frameRate: 10,
            repeat: 0
        }) 
        scene.anims.create({
            key: "kirbyBigFall2Left",
            frames:
            scene.anims.generateFrameNumbers("kirbyBigJump", {start: 11, end: 12}),
            frameRate: 10,
            repeat: 0
        }) 
        
        // Big Jump
        scene.anims.create({
            key: "kirbyBigJumpRight",
            frames:
            scene.anims.generateFrameNumbers("kirbyBigJump", {start: 0, end: 0}),
            frameRate: 10,
            repeat: 0
        }) 
        scene.anims.create({
            key: "kirbyBigJumpLeft",
            frames:
            scene.anims.generateFrameNumbers("kirbyBigJump", {start: 8, end: 8}),
            frameRate: 10,
            repeat: 0
        }) 
        
        // Transformation
        scene.anims.create({
            key: "kirbyTransformRight",
            frames:
            scene.anims.generateFrameNumbers("kirbyTransform", {start: 0, end: 8}),
            frameRate: 10,
            repeat: 0
        }) 
        scene.anims.create({
            key: "kirbyTransformLeft",
            frames:
            scene.anims.generateFrameNumbers("kirbyTransform", {start: 9, end: 17}),
            frameRate: 10,
            repeat: 0
        }) 
        scene.anims.create({
            key: "kirbyTransformBackgorund",
            frames:
            scene.anims.generateFrameNumbers("transformationPNG", {start: 0, end: 1}),
            frameRate: 1,
            repeat: 0
        }) 
    }
    
    createSparkAnims(scene){
        // Walk
        scene.anims.create({
            key: "sparkKirbyWalkRight",
            frames:
            scene.anims.generateFrameNumbers("sparkKirbyWalk", {start: 0, end: 19}),
            frameRate: 20,
            repeat: -1
        }) 
        scene.anims.create({
            key: "sparkKirbyWalkLeft",
            frames:
            scene.anims.generateFrameNumbers("sparkKirbyWalk", {start: 20, end: 39}),
            frameRate: 20,
            repeat: -1
        })
        
        // Idle
        scene.anims.create({
            key: "sparkKirbyIdleRight",
            frames:
            scene.anims.generateFrameNumbers("sparkKirbyIdle", {start: 0, end: 7}),
            frameRate: 10,
            repeat: -1
        })
        scene.anims.create({
            key: "sparkKirbyIdleLeft",
            frames:
            scene.anims.generateFrameNumbers("sparkKirbyIdle", {start: 8, end: 15}),
            frameRate: 10,
            repeat: -1
        })
        
        // Jump
        scene.anims.create({
            key: "sparkKirbyJumpRight",
            frames:
            scene.anims.generateFrameNumbers("sparkKirbyJump", {start: 0, end: 1}),
            frameRate: 10,
            repeat: -1
        })
        scene.anims.create({
            key: "sparkKirbyJumpLeft",
            frames:
            scene.anims.generateFrameNumbers("sparkKirbyJump", {start: 2, end: 3}),
            frameRate: 10,
            repeat: -1
        })
        
        // Fall
        scene.anims.create({
            key: "sparkKirbyFallLeft",
            frames:
            scene.anims.generateFrameNumbers("sparkKirbyLand", {start: 2, end: 3}),
            frameRate: 10,
            repeat: -1
        })
        scene.anims.create({
            key: "sparkKirbyFallRight",
            frames:
            scene.anims.generateFrameNumbers("sparkKirbyLand", {start: 0, end: 1}),
            frameRate: 10,
            repeat: -1
        })
        
        // Land
        scene.anims.create({
            key: "sparkKirbyLandLeft",
            frames:
            scene.anims.generateFrameNumbers("sparkKirbyLand", {start: 2, end: 3}),
            frameRate: 10,
            repeat: 0
        })
        scene.anims.create({
            key: "sparkKirbyLandRight",
            frames:
            scene.anims.generateFrameNumbers("sparkKirbyLand", {start: 0, end: 1}),
            frameRate: 10,
            repeat: 0
        })
              
        // Take Air
        scene.anims.create({
            key: "sparkKirbyTakeAirRight",
            frames:
            scene.anims.generateFrameNumbers("sparkKirbyTakeAir", {start: 0, end: 4}),
            frameRate: 15,
            repeat: 0
        })
        scene.anims.create({
            key: "sparkKirbyTakeAirLeft",
            frames:
            scene.anims.generateFrameNumbers("sparkKirbyTakeAir", {start: 5, end: 9}),
            frameRate: 15,
            repeat: 0
        })     
        
        // Big Throw Air
        scene.anims.create({
            key: "sparkKirbyBigThrowAirRight",
            frames:
            scene.anims.generateFrameNumbers("sparkKirbyBigThrowAir", {start: 0, end: 1}),
            frameRate: 10,
            repeat: 0
        })  
        scene.anims.create({
            key: "sparkKirbyBigThrowAirLeft",
            frames:
            scene.anims.generateFrameNumbers("sparkKirbyBigThrowAir", {start: 2, end: 3}),
            frameRate: 10,
            repeat: 0
        }) 
        
         // Run 
        scene.anims.create({
            key: "sparkKirbyRunRight",
            frames:
            scene.anims.generateFrameNumbers("sparkKirbyRun", {start: 0, end: 7}),
            frameRate: 15,
            repeat: -1
        }) 
        scene.anims.create({
            key: "sparkKirbyRunLeft",
            frames:
            scene.anims.generateFrameNumbers("sparkKirbyRun", {start: 10, end: 15}),
            frameRate: 15,
            repeat: -1
        }) 
        
        // Fly
        scene.anims.create({
            key: "sparkKirbyBigFlyRight",
            frames:
            scene.anims.generateFrameNumbers("sparkKirbyBigFly", {start: 0, end: 7}),
            frameRate: 20,
            repeat: 0
        }) 
        scene.anims.create({
            key: "sparkKirbyBigFlyLeft",
            frames:
            scene.anims.generateFrameNumbers("sparkKirbyBigFly", {start: 8, end: 15}),
            frameRate: 20,
            repeat: 0
        }) 
        
        // Big Fall
        scene.anims.create({
            key: "sparkKirbyBigFallRight",
            frames:
            scene.anims.generateFrameNumbers("sparkKirbyBigFly", {start: 0, end: 2}),
            frameRate: 10,
            repeat: 0
        }) 
        scene.anims.create({
            key: "sparkKirbyBigFallLeft",
            frames:
            scene.anims.generateFrameNumbers("sparkKirbyBigFly", {start: 8, end: 10}),
            frameRate: 10,
            repeat: 0
        })   
        
        // Attack
        scene.anims.create({
            key: "sparkKirbyAttackRight",
            frames:
            scene.anims.generateFrameNumbers("sparkKirbyAttack", {start: 0, end: 6}),
            frameRate: 20,
            repeat: -1
        }) 
        scene.anims.create({
            key: "sparkKirbyAttackLeft",
            frames:
            scene.anims.generateFrameNumbers("sparkKirbyAttack", {start: 7, end: 13}),
            frameRate: 20,
            repeat: -1
        })  
    }
    
    createBeamAnims(scene){
        // Walk
        scene.anims.create({
            key: "beamKirbyWalkRight",
            frames:
            scene.anims.generateFrameNumbers("beamKirbyWalk", {start: 0, end: 10}),
            frameRate: 20,
            repeat: -1
        }) 
        scene.anims.create({
            key: "beamKirbyWalkLeft",
            frames:
            scene.anims.generateFrameNumbers("beamKirbyWalk", {start: 11, end: 21}),
            frameRate: 20,
            repeat: -1
        })
        
        // Idle
        scene.anims.create({
            key: "beamKirbyIdleRight",
            frames:
            scene.anims.generateFrameNumbers("beamKirbyIdle", {start: 0, end: 1}),
            frameRate: 1,
            repeat: -1
        })
        scene.anims.create({
            key: "beamKirbyIdleLeft",
            frames:
            scene.anims.generateFrameNumbers("beamKirbyIdle", {start: 2, end: 3}),
            frameRate: 1,
            repeat: -1
        })
        
        // Jump
        scene.anims.create({
            key: "beamKirbyJumpRight",
            frames:
            scene.anims.generateFrameNumbers("beamKirbyJump", {start: 0, end: 1}),
            frameRate: 1,
            repeat: -1
        })
        scene.anims.create({
            key: "beamKirbyJumpLeft",
            frames:
            scene.anims.generateFrameNumbers("beamKirbyJump", {start: 2, end: 3}),
            frameRate: 1,
            repeat: -1
        })
        
        // Fall
        scene.anims.create({
            key: "beamKirbyFallLeft",
            frames:
            scene.anims.generateFrameNumbers("beamKirbyLand", {start: 2, end: 3}),
            frameRate: 2,
            repeat: -1
        })
        scene.anims.create({
            key: "beamKirbyFallRight",
            frames:
            scene.anims.generateFrameNumbers("beamKirbyLand", {start: 0, end: 1}),
            frameRate: 2,
            repeat: -1
        })
        
        // Land
        scene.anims.create({
            key: "beamKirbyLandLeft",
            frames:
            scene.anims.generateFrameNumbers("beamKirbyLand", {start: 2, end: 3}),
            frameRate: 10,
            repeat: 0
        })
        scene.anims.create({
            key: "beamKirbyLandRight",
            frames:
            scene.anims.generateFrameNumbers("beamKirbyLand", {start: 0, end: 1}),
            frameRate: 10,
            repeat: 0
        })
         
        // Take Air
        scene.anims.create({
            key: "beamKirbyTakeAirRight",
            frames:
            scene.anims.generateFrameNumbers("beamKirbyTakeAir", {start: 0, end: 4}),
            frameRate: 15,
            repeat: 0
        })
        scene.anims.create({
            key: "beamKirbyTakeAirLeft",
            frames:
            scene.anims.generateFrameNumbers("beamKirbyTakeAir", {start: 5, end: 9}),
            frameRate: 15,
            repeat: 0
        })     
        
        // Big Throw Air
        scene.anims.create({
            key: "beamKirbyBigThrowAirRight",
            frames:
            scene.anims.generateFrameNumbers("beamKirbyBigThrowAir", {start: 0, end: 1}),
            frameRate: 10,
            repeat: 0
        })  
        scene.anims.create({
            key: "beamKirbyBigThrowAirLeft",
            frames:
            scene.anims.generateFrameNumbers("beamKirbyBigThrowAir", {start: 2, end: 3}),
            frameRate: 10,
            repeat: 0
        }) 
        
         // Run 
        scene.anims.create({
            key: "beamKirbyRunRight",
            frames:
            scene.anims.generateFrameNumbers("beamKirbyRun", {start: 0, end: 7}),
            frameRate: 15,
            repeat: -1
        }) 
        scene.anims.create({
            key: "beamKirbyRunLeft",
            frames:
            scene.anims.generateFrameNumbers("beamKirbyRun", {start: 8, end: 15}),
            frameRate: 15,
            repeat: -1
        }) 
        
        // Fly
        scene.anims.create({
            key: "beamKirbyBigFlyRight",
            frames:
            scene.anims.generateFrameNumbers("beamKirbyBigFly", {start: 0, end: 7}),
            frameRate: 20,
            repeat: 0
        }) 
        scene.anims.create({
            key: "beamKirbyBigFlyLeft",
            frames:
            scene.anims.generateFrameNumbers("beamKirbyBigFly", {start: 8, end: 15}),
            frameRate: 20,
            repeat: 0
        }) 
        
        // Big Fall
        scene.anims.create({
            key: "beamKirbyBigFallRight",
            frames:
            scene.anims.generateFrameNumbers("beamKirbyBigFly", {start: 0, end: 1}),
            frameRate: 10,
            repeat: 0
        }) 
        scene.anims.create({
            key: "beamKirbyBigFallLeft",
            frames:
            scene.anims.generateFrameNumbers("beamKirbyBigFly", {start: 8, end:9}),
            frameRate: 10,
            repeat: 0
        })
        
        // Attack
        scene.anims.create({
            key: "beamKirbyAttackRight",
            frames:
            scene.anims.generateFrameNumbers("beamKirbyAttack", {start: 0, end: 14}),
            frameRate: 30,
            repeat: 0
        }) 
        scene.anims.create({
            key: "beamKirbyAttackLeft",
            frames:
            scene.anims.generateFrameNumbers("beamKirbyAttack", {start: 15, end:27}),
            frameRate: 30,
            repeat: 0
        })
    }
    
    createFireAnims(scene){
         // Walk
        scene.anims.create({
            key: "fireKirbyWalkRight",
            frames:
            scene.anims.generateFrameNumbers("fireKirbyWalk", {start: 0, end: 19}),
            frameRate: 20,
            repeat: -1
        }) 
        scene.anims.create({
            key: "fireKirbyWalkLeft",
            frames:
            scene.anims.generateFrameNumbers("fireKirbyWalk", {start: 20, end: 39}),
            frameRate: 20,
            repeat: -1
        })
        
        // Idle
        scene.anims.create({
            key: "fireKirbyIdleRight",
            frames:
            scene.anims.generateFrameNumbers("fireKirbyIdle", {start: 0, end: 7}),
            frameRate: 10,
            repeat: -1
        })
        scene.anims.create({
            key: "fireKirbyIdleLeft",
            frames:
            scene.anims.generateFrameNumbers("fireKirbyIdle", {start: 8, end: 15}),
            frameRate: 10,
            repeat: -1
        })
        
        // Jump
        scene.anims.create({
            key: "fireKirbyJumpRight",
            frames:
            scene.anims.generateFrameNumbers("fireKirbyJump", {start: 0, end: 1}),
            frameRate: 10,
            repeat: -1
        })
        scene.anims.create({
            key: "fireKirbyJumpLeft",
            frames:
            scene.anims.generateFrameNumbers("fireKirbyJump", {start: 2, end: 3}),
            frameRate: 10,
            repeat: -1
        })
        
        // Fall
        scene.anims.create({
            key: "fireKirbyFallLeft",
            frames:
            scene.anims.generateFrameNumbers("fireKirbyLand", {start: 2, end: 3}),
            frameRate: 10,
            repeat: -1
        })
        scene.anims.create({
            key: "fireKirbyFallRight",
            frames:
            scene.anims.generateFrameNumbers("fireKirbyLand", {start: 0, end: 1}),
            frameRate: 10,
            repeat: -1
        })
        
        // Land
        scene.anims.create({
            key: "fireKirbyLandLeft",
            frames:
            scene.anims.generateFrameNumbers("fireKirbyLand", {start: 2, end: 3}),
            frameRate: 10,
            repeat: 0
        })
        scene.anims.create({
            key: "fireKirbyLandRight",
            frames:
            scene.anims.generateFrameNumbers("fireKirbyLand", {start: 0, end: 1}),
            frameRate: 10,
            repeat: 0
        })
              
        // Take Air
        scene.anims.create({
            key: "fireKirbyTakeAirRight",
            frames:
            scene.anims.generateFrameNumbers("fireKirbyTakeAir", {start: 0, end: 4}),
            frameRate: 15,
            repeat: 0
        })
        scene.anims.create({
            key: "fireKirbyTakeAirLeft",
            frames:
            scene.anims.generateFrameNumbers("fireKirbyTakeAir", {start: 5, end: 9}),
            frameRate: 15,
            repeat: 0
        })     
        
        // Big Throw Air
        scene.anims.create({
            key: "fireKirbyBigThrowAirRight",
            frames:
            scene.anims.generateFrameNumbers("fireKirbyBigThrowAir", {start: 0, end: 1}),
            frameRate: 10,
            repeat: 0
        })  
        scene.anims.create({
            key: "fireKirbyBigThrowAirLeft",
            frames:
            scene.anims.generateFrameNumbers("fireKirbyBigThrowAir", {start: 2, end: 3}),
            frameRate: 10,
            repeat: 0
        }) 
        
         // Run 
        scene.anims.create({
            key: "fireKirbyRunRight",
            frames:
            scene.anims.generateFrameNumbers("fireKirbyRun", {start: 0, end: 7}),
            frameRate: 15,
            repeat: -1
        }) 
        scene.anims.create({
            key: "fireKirbyRunLeft",
            frames:
            scene.anims.generateFrameNumbers("fireKirbyRun", {start: 10, end: 15}),
            frameRate: 15,
            repeat: -1
        }) 
        
        // Fly
        scene.anims.create({
            key: "fireKirbyBigFlyRight",
            frames:
            scene.anims.generateFrameNumbers("fireKirbyBigFly", {start: 0, end: 14}),
            frameRate: 25,
            repeat: 0
        }) 
        scene.anims.create({
            key: "fireKirbyBigFlyLeft",
            frames:
            scene.anims.generateFrameNumbers("fireKirbyBigFly", {start: 15, end: 29}),
            frameRate: 25,
            repeat: 0
        }) 
        
        // Big Fall
        scene.anims.create({
            key: "fireKirbyBigFallRight",
            frames:
            scene.anims.generateFrameNumbers("fireKirbyBigFly", {start: 0, end: 2}),
            frameRate: 10,
            repeat: 0
        }) 
        scene.anims.create({
            key: "fireKirbyBigFallLeft",
            frames:
            scene.anims.generateFrameNumbers("fireKirbyBigFly", {start: 15, end: 17}),
            frameRate: 10,
            repeat: 0
        })   
        
        // Attack
        scene.anims.create({
            key: "fireKirbyAttackRight",
            frames:
            scene.anims.generateFrameNumbers("fireKirbyAttack", {start: 6, end: 9}),
            frameRate: 20,
            repeat: -1
        }) 
        scene.anims.create({
            key: "fireKirbyAttackLeft",
            frames:
            scene.anims.generateFrameNumbers("fireKirbyAttack", {start: 18, end: 21}),
            frameRate: 20,
            repeat: -1
        })      
    }
    
    createSwimAnims(scene){
        scene.anims.create({
            key: "swimKirbyWalkRight",
            frames:
            scene.anims.generateFrameNumbers("swimKirbySwim", {start: 0, end: 15}),
            frameRate: 10,
            repeat: -1
        }) 
        scene.anims.create({
            key: "swimKirbyWalkLeft",
            frames:
            scene.anims.generateFrameNumbers("swimKirbySwim", {start: 16, end: 31}),
            frameRate: 10,
            repeat: -1
        })
    }
}