/**
 * Created by Yunen on 27/05/15.
 */

var Player = function(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
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
    setX: function(x) {
        this.x = x;
    },
    setY: function(y) {
        this.y = y;
    }
};

module.exports = Player;