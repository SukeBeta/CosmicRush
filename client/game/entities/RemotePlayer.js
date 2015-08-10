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
    this.image = null;

    this.mass = mass;
    this.point = point;
    this.speed_factor = MASS_SPEED_CONSTANT/Math.sqrt(this.mass);
    this.radius = Math.sqrt(this.mass) / 3;

    var bitmapSize = 50;
    var circle = game.make.bitmapData(bitmapSize, bitmapSize);

    switch(character) {
        // corresponding to p01.png, p02.png, p03.png
        //case 0:
        //    this.image = "p01";
        //    break;
        //case 1:
        //    this.image = "p02";
        //    break;
        //case 2:
        //    this.image = "p03";
        //    break;
        case 0:
            circle.ctx.fillStyle = 'rgba(220,50,50, 0.9)';
            circle.ctx.strokeStyle = 'rgba(255,255,255,0.4)';
            circle.ctx.shadowColor = "rgba(255,100,100,0.9)";
            break;
        case 1:
            circle.ctx.fillStyle = 'rgba(190,220,90, 0.9)';
            circle.ctx.strokeStyle = 'rgba(255,255,255,0.4)';
            circle.ctx.shadowColor = 'rgba(220,240,150,0.9)';
            break;
        case 2:
            circle.ctx.fillStyle = 'rgba(0,200,220, 0.9)';
            circle.ctx.strokeStyle = 'rgba(255,255,255,0.4)';
            circle.ctx.shadowColor = 'rgba(0,240,255,0.9)';
            break;
    }

    circle.ctx.beginPath();
    circle.ctx.arc(bitmapSize/2,bitmapSize/2,bitmapSize/2,0,Math.PI*2, true);
    circle.ctx.closePath();
    circle.ctx.fill();

    if (this.image) {
        Phaser.Sprite.call(this, game, x, y, this.image);
    } else {
        Phaser.Sprite.call(this, game, x, y, circle);
    }

    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;
    this.scale.x = this.radius;
    this.scale.y = this.radius;
    game.add.existing(this);
};

RemotePlayer.prototype = Object.create(Phaser.Sprite.prototype);

RemotePlayer.prototype.updateMass = function(mass) {
    this.mass = mass;
    this.speed_factor = MASS_SPEED_CONSTANT/Math.sqrt(this.mass);
    this.radius = Math.sqrt(this.mass) / 3;
    this.scale.x = this.radius;
    this.scale.y = this.radius;
};

// Useless !
// This method will be deleted. Yunen
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
