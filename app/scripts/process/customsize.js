'use strict';

var CustomSize = function () {};

CustomSize.prototype.getSizes = function (settings) {
    this.settings = settings;
    return this.mountArraySizes();
};

CustomSize.prototype.mountArraySizes = function () {
    var arraySize = [];
    var data = [];
    var customSize = this.settings.customSize;

    for(var i=0; i<customSize.length; i++) {
        arraySize = [];
        arraySize.size = customSize[i].width + 'x' + customSize[i].height;
        arraySize.html = this.settings.origin;
        data.push(arraySize);
    }
    return data;
};

module.exports = new CustomSize();
