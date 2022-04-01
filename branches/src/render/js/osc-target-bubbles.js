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
        localAddress: "0.0.0.0",
        localPort: 57124,

        remoteAddress: "192.168.1.101",
        remotePort: 57122
    }
});

