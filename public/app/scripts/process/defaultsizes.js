'use strict';

var Defaultsizes = function () {};

Defaultsizes.prototype.getCommomScreens = function (settings) {
    this.settings = settings;
    return [
            '320x568',
            '360x640',
            '320x480',
            '800x600',
            '1024x768',
            '1280x1024',
            '1366x768',
            '1920x1200',
        ];
};

module.exports = new Defaultsizes();
