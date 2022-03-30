/*
Copyright 2022 Colin Clark. Distributed under the MIT license.
*/

fluid.defaults("driftingLeaves.leafAxisView", {
    gradeNames: "fluid.viewComponent",

    axis: "x",

    defaultAxisValues: {
        scale: 1.0,
        offset: 0.0,
        rectify: 0
    },

    modelListeners: {
        "*": {
            funcName: "driftingLeaves.leafAxisView.refreshView",
            args: [
                "{that}",
                "{that}.options.axis",
                "{that}.dom.value",
                "{change}"
            ]
        }
    },

    listeners: {
        "onCreate.setDefaultModelValues": {
            funcName: "driftingLeaves.leafAxisView.setDefaultModelValues",
            args: ["{that}"]
        },

        "onCreate.renderRow": {
            funcName: "driftingLeaves.leafAxisView.renderRow",
            args: ["{that}"]
        },

        "onCreate.bindScaleKnob": {
            priority: "after:renderRow",
            funcName: "driftingLeaves.leafAxisView.bindControl",
            args: ["{that}", "{that}.options.axis", "scale"]
        },

        "onCreate.bindOffsetKnob": {
            priority: "after:renderRow",
            funcName: "driftingLeaves.leafAxisView.bindControl",
            args: ["{that}", "{that}.options.axis", "offset"]
        },

        "onCreate.bindRectifySwitch": {
            priority: "after:renderRow",
            funcName: "driftingLeaves.leafAxisView.bindControl",
            args: ["{that}", "{that}.options.axis", "rectify"]
        }
    },

    selectors: {
        value: ".leaf-axis-value",
        scale: ".leaf-axis-scale",
        offset: ".leaf-axis-offset",
        rectify: ".leaf-axis-rectify"
    },

    markup: {
        row: "<span class='leaf-axis-value'>0.0</span>\
        <webaudio-knob class='leaf-axis-scale' diameter='32' min='-2.0' max='4.0' value='%scale' step='0.001' tooltip='Scale'></webaudio-knob> \
        <webaudio-knob class='leaf-axis-offset' diameter='32' min='-1.0' max='1.0' value='%offset' step='0.001' tooltip='Offset'></webaudio-knob> \
        <webaudio-switch class='leaf-axis-rectify' diameter='24' type='toggle' value='%rectify' tooltip='Rectify'></webaudio-switch>"
    }
});

driftingLeaves.leafAxisView.setDefaultModelValues = function (that) {
    that.applier.change(that.options.axis, that.options.defaultAxisValues);
};

driftingLeaves.leafAxisView.renderRow = function (that) {
    let rowMarkup = fluid.stringTemplate(that.options.markup.row,
        that.model[that.options.axis]);
    that.container.append(rowMarkup);
};

driftingLeaves.leafAxisView.bindControl = function (that, axis, parameter) {
    that.locate(parameter)[0].addEventListener("change", function (event) {
        that.applier.change([axis, parameter], event.target.value);
    });
};

driftingLeaves.leafAxisView.refreshView = function (that, axis, valueEl, change) {
    if (change.path[0] === axis) {
        let rounded = (Math.round(
            (change.value.value + Number.EPSILON) * 1000) / 1000).toFixed(3);
        let formatted = rounded >= 0 ? "+" + String(rounded) : String(rounded);
        if (valueEl.text() != formatted) {
            valueEl.text(formatted);
        }
    }
};
