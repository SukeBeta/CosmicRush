/**
 * Created by Hosuke on 19/09/15.
 */

BasicGame.Menu = function(game) {

};

var menu = {};

BasicGame.Menu.prototype = {
    create: function() {
        this.game.stage.backgroundColor = '#160b20';

        var w = 320;
        var h = 400;

        var logo = this.game.add.sprite(window.innerWidth / 2, 50, 'cosmicRush');
        logo.anchor.setTo(0.5, 0.5);
        if (!this.game.device.desktop) {
            logo.scale.setTo(1.5 ,1.5);
        }
        this.game.add.tween(logo).to({ y: window.innerHeight * 3 / 10 }, 1500, Phaser.Easing.Bounce.Out).start();

        this.cursor = this.game.input.keyboard.createCursorKeys();
        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.mousePointer = this.game.input.mousePointer;
        this.pointer = this.game.input.pointer1;

        var bulletinText = this.game.add.text(window.innerWidth / 2, window.innerHeight / 2 + 10 , bulletin, {
            font: '25px Arial', fill: '#fff',
            wordWrap: true, wordWrapWidth: 500
        });
        bulletinText.anchor.setTo(0.5, 0.5);

        if (highscore > 0) {
            var highscoreText = this.game.add.text(window.innerWidth / 2, window.innerHeight / 2 + 60 , 'High Score: ' + highscore , { font: '40px Arial', fill: '#fff' });
            highscoreText.anchor.setTo(0.5, 0.5);
        }

        if(this.game.device.desktop){
            var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            spaceKey.onDown.addOnce(this.start,this);
        }

        var startButtonLabel = this.game.add.button(window.innerWidth / 2, window.innerHeight * 4 / 5, 'startButton', this.start, this);
        startButtonLabel.anchor.setTo(0.5,0.5);
        if (!this.game.device.desktop) {
            startButtonLabel.scale.setTo(2 ,2);
        }

        // Starfield
        menu.distance = 300;
        menu.speed = 6;

        menu.max = 40;
        menu.xx = [];
        menu.yy = [];
        menu.zz = [];

        menu.sprites = this.game.add.spriteBatch();
        menu.stars = [];


        for (var i = 0; i < menu.max; i++)
        {
            menu.xx[i] = Math.floor(Math.random() * window.innerWidth) - window.innerWidth / 2;
            menu.yy[i] = Math.floor(Math.random() * window.innerHeight) - window.innerHeight / 2;
            menu.zz[i] = Math.floor(Math.random() * 1700) - 100;

            var star = this.game.make.sprite(0, 0, 'star');
            star.anchor.set(0.5);

            menu.sprites.addChild(star);

            menu.stars.push(star);

        }


    },

    update: function() {

        for (var i = 0; i < menu.max; i++)
        {
            menu.stars[i].perspective = menu.distance / (menu.distance - menu.zz[i]);
            menu.stars[i].x = window.innerWidth / 2 + menu.xx[i] * menu.stars[i].perspective;
            menu.stars[i].y = window.innerHeight / 2 + menu.yy[i] * menu.stars[i].perspective;

            menu.zz[i] += menu.speed;

            if (menu.zz[i] > 300)
            {
                menu.zz[i] -= 600;
            }

            menu.stars[i].alpha = Math.min(menu.stars[i].perspective / 2, 1);
            menu.stars[i].scale.set(menu.stars[i].perspective / 2);
            menu.stars[i].rotation += 0.1;

        }
    },

    start: function() {
        if (!restartLock) {
            this.game.state.start('Game');
        }
    }
};
