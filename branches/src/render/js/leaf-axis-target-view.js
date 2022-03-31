/*
Copyright 2022 Colin Clark. Distributed under the MIT license.
*/

fluid.defaults("driftingLeaves.leafAxisTargetView", {
    gradeNames: "fluid.viewComponent",

    defaultAddresses: {
        "bubbles": "/layers/0/opacity",
        "vcvRack": "/ch/1"
    },

    components: {
        targetSelector: {
            type: "driftingLeaves.oscTargetSelector",
            container: "{leafAxisTargetView}.dom.selectBox"
        }
    },

    events: {
        afterRender: null
    },

    selectors: {
        selectBox: ".leaf-axis-target-select",
        address: ".leaf-axis-target-address"
    }
});
