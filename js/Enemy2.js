class Enemy2 extends Phaser.Physics.Arcade.Sprite{
    
    constructor(scene, positionX, positionY){
        super(scene, positionX, positionY, "enemy2Walk").setOrigin(0.5); 
             
        this.states = {
            NONE: 0,
            MOVE: 1,
            ATTACK: 2,
            CHARGE: 3,
            JUMP: 4,
            DEATH: 5
        }  
        
        this.state = this.states.NONE;
        this.setDepth(1);
        // Init Animations
        this.createAnims(scene);
                
        // Variables
        this.walkSpeed = 0.5;
        this.direction = 1;
        this.canMove = true;
        this.isDead = false;
        this.id = 1;
        
        //this.scene = scene; 
        this.world = scene.world;
        this.scene = scene;
        
        // Add to scene with his current physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        
        this.attackBg = this.scene.physics.add.sprite(-100, -100,"enemy2Attack").setOrigin(0.5);
        this.attackBg.setDepth(0);
        this.attackBg.body.setAllowGravity(false);
        this.attackBg.play("enemy2Attack", true);
        
        scene.physics.add.overlap(scene.kirby, this.attackBg, (kirby) => {
                if (!kirby.isInvulnerable) {
                    scene.HUD.updateHealth();
                    kirby.hurt(this.body.center);
                }
            });
    }
      
	preUpdate(time, delta){
        super.preUpdate(time, delta);
        
        switch(this.state){
            case this.states.NONE:
                this.state = this.states.MOVE;
                break;
            case this.states.MOVE:
                if(this.body.velocity.y == 0 && this.world.checkWorldColliders(this.body.x,this.body.bottom+2)) {
                    if(this.canMove) {
                        this.canMove = false;
                        this.moveTimer = this.scene.time.addEvent({delay: 500, callback: this.selectAction, callbackScope: this, repeat: 0});
                    }
                    else if (this.direction == 1)
                        this.setTexture("enemy2Walk", 4);
                    else
                        this.setTexture("enemy2Walk", 0);
                }            
                break;
            case this.states.CHARGE:
                this.play("enemy2Charge");
                break;
            case this.states.ATTACK:
                this.attackBg.x = this.x;
                this.attackBg.y = this.y;
                break;
            case this.states.JUMP:
                this.move();
                if(this.body.velocity.y == 0 && this.world.checkWorldColliders(this.body.x,this.body.bottom+2)) {
                    this.state = this.states.MOVE;
                }
                else if (this.direction == 1)
                    this.setTexture("enemy2Walk", 7);
                else
                    this.setTexture("enemy2Walk", 3);
                break;    
            case this.states.DEATH:
                break;
        }
    }
    
    createAnims(scene){
        // Walk
        scene.anims.create({
            key: "enemy2WalkRight",
            frames:
            scene.anims.generateFrameNumbers("enemy2Walk", {start: 4, end: 7}),
            frameRate: 8,
            repeat: -1
        }) 
        scene.anims.create({
            key: "enemy2WalkLeft",
            frames:
            scene.anims.generateFrameNumbers("enemy2Walk", {start: 0, end: 3}),
            frameRate: 8,
            repeat: -1
        })
        
        // Charge
        scene.anims.create({
            key: "enemy2Charge",
            frames:
            scene.anims.generateFrameNumbers("enemy2Charge", {start: 0, end: 1}),
            frameRate: 10,
            repeat: -1
        }) 
        scene.anims.create({
            key: "enemy2Attack",
            frames:
            scene.anims.generateFrameNumbers("enemy2Attack", {start: 0, end: 3}),
            frameRate: 15,
            repeat: -1
        }) 
        scene.anims.create({
            key: "enemy2DeathRight",
            frames:
            scene.anims.generateFrameNumbers("enemy2Death", {start: 0, end: 1}),
            frameRate: 1,
            repeat: -1
        }) 
        scene.anims.create({
            key: "enemy2DeathLeft",
            frames:
            scene.anims.generateFrameNumbers("enemy2Death", {start: 1, end: 2}),
            frameRate: 1,
            repeat: -1
        }) 
    }
    
    selectAction(){
        this.moveTimer.remove();
        this.canMove = true;
        var rand = Math.random();
        if (rand > 0.75) {
            // jump
            this.body.velocity.y = -100;
            this.state = this.states.JUMP;
        }
        else if (rand > 0.5){
            // charge attack
            this.timer1 = this.scene.time.addEvent({delay: 1000, callback: 
                                                    function(){this.attack();
                                                    if(this.x > 0 && this.x < config.width)           
                                                        this.scene.sound.play("enemy2AtackSound");}, 
                                                    callbackScope: this, repeat: 0});
            this.timer2 = this.scene.time.addEvent({delay: 1300, callback: 
                                                    function(){
                                                    if(this.x > 0 && this.x < config.width)
                                                        this.scene.sound.play("enemy2AtackSound");}, 
                                                    callbackScope: this, repeat: 0});
            this.state = this.states.CHARGE;
        }
        else{
            this.body.velocity.y = -50;
            this.state = this.states.JUMP;
        }
    }
    
    death(kirbyPos, gettingAspired = false){
        if (!this.isDead) {
            this.isDead = true;
            this.state = this.states.DEATH;
            this.anims.stop();
            
            if(this.timer1 != null)
                this.timer1.remove();
            
            if(this.timer2 != null)
                this.timer2.remove();
            
            if(this.attackTimer != null)
                this.attackTimer.remove();
            
            if(this.moveTimer != null)
                this.moveTimer.remove();
            
            this.attackBg.x = -100;
            this.attackBg.y = -100;
            this.playAnimation("enemy2Death");
            if (!gettingAspired) {
                this.body.velocity.x = (this.body.center.x - kirbyPos.x)*2;
                this.body.velocity.y = (this.body.center.y - kirbyPos.y)*2;
                this.scene.sound.play("throwHitSound");
                config.score += 600;
                this.scene.HUD.updateScore();
                this.scene.time.addEvent({delay: 500, callback: function(){this.scene.sound.play("enemyHitHability");this.attackBg.destroy();this.destroy();}, callbackScope: this, repeat: 0});
            }
            else{
                var delay;
                if (kirbyPos.x > this.body.center.x) {
                    this.body.velocity.x = 100;
                    delay = kirbyPos.x - this.body.center.x;
                }
                else {
                    this.body.velocity.x = -100;
                    delay = this.body.center.x - kirbyPos.x;
                }
                this.body.gravity.y = 0;
                this.scene.time.addEvent({delay: delay*10, callback: function(){
                    this.scene.kirby.state = this.scene.kirby.states.IDLE;
                    this.scene.kirby.updateSize(true);
                    this.scene.xuclarAudio.stop();
                    this.scene.sound.play("swallowSound");
                    config.score += 300;
                    this.scene.HUD.updateScore();
                    this.destroy();
                    this.attackBg.destroy();}, callbackScope: this, repeat: 0});
            }
        }
    }
    
    move(){       
        if(this.direction == 1){
            if (this.world.checkWorldColliders(this.body.right+this.walkSpeed, this.body.bottom-1) || this.body.right >= this.world.level.x+World.getWorldWidth()){
                this.direction = -this.direction;
            } 
        }
        else{
            if (this.world.checkWorldColliders(this.body.left-this.walkSpeed, this.body.bottom-1) || this.body.left <= this.world.level.x){
                this.direction = -this.direction;
            } 
        }
        if(this.direction == 1)
            this.x += this.walkSpeed;
        else
            this.x -= this.walkSpeed;
    }
    
    attack(){
        this.state = this.states.ATTACK;
        this.attackBg.x = this.body.center.x;
        this.attackBg.y = this.body.center.y;          
        this.attackTimer = this.scene.time.addEvent({delay: 1000, callback: function() {this.attackBg.x = -100; this.attackBg.y = -100; this.state = this.states.MOVE;}, callbackScope: this, repeat: 0});
    }
    
    playAnimation(animName){
        if(this.direction == 1)
            this.play(animName + "Right", true);
        else
             this.play(animName + "Left", true);   
    }
}