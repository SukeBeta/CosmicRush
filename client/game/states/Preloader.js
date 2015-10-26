/**
 * Created by Yunen on 26/05/15.
 */
BasicGame.Preloader = function (game) {

};

// highscore
var highscore = 0;

// first run indicator
var firstRun = true;

// restart lock
var restartLock = false;

// notice board message
var bulletin = "This game is currently under development. Thank you for testing!";


BasicGame.Preloader.prototype = {

    preload: function () {
        // Only allow player to play in portrait orientation
        this.game.scale.forceOrientation(false, true);
        this.game.scale.enterIncorrectOrientation.add(handleIncorrect);
        this.game.scale.leaveIncorrectOrientation.add(handleCorrect);

        this.game.load.image('cosmicRush', 'game/assets/CosmicRushTitle.png');
        this.game.load.image('startButton', 'game/assets/startButton.png');
        this.game.load.image('star', 'game/assets/star.png');
        this.game.load.image('yellow', 'game/assets/yellow.png');
        this.game.load.image('red', 'game/assets/red.png');

        this.game.stage.backgroundColor = '#100826';

        var loadingLabel = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 100, 'loading...', {font: '30px Arial', fill: '#ffffff'});
        loadingLabel.anchor.setTo(0.5, 0.5);

        var progressBar = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        this.game.load.setPreloadSprite(progressBar);

        if(this.game.device.desktop){
            bulletin = "Use the mouse to control. ";
        } else {
            bulletin = "Tilt the device to control. ";
        }
        bulletin += "Scoring by eating stars and smaller players. ";
        bulletin += "Share the link and invite friends to play with you in real time. ";
        bulletin += "Have fun!";
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

function handleIncorrect(){
    if(!game.device.desktop){
        document.getElementById("turn").style.display = "block";
    }
}

function handleCorrect(){
    if(!game.device.desktop){
        document.getElementById("turn").style.display = "none";
    }
}
