'use strict';

var cheerio = require('cheerio');
var GetCss = function () {
};

GetCss.prototype.run = function (readHtml, data) {
    this.path = null;
    this.files = null;
    this.htmlArray = [];
    this.mediaQueries = null;
    this.htmlArray = readHtml;
    this.data = data;
    return this.getCss(this.htmlArray);
};

GetCss.prototype.getCss = function (file) {
    var $ = '';
    var link = [];
    var path = '';
    var array = [];
    for (var i = 0; i < file.length; i++) {
        $ = cheerio.load(file[i].file);
        path = '';
        if (this.data.from === 'from-file') {
            path = this.getPath(file[i].html);
        }
        var style = $('link[rel=stylesheet]');
        for(var index=0; index < style.length; index++){
            array = [];
            var cssFile = style[index].attribs.href;
            if (this.data.from === 'from-url') {
                path = this.getPathUrl(cssFile);
            }
            array.css = path + cssFile;
            array.path = path;
            array.html = file[i].html;
            link.push(array);
        }
    }
    return link;
};


GetCss.prototype.getPathUrl = function (cssFile){
    var urlFormated;
    if (cssFile.search('http://') === -1){
        urlFormated = this.data.origin + '/';
    }
    return urlFormated;
};

GetCss.prototype.getPath = function (url){
    var arrayPath = url.split('/');
    arrayPath.pop();
    var urlFormated = arrayPath.join('/') + '/';
    return urlFormated;
};


module.exports = new GetCss();
