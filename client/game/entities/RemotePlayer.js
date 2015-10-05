/**
 * Created by Yunen on 27/05/15.
 */

/**
 * Modified by Geyang
 * add mass and point to constructor
 */

var DEFAULT_PLAYER_SPEED = 180;
var MASS_SPEED_CONSTANT = 100;
var RADIUS_PARA = 5;

playerInfo = {
    bitmapSize: 240,
    lightRingSize: 150,
    smallCircleSize: 50,
    bigCircleSize: 55,
    faceImgs: []
};

//  generate 19 player face sprites
for (var i = 0; i < 19; i++) {
    var img = new Image();
    img.src = 'game/assets/playerFace' + (i+1) + '.png';
    playerInfo.faceImgs.push(img);
}

var RemotePlayer = function(id, x, y, character, R, G, B, mass, point){
    this.id = id;
    this.speed = DEFAULT_PLAYER_SPEED;
    // mass: player quits when mass < 5
    this.mass = mass;
    this.speed_factor = MASS_SPEED_CONSTANT/Math.sqrt(this.mass);
    this.radius = Math.sqrt(this.mass) / RADIUS_PARA;
    this.counter = this.radius;
    this.point = point;

    this.circle = game.make.bitmapData(playerInfo.bitmapSize, playerInfo.bitmapSize);

    var color = {
        R: R,
        G: G,
        B: B
    };

    //  outside gradient
    var gradientFillOutside = this.circle.context.createRadialGradient(playerInfo.bitmapSize/2, playerInfo.bitmapSize/2, 0, playerInfo.bitmapSize/2, playerInfo.bitmapSize/2, playerInfo.bitmapSize/2);
    //  colors,  0 closer to gradient point, 1 far away to gradient point
    gradientFillOutside.addColorStop(0.4,RGBAString(color, 0.9));
    gradientFillOutside.addColorStop(0.68,RGBAString(color, 0.3));
    gradientFillOutside.addColorStop(1,'rgba(255,255,255,0)');

    //  draw outside
    this.circle.context.beginPath();
    this.circle.context.arc(playerInfo.bitmapSize/2, playerInfo.bitmapSize/2, playerInfo.lightRingSize, 0, 2*Math.PI);
    this.circle.context.fillStyle = gradientFillOutside;
    this.circle.context.fill();
    this.circle.context.closePath();

    // create gradientFill, gradientFill's coordinate used position of the circle
    var gradientFill = this.circle.context.createRadialGradient(playerInfo.bitmapSize/2, playerInfo.bitmapSize/2, 0, playerInfo.bitmapSize/2, playerInfo.bitmapSize/2, playerInfo.bitmapSize);

    gradientFill.addColorStop(0,'RGBA(246,242,239,1)');
    gradientFill.addColorStop(1,RGBAString(color, 0.2));

    // create inner circle
    this.circle.circle(playerInfo.bitmapSize/2, playerInfo.bitmapSize/2, playerInfo.smallCircleSize, 'RGBA(246,242,239,1)');
    // create outer circle
    this.circle.circle(playerInfo.bitmapSize/2, playerInfo.bitmapSize/2, playerInfo.bigCircleSize, gradientFill);

    switch(character) {
        case 0:
            this.circle.draw(playerInfo.faceImgs[0], playerInfo.bitmapSize/2 - playerInfo.smallCircleSize/2, playerInfo.bitmapSize/2-5, playerInfo.smallCircleSize, playerInfo.faceImgs[0].height * 0.2);
            break;
        case 1:
            this.circle.draw(playerInfo.faceImgs[1], playerInfo.bitmapSize/2 - playerInfo.smallCircleSize/2, playerInfo.bitmapSize/2-7, playerInfo.smallCircleSize, playerInfo.faceImgs[1].height * 0.2);
            break;
        case 2:
            this.circle.draw(playerInfo.faceImgs[2], playerInfo.bitmapSize/2 - playerInfo.smallCircleSize/2, playerInfo.bitmapSize/2-5, playerInfo.smallCircleSize, playerInfo.faceImgs[2].height * 0.2);
            break;
        case 3:
            this.circle.draw(playerInfo.faceImgs[3], playerInfo.bitmapSize/2 - playerInfo.smallCircleSize/2, playerInfo.bitmapSize/2-6, playerInfo.smallCircleSize, playerInfo.faceImgs[3].height * 0.2);
            break;
        case 4:
            this.circle.draw(playerInfo.faceImgs[4], playerInfo.bitmapSize/2 - playerInfo.smallCircleSize/2, playerInfo.bitmapSize/2-8, playerInfo.smallCircleSize, playerInfo.faceImgs[4].height * 0.3);
            break;
        case 5:
            this.circle.draw(playerInfo.faceImgs[5], playerInfo.bitmapSize/2 - playerInfo.smallCircleSize/2, playerInfo.bitmapSize/2-9, playerInfo.smallCircleSize, playerInfo.faceImgs[5].height * 0.24);
            break;
        case 6:
            this.circle.draw(playerInfo.faceImgs[6], playerInfo.bitmapSize/2 - playerInfo.smallCircleSize/2, playerInfo.bitmapSize/2-8, playerInfo.smallCircleSize, playerInfo.faceImgs[6].height * 0.26);
            break;
        case 7:
            this.circle.draw(playerInfo.faceImgs[7], playerInfo.bitmapSize/2 - playerInfo.smallCircleSize/2, playerInfo.bitmapSize/2-8, playerInfo.smallCircleSize, playerInfo.faceImgs[7].height * 0.26);
            break;
        case 8:
            this.circle.draw(playerInfo.faceImgs[8], playerInfo.bitmapSize/2 - playerInfo.smallCircleSize/2, playerInfo.bitmapSize/2-8, playerInfo.smallCircleSize, playerInfo.faceImgs[8].height * 0.3);
            break;
        case 9:
            this.circle.draw(playerInfo.faceImgs[9], playerInfo.bitmapSize/2 - playerInfo.smallCircleSize/2, playerInfo.bitmapSize/2-9, playerInfo.smallCircleSize, playerInfo.faceImgs[9].height * 0.3);
            break;
        case 10:
            this.circle.draw(playerInfo.faceImgs[10], playerInfo.bitmapSize/2 - playerInfo.smallCircleSize/2, playerInfo.bitmapSize/2-8, playerInfo.smallCircleSize, playerInfo.faceImgs[10].height * 0.3);
            break;
        case 11:
            this.circle.draw(playerInfo.faceImgs[11], playerInfo.bitmapSize/2 - playerInfo.smallCircleSize/2, playerInfo.bitmapSize/2-8, playerInfo.smallCircleSize, playerInfo.faceImgs[11].height * 0.23);
            break;
        case 12:
            this.circle.draw(playerInfo.faceImgs[12], playerInfo.bitmapSize/2 - playerInfo.smallCircleSize/2, playerInfo.bitmapSize/2-10, playerInfo.smallCircleSize, playerInfo.faceImgs[12].height * 0.24);
            break;
        case 13:
            this.circle.draw(playerInfo.faceImgs[13], playerInfo.bitmapSize/2 - playerInfo.smallCircleSize/2, playerInfo.bitmapSize/2-8, playerInfo.smallCircleSize, playerInfo.faceImgs[13].height * 0.26);
            break;
        case 14:
            this.circle.draw(playerInfo.faceImgs[14], playerInfo.bitmapSize/2 - playerInfo.smallCircleSize/2, playerInfo.bitmapSize/2-9, playerInfo.smallCircleSize, playerInfo.faceImgs[14].height * 0.25);
            break;
        case 15:
            this.circle.draw(playerInfo.faceImgs[15], playerInfo.bitmapSize/2 - playerInfo.smallCircleSize/2, playerInfo.bitmapSize/2-8, playerInfo.smallCircleSize, playerInfo.faceImgs[15].height * 0.22);
            break;
        case 16:
            this.circle.draw(playerInfo.faceImgs[16], playerInfo.bitmapSize/2 - playerInfo.smallCircleSize/2, playerInfo.bitmapSize/2-8, playerInfo.smallCircleSize, playerInfo.faceImgs[16].height * 0.3);
            break;
        case 17:
            this.circle.draw(playerInfo.faceImgs[17], playerInfo.bitmapSize/2 - playerInfo.smallCircleSize/2, playerInfo.bitmapSize/2-9, playerInfo.smallCircleSize, playerInfo.faceImgs[17].height * 0.28);
            break;
        case 18:
            this.circle.draw(playerInfo.faceImgs[18], playerInfo.bitmapSize/2 - playerInfo.smallCircleSize/2, playerInfo.bitmapSize/2-9, playerInfo.smallCircleSize, playerInfo.faceImgs[18].height * 0.25);
            break;
    }

    Phaser.Sprite.call(this, game, x, y, this.circle);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.bounce.setTo(0.8, 0.8);
    this.body.collideWorldBounds=true;
    this.scale.x = this.radius;
    this.scale.y = this.radius;
    // TODO: SetSize
    this.body.setSize(this.radius * 10, this.radius * 10);
    game.add.existing(this);
};

RemotePlayer.prototype = Object.create(Phaser.Sprite.prototype);

RemotePlayer.prototype.updateMass = function(mass) {
    this.mass = mass;
    this.speed_factor = MASS_SPEED_CONSTANT/Math.sqrt(this.mass);
    this.radius = Math.sqrt(this.mass) / RADIUS_PARA;
    this.scale.x = this.radius;
    this.scale.y = this.radius;
    this.body.setSize(this.radius * 10, this.radius * 10);
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
