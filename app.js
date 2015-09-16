/*global Accordion*/
(function($, _, global){
    "use strict";
    var acd01 = new Accordion();
    var acd02 = new Accordion({
        root        : ".js-acd2",
        interlocking: true,
        startCurrent: 0,
        duration    : 600
    });

})(jQuery, _, (this || 0).self || global);
