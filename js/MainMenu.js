class MainMenu extends Phaser.Scene{
    constructor(){
        super({key: "MainMenu"});
    }
    preload(){ 
        var rutaImg = "assets/img/"
        this.load.image("background", rutaImg + "background1.png");
        this.load.spritesheet("kirbyLogo", rutaImg + "kirby-logo.png", { frameWidth: 240, frameHeight: 160 });
        this.load.audio("mainMusic", "assets/audio/Main_Title.mp3");
        config.transformation = 0;
        config.score = 0;
        config.lives = 2;
        config.health = 5;
    }
    
    create(){
        this.background = this.add.image(0,0,"background").setOrigin(0);        
        
        this.kirbyLogo = this.add.sprite(0, 0, "kirbyLogo").setOrigin(0);
        
        this.createAnims();
        this.kirbyLogo.anims.play("kirbyLogoBlink");
        
        this.mainAudio = this.sound.add("mainMusic",{loop:true});
        this.input.on('pointerdown', () => {
            if (!this.mainAudio.isPlaying)
                this.mainAudio.play();
        });
        this.input.keyboard.on('keydown', () => {
            this.mainAudio.stop();
            this.scene.start('Level1');
        });
    }
    
    update(){ 
        
    }
    
    createAnims(){
        this.anims.create({
            key: "kirbyLogoBlink",
            frames:
            this.anims.generateFrameNumbers("kirbyLogo", {start: 0, end: 1}),
            frameRate: 3,
            repeat: -1
        }) 
    }
    
}