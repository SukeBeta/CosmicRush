/**
 * Created by Hosuke on 19/09/15.
 */

BasicGame.Menu = function(game) {

};

BasicGame.Menu.prototype = {
    create: function() {
        this.game.stage.backgroundColor = '#323A45';

        var w = 320;
        var h = 400;

        var logo = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 50, 'COSMIC RUSH', { font: '50px Arial', fill: '#fff' });
        logo.anchor.setTo(0.5, 0.5);
        logo.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
        this.game.add.tween(logo).to({ y: h / 2 - 100 }, 1500, Phaser.Easing.Bounce.Out).start();

        this.cursor = this.game.input.keyboard.createCursorKeys();
        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.mousePointer = this.game.input.mousePointer;
        this.pointer = this.game.input.pointer1;

        var text;
        if(this.game.device.desktop){
            text = 'press the space to start';
            var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            spaceKey.onDown.addOnce(this.start,this);
        }else {
            text = 'touch the screen to start';
            this.game.input.onDown.addOnce(this.start, this);
        }

        var startLabel = this.game.add.text(this.game.world.centerX, this.game.world.height-80,text,{font:'25px Arial',fill:'#ff4040'});
        startLabel.anchor.setTo(0.5,0.5);


    },

    start: function() {
        this.game.state.start('Game');
    }
};
