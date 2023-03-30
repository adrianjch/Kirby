class AirAttack extends Phaser.Physics.Arcade.Sprite{
    
    constructor(scene, positionX, positionY){
        super(scene, 0, -config.height, "airAttack");
        this.setOrigin(0.5);  
        
        this.createAnims(scene);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.setDepth(2);
    }
    
	preUpdate(time, delta){        
        super.preUpdate(time, delta);
	}
    
    createAnims(scene){
        scene.anims.create({
            key: "airAttackRight",
            frames:
            scene.anims.generateFrameNumbers("airAttack", {start: 0, end: 5}),
            frameRate: 15,
            repeat: 0
        }) 
        
        scene.anims.create({
            key: "airAttackLeft",
            frames:
            scene.anims.generateFrameNumbers("airAttack", {start: 6, end: 11}),
            frameRate: 15,
            repeat: 0
        }) 
        
        scene.anims.create({
            key: "throwEnemyRight",
            frames:
            scene.anims.generateFrameNumbers("starAttack", {start: 0, end: 5}),
            frameRate: 15,
            repeat: 6
        }) 
        
        scene.anims.create({
            key: "throwEnemyLeft",
            frames:
            scene.anims.generateFrameNumbers("starAttack", {start: 5, end: 0}),
            frameRate: 15,
            repeat: 6
        }) 
        
    }
    
    throwAir(kirby, throwEnemy){  
        this.x = kirby.body.center.x;
        this.y = kirby.body.center.y;
        if(kirby.direction == 1){
            if(throwEnemy == true){
                this.body.velocity.x = 150;
                this.play("throwEnemyRight", true);
            } else {
                this.body.velocity.x = 100;
                this.play("airAttackRight", true);
            }
        }
        else{
             if(throwEnemy == true){
                this.body.velocity.x = -150;
                this.play("throwEnemyLeft", true);
            } else {
                this.body.velocity.x = -100;
                this.play("airAttackLeft", true); 
            }  
        }
        
        this.once('animationcomplete', function() {this.y = -config.height;});
    }
}