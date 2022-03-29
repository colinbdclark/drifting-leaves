/*
Copyright 2022 Colin Clark

Licensed under the MIT license.
https://github.com/colinbdclark/bubbles/raw/master/LICENSE
*/

// TODO: Copy-pasted from Bubbles; move this into an osc.js-infusion library.

"use strict";

var bubbles = fluid.registerNamespace("bubbles");

fluid.defaults("bubbles.oscSource", {
    gradeNames: "fluid.modelComponent",

    oscPortOptions: {
        localAddress: "0.0.0.0",
        localPort: 57122
    },

    components: {
        oscPort: {
            type: "bubbles.oscUDPPort",
            options: {
                oscPortOptions: "{oscSource}.options.oscPortOptions",
                events: {
                    onReady: "{oscSource}.events.onReady",
                    onMessage: "{oscSource}.events.onMessage",
                    onError: "{oscSource}.events.onError"
                }
            }
        }
    },

    events: {
        onReady: null,
        onMessage: null,
        onError: null
    },

    listeners: {
        "onCreate.openPort": "{oscPort}.open()"
    }
});
