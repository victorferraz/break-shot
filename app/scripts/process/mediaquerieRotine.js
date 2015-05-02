'use strict';

var mensch = require('mensch');
var Q = require('q');
var needle = require('needle');
var fs = require('fs');

var MediaQuerieRotine = function () {
    this.init();
};

MediaQuerieRotine.prototype.init = function () {
    this.media = [];
    this.filePath = '';
    this.arrayMedia = [];
    this.arrayAdBanner = [];
    this.cssPath = '';
    this.data = '';
    this.urlHtml = '';
    this.verifyAdExists = false;
};


MediaQuerieRotine.prototype.getBreakPoints = function (arrayLink, settings) {
    var self = this;
    this.settings = settings;
    var arrayStyle = this.readCss(arrayLink);
    return arrayStyle.then(function(arrayCss){
        return self.analysisCss(arrayCss);
    });
};


MediaQuerieRotine.prototype.readCss = function (style) {
    if (this.settings.from === 'from-url') {
        return Q.all(style.map(this.request));
    }else {
        return  Q.all(style.map(this.readArrayFiles));
    }
};

MediaQuerieRotine.prototype.readArrayFiles = function (file) {
    var array = [];
    var deferred = Q.defer();
    fs.readFile(file.css, 'utf8', function(err, result){
        array = [];
        array.css = result;
        array.html = file.html;
        deferred.resolve(array);
    });
    return deferred.promise;
};

MediaQuerieRotine.prototype.request = function (url) {
    var deferred = Q.defer();
    var array = [];
    needle.get( url.css, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            array = [];
            array.css = body;
            array.html = url.html;
            deferred.resolve(array);
        }
    });
    return deferred.promise;
};

MediaQuerieRotine.prototype.analysisCss = function (arrayStyle) {
    var media = [];
    var cssFile = null;
    this.verifyArray = [];
    this.verifyAdExists = false;
    var breakPoints = null;
    for (var i = 0; i < arrayStyle.length; i++) {
        cssFile = arrayStyle[i];
        breakPoints = null;
        if (cssFile !== undefined) {
            breakPoints = this.getMedia(cssFile);
        }
        if (breakPoints.length > 0) {
            media[i] = breakPoints;
        }
    }
    return media;
};

MediaQuerieRotine.prototype.getMedia = function (cssFile) {
    var ast = mensch.parse(cssFile.css);
    var tree = null;
    var media = [];
    var array = [];
    var size = null;
    var mediaArray = [];
    var arrayBanner = [];
    var res = null;
    var arrayMedia;
    for (var i = 0; i < ast.stylesheet.rules.length; i++) {
        tree = ast.stylesheet.rules[i];
        if (tree.type === 'media'){
            mediaArray = this.clearMedia(tree.name);
            for(var index = 0; index < mediaArray.length; index++){
                size = this.clearMedia(tree.name)[0];
                array = [];
                if (this.verifyArray[size] === undefined){
                    array.size = size + 'x' + '768';
                    array.html  = cssFile.html;
                    media.push(array);
                }
                this.verifyArray[size] = size + 'x' + '768';
            }

            this.urlHtml = cssFile.html;
            res = this.findAdBanner(tree.rules);
            if (res !== null && res !== undefined){
                console.log(res);
                arrayBanner.push(res);
            }

        }
    }
    if ( arrayBanner.length >0 ) {
        arrayMedia = arrayBanner;
    } else {
        arrayMedia = media;
    }

    return arrayMedia;
};


MediaQuerieRotine.prototype.findAdBanner = function (tree) {
    var item = null;
    var res = null;
    for(var i=0; i < tree.length; i++){
        if (tree[i].selectors !== undefined) {
            item = this.findKey(tree[i], '#breakshot');
            if (item !== undefined){
                res = item;
            }
        }
    }
    if (res !== null){
        return res;
    }
};

MediaQuerieRotine.prototype.findKey = function (obj, selector) {
    var properties = null;
    for(var index=0; index < obj.selectors.length; index++){
        if (obj.selectors[index] === selector) {
            console.log(obj);
            properties = this.findProperties(obj);
        }
    }
    if (properties !== null){
        return properties;
    }
};

MediaQuerieRotine.prototype.findProperties = function (obj){
    var items = [],
    width = '',
    height = '';
    for(var i=0; i < obj.declarations.length; i++) {
        if (obj.declarations[i].name === 'width'){
            width = obj.declarations[i].value.replace( /\D/g, '');
        }
        if (obj.declarations[i].name === 'height') {
            height = obj.declarations[i].value.replace( /\D/g, '');
        }
    }
    items.size = width + 'x' + height;
    if('height' in items && 'width'in items) {
        items.html = this.urlHtml;
    }
    return items;
};

MediaQuerieRotine.prototype.clearMedia = function (media){
    var mediaWithSpaces = media.replace( /\D/g, ' ');
    var arrayMedia = mediaWithSpaces.split(' ');
    return arrayMedia.filter(this.isNotNull);
};

MediaQuerieRotine.prototype.isNotNull = function (item) {
    return item !== '' && item > 100;
};

module.exports = new MediaQuerieRotine();
