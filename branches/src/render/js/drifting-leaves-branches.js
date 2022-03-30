/*
Copyright 2022 Colin Clark. Distributed under the MIT license.
*/

"use strict";

fluid.defaults("driftingLeaves.branches", {
    gradeNames: ["driftingLeaves.oscModelComponent"],

    leafNames: {
        "3c6151611bc": "Oak",
        "7c9ebdf93f84": "Maple",
        "7c9ebd3ad2c8": "Poplar",
        "84cca8783ffc": "Aspen",
        "7c9ebd3ad2b4": "Birch",
        "7c9ebd3ab7b0": "Pine",
        "7c9ebd3ad2c4": "Cedar",
        "9c9c1fc17118": "Juniper",
        "7c9ebd3ad238": "Fir",
        "3c61516d98": "Larch"
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
        },

        bubblesOSCTarget: {
            type: "driftingLeaves.bubblesOSCTarget"
        },

        vcvRackOSCTarget: {
            type: "driftingLeaves.vcvRackOSCTarget"
        }
    },

    events: {
        onAddNewLeaf: null
    },

    listeners: {
        "onCreate.openPort": "{oscPort}.open()",

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
        displayName: leafNames[macAddress] || macAddress,
        x: {
            value: msg.args[1]
        },
        y: {
            value: msg.args[2]
        },
        z: {
            value: msg.args[3]
        }
    });
};
