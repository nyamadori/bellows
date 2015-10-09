(function(definition){
    "use strict";

    var moduleName = "Accordion";

    var root = (typeof self === "object" && self.self === self && self) || (typeof global === "object" && global.global === global && global);

    if (typeof exports === "object") {
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
    function existy(x){ return x != null; }

    /**
     * judge true
     * @param  {any} x anything
     * @return {boolean}
     */
    function truthy(x){ return (x !== false) && existy(x); }

    /**
     * trim string "."
     * @param  {string} string text
     * @return {string}        cutted "." string
     */
    function trimDot(string){ return string.replace(".", ""); }

    /**
     * judge undefined
     * @param  {any} x anything
     * @return {boolean}
     */
    function isUndefined(obj){ return obj === void 0; };


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

        var rootElement = ".js-acd";
        var opt = existy(param) ? param : {};

        var $self;
        if ( existy(opt.root) ) {
            if(opt.root instanceof jQuery) {
                $self = param.root;
            } else {
                $self = $(param.root);
            }
        } else {
            $self = $(rootElement);
        }

        this[0] = $self.map(function(key, val){
            return new Module(opt, val);
        });
    }


    /**
     * constructor
     * @type {Function}
     */
    function Module(opt, moduleRoot){

        // options
        this.opt = {
            root        : moduleRoot,
            head        : existy(opt.head) ? opt.head : ".js-acd__head",
            body        : existy(opt.body) ? opt.body : ".js-acd__body",
            closeBtn    : existy(opt.closeBtn) ? opt.closeBtn : ".js-acd__closeBtn",
            openedClass : existy(opt.openedClass) ? opt.openedClass : "js-isOpen",

            animation   : truthy(opt.animation) ? opt.animation : true,
            duration    : !isUndefined(opt.duration) ? opt.duration : 400,

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
        if (this.isJsAnime()) this.$body.hide();
        if (this.isCssAnime()) this.$root.addClass("is-transition");

        if (this.opt.startCurrent !== null) this.open();

        // set event
        this.setClickEvent();
    }


    Module.prototype.setClickEvent = function() {
        this.$head.on("click", {module: this}, this.clickEventHandler);
        this.$closeBtn.on("click", {module: this}, this.closeEventHandler);
    };
    Module.prototype.clickEventHandler = function(e) {
        var self = e.data.module;
        var target = e.target;
        self.toggle(target);
        return false;
    };

    Module.prototype.closeEventHandler = function(e) {
        var self = e.data.module;
        var target = e.target;
        self.close('end');
        return false;
    };

    /**
     * open body panel
     */
    Module.prototype.open = function(type){
        var self = this;

        this.$head.eq(this.currentIndex)
            .addClass(this.opt.openedClass);

        this.$body.eq(this.currentIndex)
            .addClass(this.opt.openedClass)

        if (this.isJsAnime()) {
           this.$body.eq(this.currentIndex)
               .slideDown(this.opt.duration,function(){
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
            .removeClass(this.opt.openedClass)

        if (this.isJsAnime()) {
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
            if (this.opt.interlocking) {
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


    Module.prototype.isJsAnime = function(){
        return !!this.opt.animation && this.opt.animation !== 'css';
    }


    Module.prototype.isCssAnime = function(){
        return this.opt.animation === 'css';
    }


    return factory;
});
