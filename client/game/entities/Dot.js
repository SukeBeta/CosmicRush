/**
 * Created by Hosuke and Mengchen on 19/07/15.
 * Modified by Yunen 22/07/2015
 * This class is to draw a new circle.
 */

/**
 * Dot Constructor, may have a id attribute assigned outside
 * @returns {*}
 * @constructor
 */
var Dot = function() {
    this.color = this.selectColor();
    this.dot = this.generate();
    return this.dot;
};


Dot.prototype.generate = function() {
    var bitmapSize = 30;
    var circle = game.add.bitmapData(bitmapSize, bitmapSize);
    circle.ctx.fillStyle = this.color;
    circle.ctx.beginPath();
    circle.ctx.arc(bitmapSize/2,bitmapSize/2,bitmapSize/2,0,Math.PI*2, true);
    circle.ctx.closePath();
    circle.ctx.fill();
    return circle;
};

/**
 *  generate a color from the list for the Dot
 */
Dot.prototype.selectColor = function() {
    var colors = ['#ade2d4', '#b0e1e4', '#b3d4e5', '#b6c8e7', '#babde9'];
    return colors[Math.floor(Math.random()*colors.length)];
};

/**
 * remove this dot from map
 */
Dot.prototype.remove = function(){
    this.sprite.destroy();
};