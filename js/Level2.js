class Level2 extends Phaser.Scene{
    constructor(){
        super({key: "Level2"});
    }
    preload(){       
        Load.level(this, 2);
    }
    
    //////////////////////////////////////////////////////////////////////////
    
    create(){
        config.level = 2;
        
        // Colliders
        this.world = new World(this, 2);
        this.loadWorldColliders();
        
        this.loadSounds();
        
        // Player
        this.kirby = new Kirby(this, 13, 80);
        this.HUD = new HUD(this);
        
        this.physics.add.overlap(this.kirby, this.world.exitDoor, (attack, enemy) => {
            if(Phaser.Input.Keyboard.JustDown(this.cursores.up)){
                config.transformation = this.kirby.transformation;
                this.mainAudio.stop();
                this.sound.play("swimSound");
                this.scene.start('Level3');
            }
        });
        
        //powerUps
        this.loadPowerUps();
        
        // Enemies
        this.loadEnemies();
        
        this.physics.add.collider(this.kirby, this.world);
        this.physics.add.collider(this.enemies, this.world);
        this.physics.add.overlap(this.kirby.airAttack, this.enemies, (attack, enemy) => {
            enemy.death(attack.body.center);
            attack.y = -config.height;
        });
        /*this.physics.add.overlap(this.kirby.airAttack, this.world, (attack, world) => {
            attack.y = -config.height;
        });*/
        this.kirby.particles.forEach(particle => {
            particle.body.allowGravity = false;
            this.physics.add.overlap(this.enemies, particle, (enemy) => {
                enemy.death(this.kirby.body.center);
            });
        });
        this.physics.add.overlap(this.kirby.sparkAttack, this.enemies, (attack, enemy) => {
            enemy.death(attack.body.center);
        });
        this.physics.add.overlap(this.kirby.fireAttack, this.enemies, (attack, enemy) => {
            enemy.death(attack.body.center);
        });
        this.physics.add.overlap(this.kirby, this.enemies, (kirby, enemy) => {
            if (!kirby.isInvulnerable && !enemy.isDead) {
                kirby.hurt(enemy.body.center);
                this.HUD.updateHealth();
            }
            enemy.death(kirby.body.center);
        });
        
        //powerups
        this.physics.add.collider(this.powerUps, this.world);
        this.physics.add.overlap(this.kirby, this.powerUps, (attack, powerUp) => {
            this.HUD.tomatoHealth(powerUp.type);
            powerUp.particle.destroy();
            powerUp.destroy();
            //poweUp destroy + pujar la vida
        });
        
        // Controls
        this.cursores = this.input.keyboard.createCursorKeys();   
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.e = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.shift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    }
      
    //////////////////////////////////////////////////////////////////////////
    loadWorldColliders(){
        var collider = this.physics.add.image(92,90,"empty").setOrigin(0).setScale(40,5);
        collider.body.checkCollision.down = false;
        this.world.add(collider);
        collider = this.physics.add.image(156,74,"empty").setOrigin(0).setScale(40,5);
        collider.body.checkCollision.down = false;
        this.world.add(collider);
        collider = this.physics.add.image(220,58,"empty").setOrigin(0).setScale(40,5);
        collider.body.checkCollision.down = false;
        this.world.add(collider);
        
        this.world.add(this.physics.add.image(0,122,"empty").setOrigin(0).setScale(668,10));
        this.world.add(this.physics.add.image(794,74,"empty").setOrigin(0).setScale(10,86));
        this.world.add(this.physics.add.image(370,75,"empty").setOrigin(0).setScale(12,47));
        this.world.add(this.physics.add.image(522,107,"empty").setOrigin(0).setScale(16,15));
        this.world.add(this.physics.add.image(538,91,"empty").setOrigin(0).setScale(16,31));
        this.world.add(this.physics.add.image(554,75,"empty").setOrigin(0).setScale(12,47));
        this.world.add(this.physics.add.image(668,90,"empty").setOrigin(0).setScale(10,70));
        this.world.add(this.physics.add.image(685,138,"empty").setOrigin(0).setScale(6,12));
        this.world.add(this.physics.add.image(717,138,"empty").setOrigin(0).setScale(6,12));
        this.world.add(this.physics.add.image(749,138,"empty").setOrigin(0).setScale(6,12));
        this.world.add(this.physics.add.image(781,138,"empty").setOrigin(0).setScale(6,12));
        this.world.add(this.physics.add.image(794,74,"empty").setOrigin(0).setScale(12,86));
        this.world.add(this.physics.add.image(806,91,"empty").setOrigin(0).setScale(16,31));
        this.world.add(this.physics.add.image(822,107,"empty").setOrigin(0).setScale(16,15));
        this.world.add(this.physics.add.image(804,122,"empty").setOrigin(0).setScale(204,10));
        
        for (var i = 0; i < this.world.getLength(); i++){
            var current = this.world.getFirstNth(i, true);
            current.body.allowGravity = false;
            current.body.immovable = true;
            current.alpha = 0;
        }
    }
    
    loadSounds(){
        //so de Xuclar que no se com tractr-lo
        this.xuclarAudio = this.sound.add("xuclarSound",{loop:true});
        this.specialAtack2Audio = this.sound.add("specialAtack2Sound",{loop:true});
        this.specialAtack4Audio = this.sound.add("specialAtack4Sound",{loop:true});
        
        this.mainAudio = this.sound.add("mainMusic2",{loop:true, volume:0.1});
        this.mainAudio.play();
        
    }
    
    loadPowerUps(){
        this.powerUps = this.add.group();
        this.powerUps.add(new Tomato(this, 580, 100));
        this.powerUps.add(new Apple(this, 755, 60));
    }
    
    loadEnemies(){
        this.enemies = this.add.group();
        this.enemies.add(new Enemy3(this, 200, 80));
        this.enemies.add(new Enemy2(this, 400, 30));
        this.enemies.add(new Enemy5(this, 400, 70));
        this.enemies.add(new Enemy3(this, 450, 70));
        this.enemies.add(new Enemy4(this, 600, 70));
        this.enemies.add(new Enemy5(this, 900, 70));
        this.enemies.add(new Enemy2(this, 900, 70));
    }
    
    update(){             
        // Moviment cap a l'esquerra
        if(this.cursores.left.isDown){
            if(this.world.level.x < 0 && this.kirby.x <= config.width/2) {
                if (!this.world.checkWorldColliders(this.kirby.body.left-this.kirby.walkSpeed, this.kirby.body.bottom-1)){         
                    this.world.move(this, this.kirby.getStateMovingSpeed());
                    this.enemies.incX(this.kirby.getStateMovingSpeed());
                    this.powerUps.incX(this.kirby.getStateMovingSpeed());
                }
            }
            else{ //kirby descentrat es mou del cntre de la pantalla
                this.kirby.x -= this.kirby.getStateMovingSpeed();
            }
        }
        // Moviment cap a la dreta
        else if(this.cursores.right.isDown) {
            if(this.world.level.x > -(World.getWorldWidth()-config.width) && this.kirby.x >= config.width/2) {
                if (!this.world.checkWorldColliders(this.kirby.body.right+this.kirby.walkSpeed, this.kirby.body.bottom-1)) {
                    this.world.move(this, -this.kirby.getStateMovingSpeed());
                    this.enemies.incX(-this.kirby.getStateMovingSpeed());
                    this.powerUps.incX(-this.kirby.getStateMovingSpeed());
                }
            }
            else { //kirby descentrat es mou del cntre de la pantalla
                this.kirby.x += this.kirby.getStateMovingSpeed();
            }
        }
    }  
}