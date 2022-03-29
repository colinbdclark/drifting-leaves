/*
Copyright 2022 Colin Clark

Licensed under the MIT license.
https://github.com/colinbdclark/bubbles/raw/master/LICENSE
*/

// TODO: Copy-pasted from Bubbles; move this into an osc.js-infusion library.

"use strict";

fluid.registerNamespace("bubbles");

fluid.defaults("bubbles.oscUDPPort", {
    gradeNames: ["bubbles.oscPort"],

    oscPortType: "osc.UDPPort",

    oscPortOptions: {
        localAddress: "0.0.0.0",
        localPort: 57122
    }
});
