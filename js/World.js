class World extends Phaser.GameObjects.Group {
    constructor(scene, levelNumber){
        super(scene);
        this.background = scene.add.image(0,0,levelNumber == 1 ? "background1" : "background2").setOrigin(0);
        this.level = scene.add.image(0,0,"level"+levelNumber).setOrigin(0);
        
        if(config.level == 1){
            this.exitDoor = scene.physics.add.image(968,80,"empty").setOrigin(0).setScale(15,30);
        }
        else if(config.level == 2){
            this.exitDoor = scene.physics.add.image(968,95,"empty").setOrigin(0).setScale(15,30);
        }
        else if(config.level == 3){
            this.exitDoor = scene.physics.add.image(952,30,"empty").setOrigin(0).setScale(15,30);
            this.water = scene.physics.add.image(450,100,"empty").setOrigin(0).setScale(140,40);
            this.water.body.allowGravity = false;
            this.water.body.immovable = true;
            this.water.alpha = 0;
        } 
        
        this.exitDoor.body.allowGravity = false;
        this.exitDoor.body.immovable = true;
        this.exitDoor.alpha = 0;
    }

    checkWorldColliders(x, y){
        for (var i = 0; i < this.getLength(); i++){
            if(this.getFirstNth(i, true).body.hitTest(x, y))
                return true;
        }
        return false;
    }
    
    move(scene, inc){
        this.incX(inc);
        this.level.x += inc;
        this.background.x += inc/6.4;
        this.exitDoor.x += inc;
        
        if(this.water != null){
            this.water.x += inc;
        }
    }
    
    static getWorldWidth(){
        return 1008;
    }
}