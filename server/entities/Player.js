/**
 * Created by Yunen on 27/05/15.
 */

var Player = function(id, x, y, character, mass, point) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.character = character;
    //TODO: (Delete after check) ADD by Geyang 13 Jul
    this.mass = mass;
    this.point = point;
};

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
    //TODO: (Delete after check) ADD by Geyang 13 Jul
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
    }
};

module.exports = Player;