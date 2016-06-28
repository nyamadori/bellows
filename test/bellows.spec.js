"use strict";
import assert from "power-assert";
import bellows from "../src/js/bellows.js";

describe('options when no parameter', ()=>{

    let dom, bellows1, instance;

    beforeEach(()=>{
        dom = document.createElement('div');
        dom.className = "js-bellows";
        document.getElementsByTagName('body')[0].appendChild(dom);
        bellows1 = bellows();
        instance = bellows1[0];
    });

    it('duration is 400', ()=>{
        assert(instance.opt.duration === 400, 'no parameter is 400');
    });

    it('head is ".js-bellows__head"', ()=>{
        assert(instance.opt.head === ".js-bellows__head", "opt.head isn't \".js-bellows__head\"");
    });
});
