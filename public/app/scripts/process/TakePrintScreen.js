'use strict';

var webshot = require('webshot');
var async = require('async');
var $ = require('jquery');

var TakePrintScreen = function () {
    this.index = 0;
};


TakePrintScreen.prototype.takePics = function (params, data) {
    this.data = data;
    var args;
    this.names = [];
    this.medias = params;
    for (var i = 0; i < this.medias.length; i++) {
        this.index = 0;
        args = params[i];
        console.log(args);
        async.eachLimit(args, 10, this.take.bind(this, args), this.onFinished.bind(this));
    }
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
    console.log(media);
    args = args[this.index];
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
