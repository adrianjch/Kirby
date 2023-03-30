var config = {
    transformation: 0,
    score: 0,
    lives: 2,
    health: 5,
    level: 0,
    type: Phaser.AUTO,
    width: 240,
    height: 160,
    scene: [MainMenu, Level1, Level2, Level3, Credits, GameOver],
    antialias: false,
    render: {pixelArt: true}, //Optimitza la execucio per pixelArt
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH  
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 200},
            checkCollision: {
                up: true,
                down: false,
                left: true,
                right: true
            },
            debug: false
        }
    },
};

var juego = new Phaser.Game(config);

