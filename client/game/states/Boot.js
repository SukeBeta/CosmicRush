/**
 * Created by Yunen on 26/05/15.
 */

var BasicGame = {
    playing: false
};

WebFontConfig = {
    google: {families: ['Press+Start+2P::latin']}
};

BasicGame.Boot = function (game) {
};

BasicGame.Boot.prototype = {

    init: function () {
        //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
        this.input.maxPointers = 1;

        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.stage.disableVisibilityChange = true;

        //  This tells the game to resize the renderer to match the game dimensions (i.e. 100% browser width / height)
        this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    },

    preload: function () {
        //  Load the Google WebFont Loader script
        this.game.load.script('webfont', 'game/libs/webfont.js');

        this.game.load.image('progressBar', 'game/assets/progressBar.png');
    },

    create: function () {

        //  By this point the preloader assets have loaded to the cache, we've set the game settings
        //  So now let's start the real preloader going
        this.state.start('Preloader');

    }
};
