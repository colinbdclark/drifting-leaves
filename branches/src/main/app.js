/*
Copyright 2022 Colin Clark. Distributed under the MIT license.
*/

"use strict";

let fluid = require("infusion");
let electron = require("infusion-electron");
let osc = require("osc");

fluid.defaults("driftingLeaves.app", {
    gradeNames: "electron.app",

    components: {
        mainWindow: {
            createOnEvent: "onReady",
            type: "driftingLeaves.mainWindow"
        }
    }
});

fluid.defaults("driftingLeaves.mainWindow", {
    gradeNames: ["electron.browserWindow"],

    windowOptions: {
        title: "Leaf Drifts",
        backgroundColor: "#000000",
        width: 1920,
        height: 1080,
        x: 0,
        y: 0,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    },

    model: {
        url: {
            expander: {
                funcName: "fluid.stringTemplate",
                args: [
                    "%url/src/render/html/main-window.html",
                    "{app}.env.appRoot"
                ]
            }
        }
    }
});
