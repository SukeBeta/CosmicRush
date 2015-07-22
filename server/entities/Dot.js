/**
 * Created by Hosuke on 21/07/15.
 */

var Dot = function(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
};

Dot.prototype = {
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

module.exports = Dot;