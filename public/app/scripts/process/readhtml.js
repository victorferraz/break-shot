'use strict';

var Q = require('q')
var request = require('request');
var fs = require('fs');

var ReadHtml = function () {
    this.arrayFile = [];
};

ReadHtml.prototype.getHtmlArray = function (data) {
    var html = data.file;
    this.arrayFiles = html.split(';');
    var htmlArray = [];
    var array = [];
    var fileRead = '';
    var htmlData = '';
    if (data.from === 'from-url') {
        fileRead = this.readUrl(data.url);
        htmlData = fileRead.then(function(file){
            array.html = data.url;
            array.file = file;
            htmlArray.push(array);
            return htmlArray;
        });
    }else if (data.from === 'from-file'){
        htmlData = Q.all(this.arrayFiles.map(this.readFiles.bind(this)));
    }
    return htmlData;
};

ReadHtml.prototype.readUrl = function (url) {
    var deferred = Q.defer();
    request(url, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            deferred.resolve(body.toString());
        }
    });
    return deferred.promise;
};

ReadHtml.prototype.readFiles = function (file) {
    var self = this;
    var array = [];
    var deferred = Q.defer();
    fs.readFile(file, 'utf8', function(err, result){
        array = [];
        array.file = result;
        array.html = file;
        deferred.resolve(array);
    });
    return deferred.promise;
};


module.exports = new ReadHtml();
