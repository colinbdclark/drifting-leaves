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
        localAddress: "0.0.0.0",
        localPort: 57125,

        remoteAddress: "192.168.1.100",
        remotePort: 57123
    }
});

