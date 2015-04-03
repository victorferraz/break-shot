'use strict';

var Defaultsizes = function () {};

Defaultsizes.prototype.getCommomScreens = function (settings) {
    this.settings = settings;
    var screenSizes = [{
        0: {
            'width':320, 'height':568, 'html':this.settings.origin
        },
        1: {
            'width':360, 'height':640, 'html':this.settings.origin
        },
        2: {
            'width':320, 'height':480, 'html':this.settings.origin
        },
        4: {
            'width':800, 'height':600, 'html':this.settings.origin
        },
        5: {
            'width':1024, 'height':768, 'html':this.settings.origin
        },
        6: {
            'width':1280, 'height':1024, 'html':this.settings.origin
        },
        7: {
            'width':1366, 'height':768, 'html':this.settings.origin
        },
        8: {
            'width':1920, 'height':1200, 'html':this.settings.origin
        },
    }];
    return screenSizes;
};

module.exports = new Defaultsizes();
