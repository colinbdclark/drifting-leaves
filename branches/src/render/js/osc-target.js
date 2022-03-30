/*
Copyright 2022 Colin Clark. Distributed under the MIT license.
*/

"use strict";

var driftingLeaves = fluid.registerNamespace("driftingLeaves");

fluid.defaults("driftingLeaves.oscTarget", {
    gradeNames: "driftingLeaves.oscModelComponent",

    message: {
        args: [
            {
                type: "f",
                value: 0.0
            }
        ]
    }
});
