'use strict';

var GetCss = require('../process/getcss');
var MediaQuerieRotine = require('../process/mediaquerierotine');
var TakePrintScreen = require('../process/takeprintscreen');
var ReadHtml = require('../process/readHtml');
var CustomSize = require('../process/customsize');
var DefaultSizes = require('../process/defaultsizes');

var Q = require('q');
var Controller = function () {};

Controller.prototype.go = function (data) {
    var settings = data;
    var readHtml = ReadHtml.getHtmlArray(data);
    var deferred = Q.defer();
    deferred.resolve(readHtml);
    deferred.promise.then( function(readHtml) {
        var urlMain = GetCss.run(readHtml, settings);
        return urlMain;
    }).then( function(urlMain) {
        console.log(urlMain);
        var media = '';
        if (data.size === 'auto-sizing') {
            media = MediaQuerieRotine.getBreakPoints(urlMain, settings);
        } else {
            media = CustomSize.getSizes(settings);
        }
        return media;
    }).then( function(mediaQueries) {
        console.log(mediaQueries);
        var take = TakePrintScreen.takePics(mediaQueries, settings);
        return take;
    });

};

module.exports = new Controller();
