/*
Copyright 2022 Colin Clark. Distributed under the MIT license.
*/

"use strict";

fluid.defaults("driftingLeaves.leafAxisView", {
    gradeNames: "fluid.viewComponent",

    axis: undefined,

    model: {
        scale: 1.0,
        offset: 0.0,
        rectify: 0,
        target: "none",
        address: "/ch/1",
        formattedValue: "+0.000",
        transformedValue: 0.0
    },

    modelRelay: [
        {
            namespace: "displayFormatValue",
            target: "formattedValue",
            singleTransform: {
                type: "fluid.transforms.free",
                func: "driftingLeaves.leafAxisView.displayFormatValue",
                args: ["{that}.model.value"]
            }
        },
        {
            namespace: "transformValue",
            target: "transformedValue",
            singleTransform: {
                type: "fluid.transforms.free",
                func: "driftingLeaves.leafAxisView.transformValue",
                args: [
                    "{that}.model.value",
                    "{that}"
                ]
            }
        }
    ],

    modelListeners: {
        formattedValue: {
            "this": "{that}.dom.value",
            method: "text",
            args: "{change}.value"
        },

        transformedValue: {
            func: "{branches}.events.onSendValue.fire",
            args: [
                "{that}.model.target",
                "{that}.model.address",
                "{change}.value"
            ]
        }
    },

    components: {
        targetView: {
            createOnEvent: "afterRender",
            type: "driftingLeaves.leafAxisTargetView",
            container: "{leafAxisView}.container",
            options: {
                model: {
                    target: "{leafAxisView}.model.target",
                    address: "{leafAxisView}.model.address"
                }
            }
        },

        expressionView: {
            createOnEvent: "afterRender",
            type: "driftingLeaves.leafAxisExpressionView",
            container: "{leafAxisView}.dom.expression",
            options: {
                model: {
                    axis: "{leafAxisView}.model"
                }
            }
        }
    },

    events: {
        afterRender: null
    },

    listeners: {
        "onCreate.renderRow": {
            funcName: "driftingLeaves.leafAxisView.renderRow",
            args: ["{that}"]
        },

        "onCreate.bindScaleKnob": {
            priority: "after:renderRow",
            funcName: "driftingLeaves.leafAxisView.bindControlChange",
            args: ["{that}", "scale"]
        },

        "onCreate.bindOffsetKnob": {
            priority: "after:renderRow",
            funcName: "driftingLeaves.leafAxisView.bindControlChange",
            args: ["{that}", "offset"]
        },

        "onCreate.bindRectifySwitch": {
            priority: "after:renderRow",
            funcName: "driftingLeaves.leafAxisView.bindControlChange",
            args: ["{that}", "rectify"]
        }
    },

    selectors: {
        value: ".leaf-axis-value",
        scale: ".leaf-axis-scale",
        offset: ".leaf-axis-offset",
        rectify: ".leaf-axis-rectify",
        expression: ".leaf-axis-expression",
    },

    markup: {
        row: "<span class='leaf-axis-value'>0.0</span>\
        <webaudio-switch class='leaf-axis-rectify' diameter='24' type='toggle' value='%rectify' tooltip='Rectify'></webaudio-switch>\
        <webaudio-knob class='leaf-axis-scale' diameter='32' min='-2.0' max='4.0' value='%scale' step='0.01' tooltip='Scale %s' outline='1' colors='#e00;#333;#fff'></webaudio-knob> \
        <webaudio-knob class='leaf-axis-offset' diameter='32' min='-1.0' max='1.0' value='%offset' step='0.01' tooltip='Offset %s' outline='1' colors='#e00;#333;#fff'></webaudio-knob> \
        <select class='leaf-axis-target-select' outline='1'></select>\
        <input class='leaf-axis-target-address' value='/ch/1' type='text'>\
        <textarea class='leaf-axis-expression' rows='1'></textarea>"
    }
});

driftingLeaves.leafAxisView.renderRow = function (that) {
    let rowMarkup = fluid.stringTemplate(that.options.markup.row, that.model);
    that.container.append(rowMarkup);
    that.events.afterRender.fire();
};

driftingLeaves.leafAxisView.bindControlChange = function (that, parameter) {
    that.locate(parameter)[0].addEventListener("change", function (event) {
        that.applier.change(parameter, event.target.value);
    });
};

driftingLeaves.leafAxisView.displayFormatValue = function (value) {
    let rounded = (Math.round((value + Number.EPSILON) * 1000) / 1000).toFixed(3);
    let formatted = rounded >= 0 ? "+" + String(rounded) : String(rounded);

    return formatted;
};

driftingLeaves.leafAxisView.transformValue = function (value, that) {
    if (!that.model) {
        return;
    }

    if (that.model.rectify === 1) {
        value = Math.abs(value);
    }

    let transformedValue = value *
        that.model.scale + that.model.offset;
    transformedValue = that.expressionView.model.isValid ?
        that.expressionView.model.result : transformedValue;

    return transformedValue;
};
