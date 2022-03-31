/*
Copyright 2022 Colin Clark. Distributed under the MIT license.
*/

"use strict";

var driftingLeaves = fluid.registerNamespace("driftingLeaves");

fluid.defaults("driftingLeaves.oscTargetDispatcher", {
    gradeNames: ["fluid.component"],

    events: {
        onSendValue: null
    },

    listeners: {
        "onSendValue.dispatchToChild": {
            funcName: "driftingLeaves.oscTargetDispatcher.dispatchToChild",
            args: [
                "{that}",
                "{arguments}.0", // Name of target
                "{arguments}.1", // Target address
                "{arguments}.2"  // The value to send as an OSC message.
            ]
        }
    }
});

driftingLeaves.oscTargetDispatcher.dispatchToChild = function (that,
    targetName, address, value) {
    if (targetName === "none") {
        return;
    }

    let target = that[targetName];

    if (!target) {
        console.log("No OSC target named '" + targetName + "' found.");
        return;
    }

    target.sendValue(address, value);
};
