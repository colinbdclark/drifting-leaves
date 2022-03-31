/*
Copyright 2022 Colin Clark. Distributed under the MIT license.
*/

// TODO: Copy-pasted and renamed from Bubbles;
//       move this into an osc.js-infusion library.

"use strict";

var driftingLeaves = fluid.registerNamespace("driftingLeaves");

fluid.defaults("driftingLeaves.oscModelComponent", {
    gradeNames: "fluid.modelComponent",

    oscPortOptions: {},

    components: {
        oscPort: {
            type: "bubbles.oscUDPPort",
            options: {
                oscPortOptions: "{oscModelComponent}.options.oscPortOptions",
                events: {
                    onReady: "{oscModelComponent}.events.onReady",
                    onMessage: "{oscModelComponent}.events.onMessage",
                    onError: "{oscModelComponent}.events.onError"
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
