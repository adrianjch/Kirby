class Apple extends Phaser.Physics.Arcade.Sprite{
    
    constructor(scene, positionX, positionY){
        super(scene, positionX, positionY, "apple").setOrigin(0.5); 
             
        // Add to scene with his current physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.gravity.y = 200;
        this.setDepth(1);
        
        // Init particle
        this.particle = scene.add.sprite(positionX,positionY,"powerUpsParticle");
        this.particle.play("flickeringParticle", true);
        this.particle.setDepth(0);
        // Variables
        this.isDead = false;
        this.scene = scene;
        this.type = 'apple';
    }
      
	preUpdate(time, delta){
        super.preUpdate(time, delta);
        
        this.particle.x = this.x;
        this.particle.y = this.y;
    }
}