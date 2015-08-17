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
    // mass: player quits when mass < 5
    this.mass = 10;

    /**
     * speed_factor concept:
     * speed_factor * sqrt(mass) = constant
     * radius^2 ~ mass
     */
    this.speed_factor = MASS_SPEED_CONSTANT/Math.sqrt(this.mass);
    this.radius = Math.sqrt(this.mass) / 3;
    // breath counting
    this.counter = this.radius;

    // point: accumulated score
    this.point = 0;

    var playerInfo = {
        bitmapSize: 50,
        smallCircleSize: 20,
        bigCircleSize: 25
    };
    this.circle = game.make.bitmapData(playerInfo.bitmapSize, playerInfo.bitmapSize);
    this.circle.addToWorld();

    // create gradientFill, gradientFill's coordinate used position of the circle
    var gradientFill = this.circle.context.createRadialGradient(playerInfo.bitmapSize/2, playerInfo.bitmapSize/2, 0, playerInfo.bitmapSize/2, playerInfo.bitmapSize/2, playerInfo.bitmapSize);

    switch(character) {
        case 0:
            gradientFill.addColorStop(0,'rgba(0,200,250,0.5)');
            gradientFill.addColorStop(1,'rgba(0,200,250,0)');
            break;
        case 1:
            gradientFill.addColorStop(0,'rgba(255,0,3,0.5)');
            gradientFill.addColorStop(1,'rgba(255,0,3,0)');
            break;
        case 2:
            gradientFill.addColorStop(0,'rgba(5,205,0,0.5)');
            gradientFill.addColorStop(1,'rgba(5,205,0,0)');
            break;
    }

    // create inner circle
    this.circle.circle(playerInfo.bitmapSize/2, playerInfo.bitmapSize/2, playerInfo.smallCircleSize, 'rgba(255,255,255,0.75)');
    // create outer circle
    this.circle.circle(playerInfo.bitmapSize/2, playerInfo.bitmapSize/2, playerInfo.bigCircleSize, gradientFill);

    Phaser.Sprite.call(this, game, x, y, this.circle);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds=true;
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

// Breath
RemotePlayer.prototype.breathe = function() {
    if (this.growing) {
        this.counter += 0.01;
    }
    else {
        this.counter -= 0.01;
    }

    if (this.counter > (this.radius + this.radius * 0.3)) {
        this.growing = false;
    }
    else if (this.counter < this.radius) {
        this.growing = true;
    }

    this.scale.setTo(this.counter, this.counter);
};

RemotePlayer.prototype.freeze = function() {
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
};
