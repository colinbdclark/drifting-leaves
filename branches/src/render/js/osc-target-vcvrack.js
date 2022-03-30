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
        remoteAddress: "127.0.0.1",
        remotePort: 57123,
        metadata: true
    }
});

