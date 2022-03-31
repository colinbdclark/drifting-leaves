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
        // TODO: Issue in osc.js.
        // Why do I have to bind to a local port
        // just to send a message?
        localAddress: "127.0.0.1",
        localPort: 57124,

        remoteAddress: "127.0.0.1",
        remotePort: 57122
    }
});

