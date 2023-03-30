class Enemy4 extends Phaser.Physics.Arcade.Sprite{
    
    constructor(scene, positionX, positionY){
        super(scene, positionX, positionY, "enemy4Walk").setOrigin(0.5); 
             
        this.states = {
            NONE: 0,
            MOVE: 1,
            ATTACK: 2,
            DEATH: 5
        }  
        
        this.state = this.states.NONE;
        this.setDepth(1);
        // Init Animations
        this.createAnims(scene);
                
        // Variables
        this.walkSpeed = 0.5;
        this.direction = 1;
        this.attackCheked = false;
        this.isDead = false;
        this.id = 3;
        
        //this.scene = scene; 
        this.world = scene.world;
        this.scene = scene;
        
        // Add to scene with his current physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Attack sprite
        this.attackSprite = scene.physics.add.sprite(-50,-50,"enemy4Attack1");
        this.attackSprite.setDepth(0); 
        this.attackSprite.body.setAllowGravity(false);
         scene.physics.add.overlap(scene.kirby, this.attackSprite, (kirby) => {
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
                this.checkAttack();
                this.playAnimation("enemy4Walk");
                this.move();         
                break;
            case this.states.ATTACK:              
                if(this.direction == 1) {
                    this.attackSprite.x = this.body.center.x + 20;
                }
                else{
                    this.attackSprite.x = this.body.center.x - 20;
                }
                
                this.attackSprite.y = this.body.center.y;    
                

                break;
            case this.states.DEATH:
                break;
        }
    }
    
    createAnims(scene){
        // Walk
        scene.anims.create({
            key: "enemy4WalkLeft",
            frames:
            scene.anims.generateFrameNumbers("enemy4Walk", {start: 0, end: 4}),
            frameRate: 8,
            repeat: -1
        }) 
        scene.anims.create({
            key: "enemy4WalkRight",
            frames:
            scene.anims.generateFrameNumbers("enemy4Walk", {start: 5, end: 9}),
            frameRate: 8,
            repeat: -1
        })
        
        scene.anims.create({
            key: "enemy4AttackRight",
            frames:
            scene.anims.generateFrameNumbers("enemy4Attack", {start: 4, end: 7}),
            frameRate: 10,
            repeat: 5
        }) 
        scene.anims.create({
            key: "enemy4AttackLeft",
            frames:
            scene.anims.generateFrameNumbers("enemy4Attack", {start: 0, end: 3}),
            frameRate: 10,
            repeat: 5
        }) 
        scene.anims.create({
            key: "enemy4DeathRight",
            frames:
            scene.anims.generateFrameNumbers("enemy4Death", {start: 0, end: 1}),
            frameRate: 1,
            repeat: -1
        }) 
        scene.anims.create({
            key: "enemy4DeathLeft",
            frames:
            scene.anims.generateFrameNumbers("enemy4Death", {start: 1, end: 2}),
            frameRate: 1,
            repeat: -1
        }) 
        scene.anims.create({
            key: "enemy4AttackSprite",
            frames:
            scene.anims.generateFrameNumbers("enemy4Attack1", {start: 0, end: 11}),
            frameRate: 20,
            repeat: -1
        }) 
    }
       
    death(kirbyPos, gettingAspired = false){
         if (!this.isDead) {
            this.isDead = true;
            this.state = this.states.DEATH;
            this.anims.stop();
             
            if(this.attackTimer != null){
                this.attackTimer.remove();
            }
             
            if(this.attackTimer2 != null){
                this.attackTimer2.remove();
            }
             
            this.playAnimation("enemy4Death", true);
            if (!gettingAspired) {
                this.body.velocity.x = (this.body.center.x - kirbyPos.x)*2;
                this.body.velocity.y = (this.body.center.y - kirbyPos.y)*2;
                this.scene.sound.play("throwHitSound");
                config.score += 600;
                this.scene.HUD.updateScore();
                this.scene.time.addEvent({delay: 500, callback: function(){this.scene.sound.play("enemyHitHability"); this.attackSprite.destroy(); this.destroy();}, callbackScope: this, repeat: 0});
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
                    this.destroy();}, callbackScope: this, repeat: 0});
            }
        }
    }
    
    checkAttack(){
        var dist = Phaser.Math.Distance.Between(this.scene.kirby.body.center.x, this.scene.kirby.body.center.y, this.body.center.x, this.body.center.y);
        if(dist < 100 && !this.attackCheked){     
            this.attackCheked = true;
            this.attackTimer = this.scene.time.addEvent({delay: 3000, callback: function(){
                this.state = this.states.ATTACK;   
                this.attackSprite.play("enemy4AttackSprite");
                this.playAnimation("enemy4Attack");
                if(this.x > 0 && this.x < config.width)
                    this.scene.sound.play("enemy4AtackSound");
                
                this.attackTimer2 = this.scene.time.addEvent({delay: 2000, callback: function() {                        
                    this.state = this.states.MOVE;   
                    this.attackSprite.x = -25;
                    this.attackSprite.y = -25;
                    this.attackCheked = false;}, callbackScope: this, repeat: 0});
            }, callbackScope: this, repeat: 0});
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

    }
    
    playAnimation(animName){
        if(this.direction == 1)
            this.play(animName + "Right", true);
        else
             this.play(animName + "Left", true);   
    }
}