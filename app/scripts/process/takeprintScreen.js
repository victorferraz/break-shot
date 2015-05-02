'use strict';

var pageres = require('pageres');
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
    this.dataNames = [];
    var merged = [];
    var params = mediaArray;
    this.sidebar.html('');
    if (data.size === 'auto-sizing'){
        params = merged.concat.apply(merged, mediaArray);
    }
    this.take(mediaArray);
    async.eachLimit(mediaArray, 1, this.take.bind(this), function(err){
        console.log(err);
    });
};


TakePrintScreen.prototype.getPath = function () {
    var path = '';
    this.btSave.val('');
    if ( this.data.from === 'from-url' ){
        path = this.data.url;
        path = path.replace('http://', '');
    } else {
        path = this.data.origin;
    }
    return path;
};


TakePrintScreen.prototype.onFinished = function(data){
    console.log('finished');
    this.modal.hide();
    if(data){
        var img = '';
        for (var i = 0; i < data.length; i++) {
            img += '<picture class="preview-container">';
            img += '<img class="preview-image" src='+this.destiny+'/'+data[i].filename+' />';
            img += '<figcaption class="preview-caption">';
            img += '<div class="w-row">';
            img += '<div class="w-col w-col-8 w-clearfix"><h4>'+data[i].filename+'</h4></div>';
            img += '<div class="w-col w-col-4 w-clearfix"><h5>'+data[i].filename+'</h5></div>';
            img += '</div>';
            img += '</figcaption>';
            img += '</picture>';
        }
        $('.sidebar').append(img);
    }
};


TakePrintScreen.prototype.take = function (sizes) {
    var arrayWidth = this.getWidth(sizes);
    var path;
    this.index++;
    path = this.getPath();
    var pgeres = new pageres({delay: 5}).src(path, arrayWidth, {'filename': this.data.fileName + '-<%= size %>', 'format': this.data.extension })
            .dest(this.destiny);
    var self = this;
    pgeres.run(function(err, streams){
        console.log(err);
        if (err) {
            throw err;
        }else{
            self.onFinished(streams);
            console.log('done');
        }
    });
};

TakePrintScreen.prototype.getWidth = function (arraySizes) {
    var arrayWidth = [];
    for (var i = 0; i < arraySizes.length; i++) {
        arrayWidth[i] = arraySizes[i].size;
    }
    return arrayWidth;
};

module.exports = new TakePrintScreen();
