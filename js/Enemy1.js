class Enemy1 extends Phaser.Physics.Arcade.Sprite{
    
    constructor(scene, positionX, positionY){
        super(scene, positionX, positionY, "enemy1Walk").setOrigin(0.5); 
             
        this.states = {
            NONE: 0,
            MOVE: 1,
            ATTACK: 2,
            CHARGE: 3,
            JUMP: 4,
            DEATH: 5
        }  
        
        this.state = this.states.NONE;
        
        // Init Animations
        this.createAnims(scene);
        
        // Add to scene with his current physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.gravity.y = 200;
        
        // Init particle
        this.particles = [];
        this.particles.push(scene.physics.add.sprite(-10,-10,"enemy1Particles"));
        this.particles.push(scene.physics.add.sprite(-10,-10,"enemy1Particles"));
        this.particles.push(scene.physics.add.sprite(-10,-10,"enemy1Particles"));
        this.particles.push(scene.physics.add.sprite(-10,-10,"enemy1Particles"));
        this.particles.push(scene.physics.add.sprite(-10,-10,"enemy1Particles"));
        
        this.particles.forEach(particle => {
            particle.body.allowGravity = false;
            particle.play("enemy1ParticlesRotation", true);
            scene.physics.add.overlap(scene.kirby, particle, (kirby) => {
                if (!kirby.isInvulnerable) {
                    scene.HUD.updateHealth();
                    kirby.hurt(this.body.center);
                }
            });
        });
        this.particleAngle = 0;
                
        // Variables
        this.walkSpeed = 0.5;
        this.direction = 1;
        this.actionTimer = 0;
        this.chargeTimer = 0;
        this.isDead = false;
        this.id = 0;
        this.world = scene.world;
        this.scene = scene;
    }
      
	preUpdate(time, delta){
        super.preUpdate(time, delta);
              
        switch(this.state){
            case this.states.NONE:
                this.state = this.states.MOVE;
                this.timer = this.scene.time.addEvent({delay: 3000, callback: this.selectAction, callbackScope: this, repeat: 0});
                break;
            case this.states.MOVE:
                this.playAnimation("enemy1Walk"); 
                this.move();
                break;
            case this.states.ATTACK:
                this.playAnimation("enemy1Attack");
                this.particleAngle += 4*this.direction;
                var i;
                for (i = 0; i < this.particles.length; i++){
                    this.particles[i].x = this.body.center.x + (12+8*i)*Math.cos((this.particleAngle-90-i*5*this.direction)*Math.PI/180);
                    this.particles[i].y = this.body.center.y + (12+8*i)*Math.sin((this.particleAngle-90-i*5*this.direction)*Math.PI/180);
                }
                if (this.particleAngle >= 135 || this.particleAngle <= -135) {
                    this.state = this.states.MOVE;
                    this.timer = this.scene.time.addEvent({delay: 3000, callback: this.selectAction, callbackScope: this, repeat: 0});
                    this.particleAngle = 0;
                    this.particles.forEach(particle => particle.x = particle.y = -10);
                }
                break;
            case this.states.CHARGE:
                this.playAnimation("enemy1Charge");
                break;
            case this.states.JUMP:
                this.move();
                if(this.body.velocity.y == 0 && this.world.checkWorldColliders(this.body.x,this.body.bottom+2)) {
                    this.state = this.states.MOVE;
                    this.timer = this.scene.time.addEvent({delay: 3000, callback: this.selectAction, callbackScope: this, repeat: 0});
                }
                else if (this.direction == 1)
                    this.setTexture("enemy1Walk", 12);
                else
                    this.setTexture("enemy1Walk", 4);
                break;
            case this.states.DEATH:
                break;
        }
    }
    
    createAnims(scene){
         // Walk
        scene.anims.create({
            key: "enemy1WalkRight",
            frames:
            scene.anims.generateFrameNumbers("enemy1Walk", {start: 8, end: 15}),
            frameRate: 8,
            repeat: -1
        }) 
        scene.anims.create({
            key: "enemy1WalkLeft",
            frames:
            scene.anims.generateFrameNumbers("enemy1Walk", {start: 0, end: 7}),
            frameRate: 8,
            repeat: -1
        })
        // Charge
        scene.anims.create({
            key: "enemy1ChargeRight",
            frames:
            scene.anims.generateFrameNumbers("enemy1Charge", {start: 2, end: 3}),
            frameRate: 15,
            repeat: -1
        }) 
        scene.anims.create({
            key: "enemy1ChargeLeft",
            frames:
            scene.anims.generateFrameNumbers("enemy1Charge", {start: 0, end: 1}),
            frameRate: 15,
            repeat: -1
        })
        // Attack
        scene.anims.create({
            key: "enemy1AttackRight",
            frames:
            scene.anims.generateFrameNumbers("enemy1Attack", {start: 2, end: 3}),
            frameRate: 15,
            repeat: -1
        }) 
        scene.anims.create({
            key: "enemy1AttackLeft",
            frames:
            scene.anims.generateFrameNumbers("enemy1Attack", {start: 0, end: 1}),
            frameRate: 15,
            repeat: -1
        })
        // Death
        scene.anims.create({
            key: "enemy1DeathRight",
            frames:
            scene.anims.generateFrameNumbers("enemy1Death", {start: 2, end: 3}),
            frameRate: 15,
            repeat: -1
        }) 
        scene.anims.create({
            key: "enemy1DeathLeft",
            frames:
            scene.anims.generateFrameNumbers("enemy1Death", {start: 0, end: 1}),
            frameRate: 15,
            repeat: -1
        })
        // Particles
        scene.anims.create({
            key: "enemy1ParticlesRotation",
            frames:
            scene.anims.generateFrameNumbers("enemy1Particles", {start: 0, end: 1}),
            frameRate: 15,
            repeat: -1
        })
    }
    
    selectAction(){
        if (Math.random() > 0.7) {
            // jump
            this.body.velocity.y = -170;
            this.state = this.states.JUMP;
        }
        else {
            // charge attack
            this.timer = this.scene.time.addEvent({delay: 1000, callback: 
                                                    function(){this.state = this.states.ATTACK; 
                                                    if(this.x > 0 && this.x < config.width)
                                                        this.scene.sound.play("enemy1AtackSound");}, 
                                                    callbackScope: this, repeat: 0});
            this.state = this.states.CHARGE;
        }
    }
    
    attack(){
        
    }
    
    death(kirbyPos, gettingAspired = false){
        if (!this.isDead) {
            this.isDead = true;
            this.state = this.states.DEATH;
            this.anims.stop();
            if(this.timer != null)
                this.timer.remove();
            this.particles.forEach(particle => {particle.x = -10; particle.y = -10;});
            this.playAnimation("enemy1Death", true);
            if (!gettingAspired) {
                this.body.velocity.x = (this.body.center.x - kirbyPos.x)*2;
                this.body.velocity.y = (this.body.center.y - kirbyPos.y)*2;
                this.scene.sound.play("throwHitSound");
                config.score += 600;
                this.scene.HUD.updateScore();
                this.scene.time.addEvent({delay: 500, callback: function(){this.scene.sound.play("enemyHitHability");this.particles.forEach(particle => particle.destroy());this.destroy();}, callbackScope: this, repeat: 0});
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
                    this.particles.forEach(particle => particle.destroy())}, callbackScope: this, repeat: 0});
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