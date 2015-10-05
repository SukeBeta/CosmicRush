/**
 * Created by Yunen on 27/05/15.
 */


/**
 * Player Constructor
 * @param id
 * @param x
 * @param y
 * @param character
 * @param mass
 * @param point
 * @constructor
 */
var Player = function(id, x, y, character, R, G, B, mass, point) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.character = character;
    this.R = R;
    this.G = G;
    this.B = B;
    this.mass = mass;
    this.point = point;
    // freeze player after eaten for a while to avoid repeated calculation
    this.eatable = true;
};

/**
 * Player methods
 * @type {{getID: Function, getX: Function, getY: Function, getCharacter: Function, setX: Function, setY: Function, getMass: Function, setMass: Function, getPoint: Function, setPoint: Function}}
 */
Player.prototype = {
    getID: function() {
        return this.id;
    },
    getX: function() {
        return this.x;
    },
    getY: function() {
        return this.y;
    },
    getCharacter: function() {
        return this.character;
    },
    setX: function(x) {
        this.x = x;
    },
    setY: function(y) {
        this.y = y;
    },
    getMass: function() {
        return this.mass;
    },
    setMass: function(mass) {
        this.mass = mass;
    },
    getPoint: function() {
        return this.point;
    },
    setPoint: function(point) {
        this.point = point;
    },
    getR: function() {
        return this.R;
    },
    getG: function() {
        return this.G;
    },
    getB: function() {
        return this.B;
    }
};

// export Player Class module
module.exports = Player;