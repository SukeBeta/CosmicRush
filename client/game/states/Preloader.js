/**
 * Created by Yunen on 26/05/15.
 */
BasicGame.Preloader = function (game) {

};

// highscore
var highscore = 0;

// gameStart indicator
var gameStart = false;

// game state indicator
var gameState = false;


BasicGame.Preloader.prototype = {

    preload: function () {
        this.game.stage.backgroundColor = '#100826';

        var loadingLabel = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 100, 'loading...', {font: '30px Arial', fill: '#ffffff'});
        loadingLabel.anchor.setTo(0.5, 0.5);

        var progressBar = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        this.game.load.setPreloadSprite(progressBar);
    },

    create: function () {
    },

    update: function () {
        this.start();
    },

    start: function() {
        this.game.state.start('Menu');
    }
};
