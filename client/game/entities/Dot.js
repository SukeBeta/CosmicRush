/**
 * Created by Hosuke and Mengchen on 19/07/15.
 */

/**
 * Create a food particle on map
 * @param id
 * @param x
 * @param y
 * @constructor
 */
var Dot = function(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.color = this.generateColor();
    var circle = this.generateCircle(this.color);

    // Create sprite on map
    this.sprite = game.add.sprite(x,y,circle);
};

Dot.prototype.generateCircle = function(color) {
    var bitmapSize = 8;
    var circle = game.add.bitmapData(bitmapSize, bitmapSize);
    circle.ctx.fillStyle = color;
    circle.ctx.beginPath();
    circle.ctx.arc(bitmapSize/2,bitmapSize/2,bitmapSize/2,0,Math.PI*2, true);
    circle.ctx.closePath();
    circle.ctx.fill();
    return circle;
};

/**
 *  generate a color from the list for the Dot
 */
Dot.prototype.generateColor = function() {
    var colors = ['#234F3','#FF0000','#00FF00'];
    return colors[Math.floor(Math.random()*colors.length)];
};

/**
 * remove this dot from map
 */
Dot.prototype.remove = function(){
    this.sprite.destroy();
};