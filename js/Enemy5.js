class Enemy5 extends Phaser.Physics.Arcade.Sprite{
    
    constructor(scene, positionX, positionY){
        super(scene, positionX, positionY, "enemy5Fly").setOrigin(0.5); 
             
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
        this.direction = -1;
        this.isDead = false;
        this.id = 4;
        
        //this.scene = scene; 
        this.world = scene.world;
        this.scene = scene;
        
        // Add to scene with his current physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
    }
      
	preUpdate(time, delta){
        super.preUpdate(time, delta);
        
        switch(this.state){
            case this.states.NONE:
                this.state = this.states.MOVE;
                break;
            case this.states.MOVE:
                this.move(time);
                this.playAnimation("enemy5Fly");
                break;
            case this.states.DEATH:
                break;
        }
    }
    
    createAnims(scene){
        // Walk
        scene.anims.create({
            key: "enemy5FlyRight",
            frames:
            scene.anims.generateFrameNumbers("enemy5Fly", {start: 8, end: 15}),
            frameRate: 8,
            repeat: -1
        }) 
        scene.anims.create({
            key: "enemy5FlyLeft",
            frames:
            scene.anims.generateFrameNumbers("enemy5Fly", {start: 0, end: 7}),
            frameRate: 8,
            repeat: -1
        })
        
        // Death
        scene.anims.create({
            key: "enemy5DeathRight",
            frames:
            scene.anims.generateFrameNumbers("enemy5Death", {start: 1, end: 1}),
            frameRate: 8,
            repeat: -1
        }) 
        scene.anims.create({
            key: "enemy5DeathLeft",
            frames:
            scene.anims.generateFrameNumbers("enemy5Death", {start: 0, end: 0}),
            frameRate: 8,
            repeat: -1
        })
    }
    
    death(kirbyPos, gettingAspired = false){
        if (!this.isDead) {
            this.isDead = true;
            this.state = this.states.DEATH;
            this.anims.stop();
            
            this.playAnimation("enemy5Death");
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
    
    move(time){       
        if(this.direction == 1){
            if (this.body.right >= this.world.level.x+World.getWorldWidth()){
                this.direction = -this.direction;
            } 
        }
        else{
            if (this.body.left <= this.world.level.x){
                this.direction = -this.direction;
            } 
        }
        
        this.y = 30 + 20*Math.sin((time/4)*Math.PI/180);
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