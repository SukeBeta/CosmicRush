/**
 * Created by Yunen on 26/05/15.
 */
var DEFAULT_PLAYER_SPEED = 180;

var Player = function(id, x, y, character){
    this.id = id;
    this.speed = DEFAULT_PLAYER_SPEED;
    this.image = "";

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

Player.prototype = Object.create(Phaser.Sprite.prototype);

Player.prototype.handleInput = function() {
    this.handleMovement();
};

Player.prototype.handleMovement = function() {
    var self = this;

    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        this.body.velocity.y = 0;
        this.body.velocity.x = -this.speed;
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        this.body.velocity.y = 0;
        this.body.velocity.x = this.speed;
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
        this.body.velocity.x = 0;
        this.body.velocity.y = -this.speed;
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
        this.body.velocity.x = 0;
        this.body.velocity.y = this.speed;
    }

    // Gyro control
    // setting gyroscope update frequency
    gyro.frequency = 20;
    // start gyroscope detection
    gyro.startTracking(function(o) {
        // updating player velocity
        self.body.velocity.x += o.gamma/1000;
        self.body.velocity.y += o.beta/1000;
    });

    // Send move player message
    socket.emit("move player", {id: this.id, x: this.position.x, y: this.position.y});
};