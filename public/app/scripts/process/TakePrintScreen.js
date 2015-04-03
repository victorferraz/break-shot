'use strict';

var webshot = require('webshot');
var async = require('async');

var TakePrintScreen = function(){
    this.sidebar = $('.sidebar');
    this.modal = $('.modal');
    this.btSave = $('.save-destiny');
};

TakePrintScreen.prototype.takePics = function (mediaArray, data) {
    this.destiny = data.destiny;
    this.index = 0;
    this.data = data;
    this.medias = mediaArray;
    this.names = [];
    var merged = [];
    var params = mediaArray;
    this.sidebar.html('');
    console.log(mediaArray);
    if (data.size === 'auto-sizing'){
        params = merged.concat.apply(merged, mediaArray);
    }
    async.each(mediaArray, this.take.bind(this, params), this.onFinished.bind(this));
};


TakePrintScreen.prototype.getPath = function (args) {
    var path = '';
    this.btSave.val('');
    if ( this.data.from === 'from-url' ){
        path = this.data.url;
    } else {
        path = 'file://' + args.html;
    }
    return path;
};


TakePrintScreen.prototype.onFinished = function(err){
    console.log('finished');
    this.modal.hide();
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
    if (args !== undefined) {
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
            renderDelay:5200,
            shotSize: {
                width: parseInt(media.width),
                height: 'all'
            },
            userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g',
        };
        console.log(options);
        path = this.getPath(args);
        var name = this.destiny + '/' + this.data.fileName + '_' + args.width + '-' + height + '.' + this.data.extension;
        this.names.push(name);
        webshot(path, name, options, function(err) {
            console.log(err);
            callback();
        });
    }
};

module.exports = new TakePrintScreen();
