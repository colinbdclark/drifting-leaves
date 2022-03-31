/*
Copyright 2022 Colin Clark. Distributed under the MIT license.
*/

"use strict";

fluid.defaults("driftingLeaves.leafAxisTargetView", {
    gradeNames: "fluid.viewComponent",

    model: {
        target: "none",
        address: ""
    },

    components: {
        targetSelector: {
            type: "driftingLeaves.oscTargetSelector",
            container: "{leafAxisTargetView}.dom.selectBox",
            options: {
                model: {
                    selection: "{leafAxisTargetView}.model.target"
                }
            }
        }
    },

    events: {
        afterRender: null
    },

    listeners: {
        // TODO: fluid-binder!
        "onCreate.pushAddressValue": {
            "this": "{that}.dom.address",
            method: "val",
            args: ["{that}.model.address"]
        },

        "onCreate.bindAddressListener": {
            func: "driftingLeaves.leafAxisView.bindControlChange",
            args: ["{that}", "address"]
        }
    },

    selectors: {
        selectBox: ".leaf-axis-target-select",
        address: ".leaf-axis-target-address"
    }
});
