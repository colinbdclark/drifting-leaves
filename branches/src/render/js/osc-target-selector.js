/*
Copyright 2022 Colin Clark. Distributed under the MIT license.
*/

"use strict";

var driftingLeaves = fluid.registerNamespace("driftingLeaves");

fluid.defaults("driftingLeaves.oscTargetSelector", {
    gradeNames: ["flock.ui.selectBox"],

    model: {
        options: [
            {
                id: "none",
                name: "None"
            },
            {
                id: "bubbles",
                name: "Bubbles"
            },
            {
                id: "vcvRack",
                name: "VCV Rack"
            }
        ],

        selection: "none"
    }
});
