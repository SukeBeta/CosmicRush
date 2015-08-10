/**
 * Created by Yunen on 26/05/15.
 */
var DEFAULT_PLAYER_SPEED = 180;
var MASS_SPEED_CONSTANT = 300;

/**
 * Player Constructor
 * @param id
 * @param x
 * @param y
 * @param character
 * @constructor
 */
var Player = function(id, x, y, character){
    this.id = id;
    this.speed = DEFAULT_PLAYER_SPEED;
    this.image = null;

    // mass: player quits when mass < 5
    this.mass = 10;

    /**
     * speed_factor concept:
     * speed_factor * sqrt(mass) = constant
     * radius^2 ~ mass
     */
    this.speed_factor = MASS_SPEED_CONSTANT/Math.sqrt(this.mass);
    this.radius = Math.sqrt(this.mass) / 3;

    // point: accumulated score
    this.point = 0;

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
    this.body.collideWorldBounds=true;
    this.scale.x = this.radius;
    this.scale.y = this.radius;
    game.add.existing(this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);

Player.prototype.handleInput = function() {
    this.handleMovement();
};

/**
 * Update player's mass and recalculate its speed_factor
 * @param mass
 */
Player.prototype.updateMass = function(mass) {
    this.mass = mass;
    this.speed_factor = MASS_SPEED_CONSTANT/Math.sqrt(this.mass);
    this.radius = Math.sqrt(this.mass) / 3;
    this.scale.x = this.radius;
    this.scale.y = this.radius;
};

/**
 * Add some points to player's point
 * @param point
 */
Player.prototype.addPoint = function(point) {
    this.point += point;
    ground.scoretext.setText("Point: "+ this.point);
};


Player.prototype.handleMovement = function() {
    var self = this;

    // Collisions
    game.physics.arcade.overlap(this, ground.dots, eatingDot, null, this);

    // Gyro control
    // setting gyroscope update frequency
    gyro.frequency = 20;
    // start gyroscope detection
    gyro.startTracking(function(o) {
        // updating player velocity
        // Modify speed_factor for better control
        self.body.velocity.x = self.body.velocity.x / 10 + Math.sqrt(Math.abs(o.gamma)) * self.speed_factor * (o.gamma/Math.abs(o.gamma)) * 7;
        self.body.velocity.y = self.body.velocity.y / 10 + Math.sqrt(Math.abs(o.beta)) * self.speed_factor * (o.beta/Math.abs(o.beta)) * 7;
    });

    // Send move player message
    socket.emit("move player", {id: this.id, x: this.position.x, y: this.position.y, mass: this.mass, point: this.point});

    // collisionHandler
    // collide with a dot
    function eatingDot(player, dot) {
        //kill dot
        dot.kill();

        // Update player information
        player.updateMass(player.mass + 1);
        player.addPoint(1);

        // Send remove dot message
        socket.emit("remove dot", {id: dot.id});

        // dot will be destroyed when server broadcast back
    }
};
