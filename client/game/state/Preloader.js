/**
 * Created by Yunen on 26/05/15.
 */
BasicGame.Preloader = function (game) {

};

BasicGame.Preloader.prototype = {

    preload: function () {
        this.game.load.image('player', 'game/assets/player.png');
    },

    create: function () {

    },

    update: function () {
        this.state.start('Game');
    }
};