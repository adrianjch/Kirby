class Tomato extends Phaser.Physics.Arcade.Sprite{
    
    constructor(scene, positionX, positionY){
        super(scene, positionX, positionY, "tomato").setOrigin(0.5); 
             
        // Add to scene with his current physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.gravity.y = 200;
        this.setDepth(1);
        
        scene.anims.create({
            key: "flickeringParticle",
            frames:
            scene.anims.generateFrameNumbers("powerUpsParticle", {start: 0, end: 1}),
            frameRate: 25,
            repeat: -1
        })
        
        // Init particle
        this.particle = scene.add.sprite(positionX,positionY,"powerUpsParticle");
        this.particle.play("flickeringParticle", true);
        this.particle.setDepth(0);
                
        // Variables
        this.isDead = false;
        this.scene = scene;
        this.type = 'tomato';
    }
      
	preUpdate(time, delta){
        super.preUpdate(time, delta);
        
        this.particle.x = this.x;
        this.particle.y = this.y;
    }
}