/**
 * Created by Yunen on 26/05/15.
 */
BasicGame.Preloader = function (game) {

};

BasicGame.Preloader.prototype = {

    preload: function () {
        this.game.load.image('p01', 'game/assets/p01.png');
        this.game.load.image('p02', 'game/assets/p02.png');
        this.game.load.image('p03', 'game/assets/p03.png');
    },

    create: function () {
    },

    update: function () {
        this.state.start('Game');
    }
};

/**
 * Old preloader
 */
//BasicGame.Preloader.prototype = {
//
//    preload: function () {
//        this.game.load.image('background','game/assets/debug-grid-1920x1920.png');
//
//        this.game.load.image('p01', 'game/assets/p01.png');
//        this.game.load.image('p02', 'game/assets/p02.png');
//        this.game.load.image('p03', 'game/assets/p03.png');
//        this.game.load.image('p04', 'game/assets/p04.png');
//        this.game.load.image('p05', 'game/assets/p05.png');
//        this.game.load.image('p06', 'game/assets/p06.png');
//        this.game.load.image('p07', 'game/assets/p07.png');
//        this.game.load.image('p08', 'game/assets/p08.png');
//        this.game.load.image('p09', 'game/assets/p09.png');
//    },
//
//    create: function () {
//
//    },
//
//    update: function () {
//        this.state.start('Game');
//    }
//};