/*global Accordion*/
(function($, global){
    "use strict";
    var acd01 = uiAccordion();
    var acd02 = uiAccordion({
        root        : ".js-acd2",
        interlocking: true,
        startCurrent: 0,
        duration    : 600
    });

})(jQuery, (this || 0).self || global);
