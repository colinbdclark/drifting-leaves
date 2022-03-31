/*
Copyright 2022 Colin Clark. Distributed under the MIT license.
*/

"use strict";

var driftingLeaves = fluid.registerNamespace("driftingLeaves");

fluid.defaults("driftingLeaves.vcvRackOSCTarget", {
    gradeNames: "driftingLeaves.oscTarget",

    name: "VCV Rack",

    message: {
        address: "/ch/1"
    },

    oscPortOptions: {
        // TODO: Issue in osc.js.
        // Why do I have to bind to a local port
        // just to send a message?
        localAddress: "127.0.0.1",
        localPort: 57125,

        remoteAddress: "127.0.0.1",
        remotePort: 57123
    }
});

