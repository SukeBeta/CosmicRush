/**
 * Created by Yunen on 27/05/15.
 */

/**
 * Modified by Geyang
 * add mass and point to constructor
 */

var DEFAULT_PLAYER_SPEED = 180;
var MASS_SPEED_CONSTANT = 100;

var RemotePlayer = function(id, x, y, character, mass, point){
    this.id = id;
    this.speed = DEFAULT_PLAYER_SPEED;
    this.lastPosition = { x: x, y: y };
    this.image = "";
    
    //TODO: (Delete after check) ADD by Geyang 13 Jul
    this.mass = mass;
    this.point = point;
    this.speed_factor = MASS_SPEED_CONSTANT/this.mass;
    this.radius = Math.sqrt(this.mass);

    switch (character) {
        case 0:
            this.image = "p01";
            break;
        case 1:
            this.image = "p02";
            break;
        case 2:
            this.image = "p03";
            break;
        case 3:
            this.image = "p04";
            break;
        case 4:
            this.image = "p05";
            break;
        case 5:
            this.image = "p06";
            break;
        case 6:
            this.image = "p07";
            break;
        case 7:
            this.image = "p08";
            break;
        case 8:
            this.image = "p09";
            break;
    }

    Phaser.Sprite.call(this, game, x, y, this.image);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds=true;
    game.add.existing(this);
};

RemotePlayer.prototype = Object.create(Phaser.Sprite.prototype);

RemotePlayer.prototype.update = function() {
    if(this.body.x != this.lastPosition.x || this.body.y != this.lastPosition.y) {

    } else {

    }

    this.lastPosition.x = this.body.x;
    this.lastPosition.y = this.body.y;
};

RemotePlayer.prototype.freeze = function() {
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
};