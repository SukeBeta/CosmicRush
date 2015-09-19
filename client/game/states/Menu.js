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

        var logo = this.game.add.text(w / 2, -170, 'COSMIC RUSH', { font: '50px Arial', fill: '#fff' });
        logo.anchor.setTo(0.5, 0.5);
        logo.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
        this.game.add.tween(logo).to({ y: h / 2 - 100 }, 1500, Phaser.Easing.Bounce.Out).start();
    }
};