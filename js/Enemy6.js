class Enemy6 extends Phaser.Physics.Arcade.Sprite{
    
    constructor(scene, positionX, positionY){
        super(scene, positionX, positionY, "enemy6Walk").setOrigin(0.5); 
             
        this.states = {
            NONE: 0,
            STAND: 1,
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
        this.isDead = false;
        this.canMove = true;
        this.id = 5;
        
        //this.scene = scene; 
        this.world = scene.world;
        this.scene = scene;
        
        // Add to scene with his current physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }
      
	preUpdate(time, delta){
        super.preUpdate(time, delta);
        
        switch(this.state){
            case this.states.NONE:
                this.state = this.states.STAND;
                this.playAnimation("enemy6Walk");
                break;
            case this.states.STAND:
                if(this.body.velocity.y == 0 && this.world.checkWorldColliders(this.body.x,this.body.bottom+2)) {
                    if(this.canMove) {
                        this.canMove = false;
                        this.moveTimer = this.scene.time.addEvent({delay: 300, callback: this.selectAction, callbackScope: this, repeat: 0});
                    }
                }
                break;
            case this.states.JUMP:
                this.move();
                if(this.body.velocity.y == 0 && this.world.checkWorldColliders(this.body.x,this.body.bottom+2)) {
                    this.state = this.states.STAND;
                }
                this.playAnimation("enemy6Walk");
                break;
            case this.states.DEATH:
                break;
        }
    }
    
    createAnims(scene){
        // Walk
        scene.anims.create({
            key: "enemy6WalkRight",
            frames:
            scene.anims.generateFrameNumbers("enemy6Walk", {start: 6, end: 11}),
            frameRate: 8,
            repeat: -1
        }) 
        scene.anims.create({
            key: "enemy6WalkLeft",
            frames:
            scene.anims.generateFrameNumbers("enemy6Walk", {start: 0, end: 5}),
            frameRate: 8,
            repeat: -1
        })
        
        // Death
        scene.anims.create({
            key: "enemy6DeathRight",
            frames:
            scene.anims.generateFrameNumbers("enemy6Death", {start: 1, end: 1}),
            frameRate: 8,
            repeat: -1
        }) 
        scene.anims.create({
            key: "enemy6DeathLeft",
            frames:
            scene.anims.generateFrameNumbers("enemy6Death", {start: 0, end: 0}),
            frameRate: 8,
            repeat: -1
        })
    }
    
    selectAction(){
        this.moveTimer.remove();
        this.canMove = true;
        var rand = Math.random();
        
        // jump
        this.body.velocity.y = -60;
        this.state = this.states.JUMP;
        if (rand < 0.5) {
            this.direction = 1;
        }
        else{
            this.direction = -1;
        }
    }
    
    death(kirbyPos, gettingAspired = false){
        if (!this.isDead) {
            this.isDead = true;
            this.state = this.states.DEATH;
            this.anims.stop();
            
            if(this.moveTimer != null)
                this.moveTimer.remove();
            
            this.playAnimation("enemy6Death");
            if (!gettingAspired) {
                this.body.velocity.x = (this.body.center.x - kirbyPos.x)*2;
                this.body.velocity.y = (this.body.center.y - kirbyPos.y)*2;
                this.scene.sound.play("throwHitSound");
                config.score += 400;
                this.scene.HUD.updateScore();
                this.scene.time.addEvent({delay: 500, callback: function(){this.scene.sound.play("enemyHitHability");this.destroy();}, callbackScope: this, repeat: 0});
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
                    config.score += 200;
                    this.scene.HUD.updateScore();
                    this.destroy();}, callbackScope: this, repeat: 0});
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
    
    playAnimation(animName){
        if(this.direction == 1)
            this.play(animName + "Right", true);
        else
             this.play(animName + "Left", true);   
    }
}