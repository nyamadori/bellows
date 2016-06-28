/*global bellows*/
(function($, global){
    "use strict";
    bellows();

    bellows({
        root        : ".js-bellows2",
        interlocking: true,
        startCurrent: 0,
        duration    : 600,
        onOpen      : function(instance){
            console.log(instance);
        }
    });

    bellows({
        root       : ".js-bellows3",
        haveTrigger: true
    });

})(jQuery, (this || 0).self || global);
