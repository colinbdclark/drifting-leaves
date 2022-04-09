/*
Copyright 2022 Colin Clark. Distributed under the MIT license.
*/

"use strict";

fluid.defaults("driftingLeaves.leafAxisExpressionView", {
    gradeNames: "fluid.viewComponent",

    model: {
        axis: undefined,
        expression: "",
        isValid: false,
        result: undefined
    },

    invokers: {
        eval: {
            funcName: "driftingLeaves.leafAxisExpressionView.eval",
            args: ["{that}"]
        }
    },

    events: {
        onParseError: null
    },

    listeners: {
        "onCreate.bindChangeListener": {
            funcName: "driftingLeaves.leafAxisExpressionView.bindChange",
            args: ["{that}"]
        },

        "onParseError.logToConsole": {
            "this": "console",
            method: "log",
            args: ["{arguments}.0"]
        }
    }
});

driftingLeaves.leafAxisExpressionView.bindChange = function (that) {
    that.container[0].addEventListener("change", function (e) {
        that.applier.change("expression", e.target.value);
    });
};

// TODO: Separate the creation of the eval function from invoking it.
driftingLeaves.leafAxisExpressionView.eval = function (that) {
    // Bone-headed globally-scoped eval with the axis model
    // bound to "this".
    let fullExpr = "\"use strict\"; return " + that.model.expression + ";"
    try {
        let exprFn = Function(fullExpr);
        let boundFn = exprFn.bind(that.model.axis);
        let uncoercedResult = boundFn();
        let result = Number(uncoercedResult);
        that.applier.change("isValid", !isNaN(result))
        that.applier.change("result", result);
    } catch (e) {
        that.events.onParseError.fire(e);
        that.applier.change("isValid", false);
    }
};
