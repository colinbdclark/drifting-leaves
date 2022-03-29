/*
Copyright 2022 Colin Clark

Licensed under the MIT license.
https://github.com/colinbdclark/bubbles/raw/master/LICENSE
*/

"use strict";

fluid.defaults("driftingLeaves.branches", {
    gradeNames: ["bubbles.oscSource"],

    leafNames: {
        "3c6151611bc": "Oak",
        "7c9ebdf93f84": "Maple",
        "7c9ebd3ad2c8": "Poplar",
        "84cca8783ffc": "Aspen"
    },

    model: {
        /*
        <macAddress>: {
            displayName: "poplar",
            x: 0,
            y: 1.0,
            z: -1.0,
            scale: 1.0,
            offset: 0.0
        }
        */
    },

    oscPortOptions: {
        localAddress: "0.0.0.0",
        localPort: 57121
    },

    components: {
        sourceView: {
            type: "driftingLeaves.oscSourceView",
            container: "#server-view",
            options: {
                localPort: "{branches}.options.oscPortOptions.localPort",
                model: "{branches}.model",
                events: {
                    onReady: "{branches}.events.onReady"
                }
            }
        },

        dynamicComponentManager: {
            type: "bubbles.dynamicComponentManager",
            options: {
                model: "{branches}.model",
                events: {
                    onCreateComponent: "{branches}.events.onAddNewLeaf"
                    // Note: We don't bind to onDestroyComponent,
                    // because there's no way currently to know if
                    // a Leaf has disappeared from the network.
                }
            }
        }
    },

    events: {
        onAddNewLeaf: null
    },

    listeners: {
        "onCreate.openOSCPort": "{oscSource}.oscPort.open()",

        "onMessage.modelizeOSC": {
            funcName: "driftingLeaves.branches.modelizeOSCMessage",
            args: [
                "{that}",
                "{branches}.options.leafNames",
                "{arguments}.0"
            ]
        },

        "onAddNewLeaf.renderLeafContainer": {
            func: "{sourceView}.renderLeafContainer",
            args: [
                "{arguments}.1"  // Leaf Model
            ]
        }
    }
});

driftingLeaves.branches.modelizeOSCMessage = function (that, leafNames, msg) {
    let macAddress = msg.args[0];
    that.applier.change(macAddress, {
        macAddress: macAddress,
        displayName: leafNames[macAddress] || "Unknown Leaf",
        x: msg.args[1],
        y: msg.args[2],
        z: msg.args[3]
    });
};
