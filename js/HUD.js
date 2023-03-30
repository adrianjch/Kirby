class HUD extends Phaser.GameObjects.Image{
    constructor(scene){
        super(scene, 0,config.height + 45, "fireIcon").setOrigin(0,1); 
        this.iconIn = false;
        this.iconOut = false;
        this.noIcon = false;
        
        this.scene = scene;
        this.animVelocity = 5;
        this.setDepth(5); 
        scene.add.existing(this);
        
        this.health = scene.add.sprite(125,158,"kirbyHealth").setOrigin(0.5,1); 
        this.health.setFrame(config.health);
        
        this.miniKirby = scene.add.image(65,158,"kirbyMini").setOrigin(0.5,1); 
        
        this.scoreText = scene.add.text(config.width+1, config.height+1, '', { fontFamily: "fontScore", fontSize: 16, color:"#ff0", stroke:"#000", strokeThickness:2, resolution:5 }).setOrigin(1,1);
        this.livesText = scene.add.text(80, config.height+1, '', { fontFamily: "fontScore", fontSize: 16, color:"#ff0", stroke:"#000", strokeThickness:2, resolution:5 }).setOrigin(0,1);
        
        this.scoreText.setText(Phaser.Utils.String.Pad(config.score,8,"0",1));
        this.livesText.setText(Phaser.Utils.String.Pad(config.lives,2,"0",1));
    }
    
    preUpdate(time, delta){        
            
        if(this.iconIn){
            this.iconInAnimation();
        }
        else if(this.iconOut){
            this.iconOutAnimation();
        }
	}
    
    iconInAnimation(){
        this.y -= this.animVelocity;
        if(this.y <= config.height){
            this.iconIn = false;
            this.enemyTimer = this.scene.time.addEvent({delay: 3000, callback: function(){ this.iconOut = true;}, callbackScope: this, repeat:0});
        }  
    }
    
    iconOutAnimation(){
        this.y += this.animVelocity;
        var y = config.height+32;
        
        if(this.noIcon)
          var y = config.height + 45;
        
        if(this.y >= y){
            this.iconOut = false;
            this.noIcon = false;
            this.y = y;
        } 
    }
           
    showIcon(){
        switch(this.scene.kirby.transformation){
            case this.scene.kirby.transformations.NORMAL:
                this.iconOut = true;
                this.iconIn = false;
                this.noIcon = true;
                if(this.enemyTimer != null)
                    this.enemyTimer.destroy();
                break;
            case this.scene.kirby.transformations.BEAM:
                console.log("Beam");
                this.setTexture("beamIcon");
                this.iconIn = true;
                break;
            case this.scene.kirby.transformations.SPARK:
                this.setTexture("sparkIcon");
                this.iconIn = true;
                break;
            case this.scene.kirby.transformations.FIRE:
                this.setTexture("fireIcon");
                this.iconIn = true;
                break;
        }
    }
    
    updateHealth(){
        if (config.health > 0) {
            config.health--;
            this.health.setFrame(config.health);
        }
        else{
            if(config.lives > 0){
                config.lives--;
                config.health = 5;
                this.scene.mainAudio.stop();
                config.transformation = 0;
                this.scene.scene.start('Level' + config.level);
            }
            else {
                this.scene.scene.start('GameOver');
                this.scene.sound.play('gameOverMusic');
                this.scene.mainAudio.stop();
            }
        }
    }
    tomatoHealth(type){
        if (type == 'tomato'){
            config.health = 5;
            this.health.setFrame(config.health);
        }
        else
            config.lives += 1;
            this.scoreText.setText(Phaser.Utils.String.Pad(config.score,8,"0",1));
            this.livesText.setText(Phaser.Utils.String.Pad(config.lives,2,"0",1));
    }
    updateScore(){
        this.scoreText.setText(Phaser.Utils.String.Pad(config.score,8,"0",1));
        //config.score += 300; //xuclar enemic
        //config.score += 200; //xuclar enemic sense atack
        //config.score += 600; //matar amb habilitat
        //config.score += 400; //matar amb habilitat enemic sense atack
    }
}