(function(definition){
    "use strict";

    var moduleName = "bellows";
    var root = (typeof self === "object" && self.self === self && self) || (typeof global === "object" && global.global === global && global);

    if (typeof exports === "object"){
        module.exports = definition(root, require("jquery"));
    } else {
        root[moduleName] = definition(root, $);
    }
})(function(root, $){
    "use strict";

    // -------------------------------------------------------
    // utility functions
    // -------------------------------------------------------
    /**
     * judge exist function
     * @param  {any} x anything
     * @return {boolean}
     */
    function existy(x){
        return x != null;
    }

    /**
     * judge true
     * @param  {any} x anything
     * @return {boolean}
     */
    function truthy(x){
        return (x !== false) && existy(x);
    }

    /**
     * trim string "."
     * @param  {string} string text
     * @return {string}        cutted "." string
     */
    function trimDot(string){
        return string.replace(".", "");
    }

    /**
     * judge undefined
     * @param  {any} obj anything
     * @return {boolean}
     */
    function isUndefined(obj){
        return obj === void 0;
    }


    // -------------------------------------------------------
    // module
    // -------------------------------------------------------

    /**
     * module factory
     * this module is dependent on jQuery
     * @prop {string} rootElement default root element class or id
     * @prop {array} instance
     * @namespace
     */
    function factory(param){

        var rootElement = ".js-bellows";
        var opt = !isUndefined(param) ? param : {};

        var $list;
        if (isUndefined(opt.root)) $list = $(rootElement);
        if (!isUndefined(opt.root)) $list = opt.root instanceof jQuery ? param.root : $(param.root);

        var length = $list.length;
        if (length < 0) return false;

        var mappedList = [];
        for (var i = 0; i < length; i++){
            mappedList[i] = new Module(opt, $list[i]);
        }
        return mappedList;
    }


    /**
     * constructor
     * @type {Function}
     */
    function Module(opt, moduleRoot){

        // options
        this.opt = {
            root       : moduleRoot,
            head       : !isUndefined(opt.head) ? opt.head : ".js-bellows__head",
            body       : !isUndefined(opt.body) ? opt.body : ".js-bellows__body",
            closeBtn   : !isUndefined(opt.closeBtn) ? opt.closeBtn : ".js-bellows__closeBtn",
            openedClass: !isUndefined(opt.openedClass) ? opt.openedClass : "js-isOpen",

            animation: !isUndefined(opt.animation) ? opt.animation : true,
            duration : !isUndefined(opt.duration) ? opt.duration : 400,

            startCurrent: !isUndefined(opt.startCurrent) ? opt.startCurrent : null,
            interlocking: opt.interlocking || false,

            // callback
            onOpen      : opt.onOpen || null,
            onClose     : opt.onClose || null,
            onClick     : opt.onClick || null,
            onAnimateEnd: opt.onAnimateEnd || null
        };

        // elements
        this.$root = $(moduleRoot);
        this.$head = this.$root.find(this.opt.head);
        this.$body = this.$root.find(this.opt.body);
        this.$closeBtn = this.$root.find(this.opt.closeBtn);

        // states
        this.currentIndex = !isUndefined(this.opt.startCurrent) ? this.opt.startCurrent : 0;

        // init
        if (this.isJsAnimation()) this.$body.hide();
        if (this.isCssAnimation()) this.$root.addClass("is-transition");

        if (this.opt.startCurrent !== null) this.open();

        // set event
        this.setClickEvent();
    }


    Module.prototype.setClickEvent = function(){
        var self = this;
        this.$head.on("click", function(e){
            self.clickEventHandler(e);
        });
        this.$closeBtn.on("click", function(){
            self.closeEventHandler();
        });
    };
    Module.prototype.clickEventHandler = function(e){
        this.toggle(e.currentTarget);
        return this;
    };

    Module.prototype.closeEventHandler = function(){
        this.close('end');
        return this;
    };

    /**
     * open body panel
     */
    Module.prototype.open = function(type){
        var self = this;

        this.$head.eq(this.currentIndex)
            .addClass(this.opt.openedClass);

        this.$body.eq(this.currentIndex)
            .addClass(this.opt.openedClass);

        if (this.isJsAnimation()){
            this.$body.eq(this.currentIndex)
                .slideDown(this.opt.duration, function(){
                    // run callback
                    if (type === 'end' && typeof self.opt.onAnimateEnd === 'function') self.opt.onAnimateEnd();
                });
        }
        // run callback
        if (type === 'end' && typeof self.opt.onOpen === 'function') self.opt.onOpen();

        return false;
    };


    /**
     * close body panel
     * @returns {boolean}
     */
    Module.prototype.close = function(type){
        var self = this;

        this.$head.eq(this.currentIndex)
            .removeClass(this.opt.openedClass);

        this.$body.eq(this.currentIndex)
            .removeClass(this.opt.openedClass);

        if (this.isJsAnimation()){
            this.$body.eq(this.currentIndex)
                .slideUp(this.opt.duration, function(){
                    // run callback
                    if (type === 'end' && typeof self.opt.onAnimateEnd === 'function') self.opt.onAnimateEnd();
                });
        }

        // run callback
        if (type === 'end' && typeof self.onClose === 'function') self.opt.onClose();

        return false;
    };

    Module.prototype.closeAll = function(type){
        var self = this;

        this.$head.removeClass(this.opt.openedClass);
        this.$body.removeClass(this.opt.openedClass)
            .slideUp(this.opt.duration, function(){
                // run callback
                if (type === 'end' && typeof self.opt.onAnimateEnd === 'function') self.opt.onAnimateEnd();
            });

        // run callback
        if (type === 'end' && typeof self.opt.onClose === 'function') self.opt.onClose();

        return false;
    };


    /**
     * toggle accordion
     * @returns {boolean}
     */
    Module.prototype.toggle = function(clickElement){

        if (clickElement == null) clickElement = null;

        this.setCurrent(clickElement);

        // run callback
        if (typeof this.opt.onClick === 'function') this.opt.onClick();

        if ($(clickElement).hasClass(this.opt.openedClass)){
            if (this.opt.interlocking){
                this.closeAll('end');
            } else {
                this.close('end');
            }
        } else {
            if (this.opt.interlocking) this.closeAll();
            this.open('end');
        }

        return false;
    };


    /**
     * get current element index
     * @return {boolean} false
     */
    Module.prototype.setCurrent = function(clickElement){
        this.currentIndex = this.$head.index(clickElement);
        return false;
    };


    Module.prototype.isJsAnimation = function(){
        return !!this.opt.animation && this.opt.animation !== 'css';
    };


    Module.prototype.isCssAnimation = function(){
        return this.opt.animation === 'css';
    };


    return factory;
});
