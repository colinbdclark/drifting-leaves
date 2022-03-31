/*
Copyright 2022 Colin Clark. Distributed under the MIT license.
*/

"use strict";

fluid.defaults("driftingLeaves.leafAxisExpressionView", {
    gradeNames: "fluid.viewComponent",

    model: {
        axis: undefined,
        isValid: false,
        result: undefined
    },

    events: {
        onChange: null,
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
        },

        "onChange.eval": {
            funcName: "driftingLeaves.leafAxisExpressionView.eval",
            args: ["{that}", "{arguments}.0", "???"]
        }
    }
});

driftingLeaves.leafAxisExpressionView.bindChange = function (that) {
    that.container[0].addEventListener("change", function (e) {
        that.events.onChange.fire(e.target.value);
    });
};

driftingLeaves.leafAxisExpressionView.eval = function (that, expression) {
    // Bone-headed globally-scoped eval with the axis model
    // bound to "this".
    let fullExpr = "\"use strict\"; return " + expression + ";"
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
