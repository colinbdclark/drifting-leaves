/*
Copyright 2022 Colin Clark. Distributed under the MIT license.
*/

"use strict";

var driftingLeaves = fluid.registerNamespace("driftingLeaves");

fluid.defaults("driftingLeaves.oscTarget", {
    gradeNames: "driftingLeaves.oscModelComponent",

    oscPortOptions: {
        metadata: true
    },

    message: {
        args: [
            {
                type: "f",
                value: 0.0
            }
        ]
    },

    invokers: {
        sendValue: {
            funcName: "driftingLeaves.oscTarget.sendValue",
            args: [
                "{that}",
                "{arguments}.0", // Address
                "{arguments}.1"  // Value
            ]
        }
    }
});

driftingLeaves.oscTarget.sendValue = function (that, address, value) {
    // "" is falsey in JS.
    if (!address) {
        return;
    }

    let msg = fluid.copy(that.options.message);
    msg.address = address;
    msg.args[0].value = value;
    that.oscPort.send(msg);
};
