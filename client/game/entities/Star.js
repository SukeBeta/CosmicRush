/**
 * Created by Hosuke on 28/07/15.
 */


var Star = function() {
    this.color = "#FFFFFF";
    this.star = this.generate();
    return this.star;
};

Star.prototype.generate = function() {
    var bitmapSize = _.random(1,6);
    var circle = game.add.bitmapData(bitmapSize, bitmapSize);
    circle.ctx.fillStyle = this.color;
    circle.ctx.beginPath();
    circle.ctx.arc(bitmapSize/2,bitmapSize/2,bitmapSize/2,0,Math.PI*2, true);
    circle.ctx.closePath();
    circle.ctx.fill();
    return circle;
};