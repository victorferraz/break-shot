'use strict';

var webshot = require('webshot');
var async = require('async');

var TakePrintScreen = function(){};

TakePrintScreen.prototype.takePics = function (mediaArray, data) {
    this.index = 0;
    this.data = data;
    this.names = [];
    var merged = [];
    var params = null;
    this.medias = mediaArray;
    params = mediaArray;
    console.log(data.size);
    if (data.size === 'auto-sizing'){
        params = merged.concat.apply(merged, mediaArray);
    }
    console.log(params);
    async.eachLimit(params, 10, this.take.bind(this, params), this.onFinished.bind(this));
};


TakePrintScreen.prototype.getPath = function (args) {
    var path = '';
    if ( this.data.from === 'from-url' ){
        path = this.data.url;
    } else {
        path = 'file://' + args.html;
    }
    return path;
};


TakePrintScreen.prototype.onFinished = function(err){
    if(err){
        console.log('over');
    }else{
        var img = null;
        for(var i=0; i<this.names.length; i++){
            img += '<img src='+this.names[i]+' />';
        }
        $('.sidebar').append(img);
    }
};


TakePrintScreen.prototype.take = function (args, media, callback) {
    args = args[this.index];
    console.log(args);
    var path;
    this.index++;
    var height = 768;
    if (media.height){
        height = parseInt(media.height);
    }
    var options = {
        defaultWhiteBackground: true,
        screenSize: {
            width: parseInt(media.width),
            height: height
        },
        renderDelay:700,
        shotSize: {
            width: parseInt(media.width),
            height: 'all'
        },
        userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g',
    };
    path = this.getPath(args);
    var name = './' + this.data.fileName + '_' + args.width + '-' + height + '.' + this.data.extension;
    this.names.push(name);
    webshot(path, name, options, function(err) {
        console.log(err);
        callback();
    });
};

module.exports = new TakePrintScreen();
