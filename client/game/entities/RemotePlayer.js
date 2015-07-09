/**
 * Created by Yunen on 27/05/15.
 */
var DEFAULT_PLAYER_SPEED = 180;

var RemotePlayer = function(id, x, y){
    this.id = id;
    this.speed = DEFAULT_PLAYER_SPEED;
    this.lastPosition = { x: x, y: y };

    Phaser.Sprite.call(this, game, x, y, 'player');
    game.physics.enable(this, Phaser.Physics.ARCADE);
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