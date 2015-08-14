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
    var bitmapSize = 200;
    var circle = game.add.bitmapData(bitmapSize, bitmapSize);
    //  star(canvas, x of center, y of center, radius, number of points, fraction of radius for inset)


    function star(ctx, x, y, r, p, m)
    {
        ctx.save();
        var gradientFill = ctx.createRadialGradient(bitmapSize/2, bitmapSize/2, 0, bitmapSize/2, bitmapSize/2, bitmapSize);
        gradientFill.addColorStop(0,'rgba(255,253,0,0.5)');
        gradientFill.addColorStop(1,'rgba(255,253,0,0)');
        ctx.fillStyle = gradientFill;
        ctx.beginPath();
        ctx.translate(x, y);
        ctx.moveTo(0,0-r);
        for (var i = 0; i < p; i++)
        {
            ctx.rotate(Math.PI / p);
            ctx.lineTo(0, 0 - (r*m));
            ctx.rotate(Math.PI / p);
            ctx.lineTo(0, 0 - r);
        }
        ctx.fill();
        ctx.restore();
    }

    function star2(ctx, x, y, r, p, m)
    {
        ctx.save();
        ctx.fillStyle = "rgba(255,255,167,0.5)";
        ctx.beginPath();
        ctx.translate(x, y);
        ctx.moveTo(0,0-r);
        for (var i = 0; i < p; i++)
        {
            ctx.rotate(Math.PI / p);
            ctx.lineTo(0, 0 - (r*m));
            ctx.rotate(Math.PI / p);
            ctx.lineTo(0, 0 - r);
        }
        ctx.fill();
        ctx.restore();
    }

    // star(canvas, x of center, y of center, radius, number of points, fraction of radius for inset)
    star2(circle.ctx, 100, 100, 35, 5, 0.6);
    star(circle.ctx, 100, 100, 40, 5, 0.6);

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
Dot.prototype.remove = function() {
    this.sprite.destroy();
};

Dot.prototype.light = function() {
    this.sprite.tint = Math.random() * 0xffffff;
};
