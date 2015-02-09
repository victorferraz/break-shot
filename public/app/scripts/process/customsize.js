'use strict';

var CustomSize = function () {};

CustomSize.prototype.getSizes = function (urlMain, settings) {
    this.urlMain = urlMain;
    this.settings = settings;
    return this.mountArraySizes();
};

CustomSize.prototype.mountArraySizes = function () {
    var arraySize = [];
    var data = [];
    var customSize = this.settings.customSize;

    for(var i=0; i<customSize.length; i++) {
        arraySize = [];
        arraySize.height = customSize[i].height;
        arraySize.width = customSize[i].width;
        arraySize.html = this.settings.origin;
        data.push(arraySize);
    }
    return data;
};

module.exports = new CustomSize();