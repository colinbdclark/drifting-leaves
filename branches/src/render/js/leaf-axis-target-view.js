/*
Copyright 2022 Colin Clark. Distributed under the MIT license.
*/

fluid.defaults("driftingLeaves.leafAxisTargetView", {
    gradeNames: "fluid.viewComponent",

    targets: [
        "None",
        "Bubbles",
        "VCV Rack"
    ],

    model: {
        name: "None",
        address: "/layer/0/opacity"
    }

});
