/*
Copyright 2022 Colin Clark. Distributed under the MIT license.
*/

/*global electron*/

// TODO: Copy/pasted from Bubbles; move this into an osc.js-infusion library.

"use strict";

var bubbles = fluid.registerNamespace("bubbles");
// eslint-disable-next-line no-unused-vars
var osc = electron.nodeIntegration.require("osc");

fluid.defaults("bubbles.oscPort", {
    gradeNames: ["fluid.component"],

    oscPortType: undefined,
    oscPortOptions: undefined,

    members: {
        rawOSCPort: null
    },

    invokers: {
        open: {
            "this": "{that}.rawOSCPort",
            method: "open"
        },

        send: {
            "this": "{that}.rawOSCPort",
            method: "send",
            args: ["{arguments}.0"]
        }
    },

    events: {
        onReady: null,
        onMessage: null,
        onError: null
    },

    listeners: {
        "onCreate.createPort": {
            funcName: "bubbles.oscPort.createPort",
            args: ["{that}"]
        },

        "onCreate.bindReady": {
            priority: "after:createPort",
            "this": "{that}.rawOSCPort",
            method: "on",
            args: ["ready", "{that}.events.onReady.fire"]
        },

        "onCreate.bindMessage": {
            priority: "after:createPort",
            "this": "{that}.rawOSCPort",
            method: "on",
            args: ["message", "{that}.events.onMessage.fire"]
        },

        "onCreate.bindError": {
            priority: "after:createPort",
            "this": "{that}.rawOSCPort",
            method: "on",
            args: ["error", "{that}.events.onError.fire"]
        },

        "onError": {
            "this": "console",
            method: "log",
            args: ["{arguments}.0"]
        }
    }
});

bubbles.oscPort.createPort = function (that) {
    // Infusion options are frozen in 4.x,
    // and osc.js unwisely directly mutates options objects
    // passed to it, so we need to make a copy first.
    var PortConstructor = fluid.get(globalThis, that.options.oscPortType);
    var o = fluid.copy(that.options.oscPortOptions);
    var rawOSCPort = new PortConstructor(o);
    that.rawOSCPort = rawOSCPort;
};
