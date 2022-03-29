/*
Copyright 2022 Colin Clark

Licensed under the MIT license.
https://github.com/colinbdclark/bubbles/raw/master/LICENSE
*/

fluid.defaults("driftingLeaves.leafAxisView", {
    gradeNames: "fluid.viewComponent",

    axis: "x",

    modelListeners: {
        "*": {
            funcName: "driftingLeaves.leafAxisView.refreshView",
            args: ["{that}.options.axis","{that}.dom.value", "{change}"]
        }
    },

    listeners: {
        "onCreate.renderRow": {
            funcName: "driftingLeaves.leafAxisView.renderRow",
            args: ["{that}"]
        }
    },

    selectors: {
        value: ".leaf-axis-value"
    },

    markup: {
        row: "<span class='leaf-axis-value'>0.0</span>\
        <webaudio-knob class='leaf-axis-scale' min='-1.0' max='1.0 value='1.0' step='0.001' tooltip='Scale'></webaudio-knob> \
        <webaudio-knob class='leaf-axis-offset' min='-1.0' max='1.0' value='0' step='0.001' tooltip='Offset'></webaudio-knob>"
    }
});

driftingLeaves.leafAxisView.renderRow = function (that) {
    that.container.append(that.options.markup.row);
};

driftingLeaves.leafAxisView.refreshView = function (axis, valueEl, change) {
    if (change.path[0] === axis) {
        let rounded = (Math.round(
            (change.value + Number.EPSILON) * 1000) / 1000).toFixed(3);
        valueEl.text(rounded);
    }
};
