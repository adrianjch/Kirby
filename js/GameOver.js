class GameOver extends Phaser.Scene{
    constructor(){
        super({key: "GameOver"});
    }
    preload(){ 
         
    }
    
    create(){
        this.text = this.add.text(config.width/2, config.height*0.2, 'GAME OVER', { fontFamily: "fontScore", fontSize: 64, color:"#ffffff", stroke:"#000", strokeThickness:2, resolution:5 }).setOrigin(0.5);
        this.text.setAlign("center");
        
        this.exitText = this.add.text(config.width/2, config.height*0.9, 'Press space to exit', { fontFamily: "fontScore", fontSize: 16, color:"#ffffff", stroke:"#000", strokeThickness:2, resolution:5 }).setOrigin(0.5);
        this.exitText.setAlign("center");
        
        this.scoreText = this.add.text(config.width/2, config.height*0.5, '', { fontFamily: "fontScore", fontSize: 32, color:"#ff0", stroke:"#000", strokeThickness:2, resolution:5 }).setOrigin(0.5);
        
        this.scoreText.setText("SCORE: " + Phaser.Utils.String.Pad(config.score,8,"0",1));
        
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    
    update(){ 
        if(this.spaceBar.isDown){
            this.scene.start('MainMenu');
        }
    }   
}