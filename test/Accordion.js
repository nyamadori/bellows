"use strict";

describe('options when no paramater', function () {

    var dom, acd1, instance;
    beforeEach(function () {
        dom = document.createElement('div');
        dom.className = "js-acd";
        document.getElementsByTagName('body')[0].appendChild(dom);
        acd1 = new Accordion();
        instance = acd1[0][0];
    });

    it('duration is 400', function () {
        assert(instance.opt.duration === 400, 'no paramater is 400');
    });

    it('head is ".js-acd__head"', function () {
        assert(instance.opt.head === ".js-acd__head", "opt.head isn't \".js-acd__head\"");
    });
});
