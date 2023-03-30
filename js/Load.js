        
class Load {
    static level(scene, num){
        var rutaImg = "assets/img/";
        // Kirby HUD
        scene.load.spritesheet("kirbyHealth", rutaImg + "Kirby-Health.png", { frameWidth: 43, frameHeight: 12 });
        scene.load.image("kirbyMini", rutaImg + "Kirby-MiniHp.png");

        scene.load.image("beamIcon", rutaImg + "Icon-Beam.png");
        scene.load.image("fireIcon", rutaImg + "Icon-Fire.png");
        scene.load.image("sparkIcon", rutaImg + "Icon-Spark.png");

        // Normal Kirby
        scene.load.spritesheet("kirbyWalk", rutaImg + "Kirby-Walk.png", { frameWidth: 22, frameHeight: 19 });
        scene.load.spritesheet("kirbyIdle", rutaImg + "Kirby-Idle.png", { frameWidth: 22, frameHeight: 19 });
        scene.load.spritesheet("kirbyJump", rutaImg + "Kirby-Jump.png", { frameWidth: 20, frameHeight: 20 });
        scene.load.spritesheet("kirbyLand", rutaImg + "Kirby-Land.png", { frameWidth: 22, frameHeight: 19 });
        scene.load.spritesheet("kirbyTakeAir", rutaImg + "Kirby-TakeAir.png", { frameWidth: 23, frameHeight: 19 });
        scene.load.spritesheet("kirbyRun", rutaImg + "Kirby-Run.png", { frameWidth: 24, frameHeight: 19 });
        scene.load.spritesheet("kirbyHurt", rutaImg + "Kirby-Hurt.png", { frameWidth: 22, frameHeight: 22 });
        scene.load.spritesheet("airAttack", rutaImg + "AirAttack.png", { frameWidth: 19, frameHeight: 19 });
        scene.load.spritesheet("starAttack", rutaImg + "Star.png", { frameWidth: 30, frameHeight: 30 });
        scene.load.spritesheet("kirbyTransform", rutaImg + "Kirby-Transform.png", { frameWidth: 30, frameHeight: 22 });

        scene.load.spritesheet("kirbyBigWalk", rutaImg + "KirbyBig-Walk.png", { frameWidth: 24, frameHeight: 24 });
        scene.load.spritesheet("kirbyBigThrowAir", rutaImg + "KirbyBig-ThrowAir.png", { frameWidth: 24, frameHeight: 24 });
        scene.load.spritesheet("kirbyBigIdle", rutaImg + "KirbyBig-Idle.png", { frameWidth: 25, frameHeight: 24 });
        scene.load.spritesheet("kirbyBigLand", rutaImg + "KirbyBig-Land.png", { frameWidth: 29, frameHeight: 31 });
        scene.load.spritesheet("kirbyBigFly", rutaImg + "KirbyBig-Fly.png", { frameWidth: 26, frameHeight: 25 });
        scene.load.spritesheet("kirbyBigJump", rutaImg + "KirbyBig-Jump.png", { frameWidth: 29, frameHeight: 24 });


        // Spark Kirby
        scene.load.spritesheet("sparkKirbyIdle", rutaImg + "SparkKirby-Idle.png", { frameWidth: 23, frameHeight: 35 });
        scene.load.spritesheet("sparkKirbyJump", rutaImg + "SparkKirby-Jump.png", { frameWidth: 23, frameHeight: 35 });
        scene.load.spritesheet("sparkKirbyWalk", rutaImg + "SparkKirby-Walk.png", { frameWidth: 23, frameHeight: 35 });
        scene.load.spritesheet("sparkKirbyTakeAir", rutaImg + "SparkKirby-TakeAir.png", { frameWidth: 23, frameHeight: 35 });
        scene.load.spritesheet("sparkKirbyBigThrowAir", rutaImg + "SparkKirby-ThrowAir.png", { frameWidth: 23, frameHeight: 35 });
        scene.load.spritesheet("sparkKirbyLand", rutaImg + "SparkKirby-Land.png", { frameWidth: 23, frameHeight: 35 });
        scene.load.spritesheet("sparkKirbyAttack", rutaImg + "SparkKirby-Attack.png", { frameWidth: 23, frameHeight: 35 });
        scene.load.spritesheet("sparkKirbyRun", rutaImg + "SparkKirby-Run.png", { frameWidth: 29, frameHeight: 35 });

        scene.load.spritesheet("sparkKirbyBigFly", rutaImg + "SparkKirbyBig-Fly.png", { frameWidth: 26, frameHeight: 40 });

        // Fire Kirby
        scene.load.spritesheet("fireKirbyIdle", rutaImg + "FireKirby-Idle.png", { frameWidth: 23, frameHeight: 35 });
        scene.load.spritesheet("fireKirbyJump", rutaImg + "FireKirby-Jump.png", { frameWidth: 23, frameHeight: 35 });
        scene.load.spritesheet("fireKirbyWalk", rutaImg + "FireKirby-Walk.png", { frameWidth: 23, frameHeight: 35 });
        scene.load.spritesheet("fireKirbyTakeAir", rutaImg + "FireKirby-TakeAir.png", { frameWidth: 23, frameHeight: 35 });
        scene.load.spritesheet("fireKirbyBigThrowAir", rutaImg + "FireKirby-ThrowAir.png", { frameWidth: 23, frameHeight: 35 });
        scene.load.spritesheet("fireKirbyLand", rutaImg + "FireKirby-Land.png", { frameWidth: 23, frameHeight: 35 });
        scene.load.spritesheet("fireKirbyAttack", rutaImg + "FireKirby-Attack.png", { frameWidth: 25, frameHeight: 35 });
        scene.load.spritesheet("fireKirbyAttack1", rutaImg + "FireKirby-Attack1.png", { frameWidth: 32, frameHeight: 32 });
        scene.load.spritesheet("fireKirbyRun", rutaImg + "FireKirby-Run.png", { frameWidth: 29, frameHeight: 35 });

        scene.load.spritesheet("fireKirbyBigFly", rutaImg + "FireKirbyBig-Fly.png", { frameWidth: 26, frameHeight: 40 });

        // Beam Kirby
        scene.load.spritesheet("beamKirbyIdle", rutaImg + "BeamKirby-Idle.png", { frameWidth: 25, frameHeight: 25 });
        scene.load.spritesheet("beamKirbyWalk", rutaImg + "BeamKirby-Walk.png", { frameWidth: 28, frameHeight: 25 });
        scene.load.spritesheet("beamKirbyJump", rutaImg + "BeamKirby-Jump.png", { frameWidth: 25, frameHeight: 25 });
        scene.load.spritesheet("beamKirbyTakeAir", rutaImg + "BeamKirby-TakeAir.png", { frameWidth: 25, frameHeight: 26 });
        scene.load.spritesheet("beamKirbyBigThrowAir", rutaImg + "BeamKirby-ThrowAir.png", { frameWidth: 25, frameHeight: 26 });
        scene.load.spritesheet("beamKirbyLand", rutaImg + "BeamKirby-Land.png", { frameWidth: 25, frameHeight: 35 });
        scene.load.spritesheet("beamKirbyRun", rutaImg + "BeamKirby-Run.png", { frameWidth: 31, frameHeight: 25 });
        scene.load.spritesheet("beamKirbyAttack", rutaImg + "BeamKirby-Attack.png", { frameWidth: 30, frameHeight: 28 });
        scene.load.image("beamKirbyParticle", rutaImg + "BeamKirbyBall.png");

        scene.load.spritesheet("beamKirbyBigFly", rutaImg + "BeamKirbyBig-Fly.png", { frameWidth: 26, frameHeight: 31 });

        // Swim Kirby
        scene.load.spritesheet("swimKirbySwim", rutaImg + "KirbySwim-Swim.png", { frameWidth: 29, frameHeight: 21 });

        // Enemy 1
        scene.load.spritesheet("enemy1Walk", rutaImg + "Enemy1-Walk.png", { frameWidth: 23, frameHeight: 22 });
        scene.load.spritesheet("enemy1Attack", rutaImg + "Enemy1-Attack.png", { frameWidth: 23, frameHeight: 22 });
        scene.load.spritesheet("enemy1Charge", rutaImg + "Enemy1-Charge.png", { frameWidth: 23, frameHeight: 22 });
        scene.load.spritesheet("enemy1Death", rutaImg + "Enemy1-Death.png", { frameWidth: 23, frameHeight: 22 });
        scene.load.spritesheet("enemy1Particles", rutaImg + "Enemy1-Particles.png", { frameWidth: 15, frameHeight: 15 });

        // Enemy 2
        scene.load.spritesheet("enemy2Walk", rutaImg + "Enemy2-Walk.png", { frameWidth: 24, frameHeight: 19 });
        scene.load.spritesheet("enemy2Charge", rutaImg + "Enemy2-Charge.png", { frameWidth: 24, frameHeight: 19 });
        scene.load.spritesheet("enemy2Death", rutaImg + "Enemy2-Death.png", { frameWidth: 24, frameHeight: 19 });
        scene.load.spritesheet("enemy2Attack", rutaImg + "Enemy2-Attack.png", { frameWidth: 48, frameHeight: 48 });

        // Enemy 4
        scene.load.spritesheet("enemy4Walk", rutaImg + "Enemy4-Walk.png", { frameWidth: 23, frameHeight: 23 });
        scene.load.spritesheet("enemy4Attack", rutaImg + "Enemy4-Attack.png", { frameWidth: 23, frameHeight: 23 });
        scene.load.spritesheet("enemy4Death", rutaImg + "Enemy4-Death.png", { frameWidth: 23, frameHeight: 23 });
        scene.load.spritesheet("enemy4Attack1", rutaImg + "Enemy4-Attack1.png", { frameWidth: 25, frameHeight: 25 });

        // Enemy 3
        scene.load.spritesheet("enemy3Walk", rutaImg + "Enemy3-Walk.png", { frameWidth: 22, frameHeight: 20 });
        scene.load.spritesheet("enemy3Death", rutaImg + "Enemy3-Death.png", { frameWidth: 21, frameHeight: 18 });

        // Enemy 5
        scene.load.spritesheet("enemy5Fly", rutaImg + "Enemy5-Fly.png", { frameWidth: 24, frameHeight: 21 });
        scene.load.spritesheet("enemy5Death", rutaImg + "Enemy5-Death.png", { frameWidth: 24, frameHeight: 21 });

        // Enemy 6
        scene.load.spritesheet("enemy6Walk", rutaImg + "Enemy6-Walk.png", { frameWidth: 22, frameHeight: 26 });
        scene.load.spritesheet("enemy6Death", rutaImg + "Enemy6-Death.png", { frameWidth: 22, frameHeight: 26 });

        // PowerUps
        scene.load.spritesheet("tomato", rutaImg + "Tomato.png", { frameWidth: 20, frameHeight: 20 });
        scene.load.spritesheet("apple", rutaImg + "Apple.png", { frameWidth: 20, frameHeight: 20 });
        scene.load.spritesheet("powerUpsParticle", rutaImg + "PowerUpsParticle.png", { frameWidth: 35, frameHeight: 35 });

        // Background Sounds
        scene.load.audio("mainMusic2", "assets/audio/Vegetable_Valley.mp3");
        scene.load.audio("gameOverMusic", "assets/audio/GameOver_Music.mp3");

        // Kirby Sounds
        scene.load.audio("jumpSound", "assets/audio/Jump_Sound.mp3");
        scene.load.audio("jumpFlySound", "assets/audio/Fly_Jump_Sound.mp3");
        scene.load.audio("fallToGroundSound", "assets/audio/Fall_to_Ground_Sound.mp3");
        scene.load.audio("startRunningSound", "assets/audio/Start_Running_Sound.mp3");

        scene.load.audio("xuclarSound", "assets/audio/Xuclar_Sound.mp3");
        scene.load.audio("throwSound", "assets/audio/Throw_Enemy_Sound.mp3");
        scene.load.audio("throwAirSound", "assets/audio/Throw_Air_Sound.mp3");
        scene.load.audio("throwHitSound", "assets/audio/Throw_Hit_Sound.mp3");
        scene.load.audio("swallowSound", "assets/audio/Swallow_Sound.mp3");

        scene.load.audio("transformation1Sound", "assets/audio/Transformation_1_Sound.mp3");
        scene.load.audio("specialAtack1Sound", "assets/audio/Special_Atack_1_Sound.mp3");
        scene.load.audio("specialAtack2Sound", "assets/audio/Special_Atack_2_Sound.mp3");
        scene.load.audio("specialAtack4Sound", "assets/audio/Special_Atack_4_Sound.mp3");

        scene.load.audio("enemy1AtackSound", "assets/audio/Enemy1_Atack_Sound.mp3");
        scene.load.audio("enemy2AtackSound", "assets/audio/Enemy2_Atack_Sound.mp3");
        scene.load.audio("enemy4AtackSound", "assets/audio/Enemy4_Atack_Sound.mp3");
        scene.load.audio("enemyHitHability", "assets/audio/Enemy_Hit_Hability_Sound.mp3");
        scene.load.audio("enemyHitMele", "assets/audio/Enemy_Hit_Mele_Sound.mp3");

        scene.load.audio("swimSound", "assets/audio/Swim_Sound.mp3");
        
        // Level
        scene.load.image("level" + num, rutaImg + "level" + num + ".png");
        scene.load.image("empty", rutaImg + "empty.png");
        
        if(num == 3 || num == 2)
            scene.load.image("background2", rutaImg + "background2.png");
        else
            scene.load.image("background1", rutaImg + "background1.png");
        
        scene.load.image("transformationPNG", rutaImg + "transformationPNG.png");
    }
}