/*
Copyright 2022 Colin Clark. Distributed under the MIT license.
*/

"use strict";

var driftingLeaves = fluid.registerNamespace("driftingLeaves");

fluid.defaults("driftingLeaves.bubblesOSCTarget", {
    gradeNames: "driftingLeaves.oscTarget",

    name: "Bubbles",

    message: {
        address: "/layers/0/opacity"
    },

    oscPortOptions: {
        remoteAddress: "127.0.0.1",
        remotePort: 57122
    }
});

