"use strict";

describe('options when no parameter', function () {

    var dom, bellows1, instance;
    beforeEach(function () {
        dom = document.createElement('div');
        dom.className = "js-bellows";
        document.getElementsByTagName('body')[0].appendChild(dom);
        bellows1 = bellows();
        instance = bellows1[0];
    });

    it('duration is 400', function () {
        assert(instance.opt.duration === 400, 'no parameter is 400');
    });

    it('head is ".js-bellows__head"', function () {
        assert(instance.opt.head === ".js-bellows__head", "opt.head isn't \".js-bellows__head\"");
    });
});
