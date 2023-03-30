class Credits extends Phaser.Scene{
    constructor(){
        super({key: "Credits"});
    }
    preload(){ 
         
    }
    
    create(){ 
            
        this.title = this.add.text(config.width/2, config.height*0.2, '', { fontFamily: "fontScore", fontSize: 64, color:"#ffffff", stroke:"#000", strokeThickness:2, resolution:5 }).setOrigin(0.5).setSize(2);
        this.text = this.add.text(config.width/2, config.height*0.5, '', { fontFamily: "fontScore", fontSize: 16, color:"#ff0", stroke:"#000", strokeThickness:2, resolution:5 }).setOrigin(0.5);
        
        this.title.setText("CREDITS");
        this.text.setText("Francesc Balsells\nAndreu Hernanz\nAdrià Jiménez");
        this.text.setAlign("center");
        
        
        this.exitText = this.add.text(config.width/2, config.height*0.9, '', { fontFamily: "fontScore", fontSize: 16, color:"#ffffff", stroke:"#000", strokeThickness:2, resolution:5 }).setOrigin(0.5);
        this.exitText.setText('Press any key to exit');
        this.exitText.setAlign("center");
            
        this.input.keyboard.on('keydown', () => {
            this.scene.start('MainMenu');
        });
    }
    
    update(){ 
        
    }   
}