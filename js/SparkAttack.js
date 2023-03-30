class SparkAttack extends Phaser.Physics.Arcade.Sprite{
    
    constructor(scene, positionX, positionY){
        super(scene, -50, -config.height, "enemy2Attack");
        this.setOrigin(0.5);  
        this.setScale(1.25);
        
        this.createAnims(scene);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.setDepth(0); 
    }
    
	preUpdate(time, delta){        
        super.preUpdate(time, delta);
	}
    
    createAnims(scene){
        scene.anims.create({
            key: "sparkAttackBg",
            frames:
            scene.anims.generateFrameNumbers("enemy2Attack", {start: 0, end: 5}),
            frameRate: 15,
            repeat: -1
        }) 
    }
    
    attack(kirby){ 
        this.x = kirby.body.center.x;
        this.y = kirby.body.center.y + 5;
        this.play("sparkAttackBg", true);    
    }
}