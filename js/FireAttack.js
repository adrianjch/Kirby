class FireAttack extends Phaser.Physics.Arcade.Sprite{
    
    constructor(scene, positionX, positionY){
        super(scene, -50, -config.height, "fireKirbyAttack1");
        this.setOrigin(0.5);  
        this.setScale(1.25);
        
        this.createAnims(scene);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.setDepth(1); 
        
        this.attackSpriteBg = scene.physics.add.sprite(-50,-config.height,"fireKirbyAttack1");
        this.attackSpriteBg.setDepth(2); 
        this.attackSpriteBg.body.setAllowGravity(false);
        
    }
    
	preUpdate(time, delta){        
        super.preUpdate(time, delta);
	}
    
    createAnims(scene){
        scene.anims.create({
            key: "fireKirbyAttack1Right",
            frames:
            scene.anims.generateFrameNumbers("fireKirbyAttack1", {start: 0, end: 6}),
            frameRate: 15,
            repeat: -1
        }) 
        scene.anims.create({
            key: "fireKirbyAttack1Left",
            frames:
            scene.anims.generateFrameNumbers("fireKirbyAttack1", {start: 14, end: 20}),
            frameRate: 15,
            repeat: -1
        }) 
        scene.anims.create({
            key: "fireKirbyAttack2Right",
            frames:
            scene.anims.generateFrameNumbers("fireKirbyAttack1", {start: 7, end: 13}),
            frameRate: 15,
            repeat: -1
        }) 
        scene.anims.create({
            key: "fireKirbyAttack2Left",
            frames:
            scene.anims.generateFrameNumbers("fireKirbyAttack1", {start: 21, end: 27}),
            frameRate: 15,
            repeat: -1
        }) 
    }
    
    attack(kirby){ 
        this.y = kirby.body.center.y;
        this.attackSpriteBg.y = kirby.body.center.y;
        if(kirby.direction == 1){
            this.play("fireKirbyAttack1Right", true);  
            this.attackSpriteBg.play("fireKirbyAttack2Right", true);  
            this.x = kirby.body.center.x + 30;
            this.attackSpriteBg.x = this.x;
        }
        else{
            this.play("fireKirbyAttack1Left", true);  
            this.attackSpriteBg.play("fireKirbyAttack2Left", true); 
            this.x = kirby.body.center.x - 30;
            this.attackSpriteBg.x = this.x;
        }
          
    }
}