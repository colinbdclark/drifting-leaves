/*
Copyright 2022 Colin Clark

Licensed under the MIT license.
https://github.com/colinbdclark/bubbles/raw/master/LICENSE
*/

// TODO: Bind knobs to model.
fluid.defaults("driftingLeaves.leafView", {
    gradeNames: "fluid.viewComponent",

    axes: ["x", "y", "z"],

    dynamicComponents: {
        axisView: {
            createOnEvent: "afterAxisContainerRendered",
            container: "{arguments}.1",
            type: "driftingLeaves.leafAxisView",
            options: {
                model: "{leafView}.model",
                axis: "{arguments}.0"
            }
        }
    },

    events: {
        afterAxisContainerRendered: null
    },

    listeners: {
        "onCreate.renderContainer": {
            funcName: "driftingLeaves.leafView.renderContainer",
            args: ["{that}"]
        }
    },

    markup: {
        leafHeader: "<h2 class='leaf-name'>%displayName</h2>",
        leafAxisContainer: "<div class='leaf-axis %axis'>\
            <span class='leaf-axis-label'>%axis</span>\
        </div>"
    }
});

driftingLeaves.leafView.renderAxisContainer = function (that, axis) {
    let template = that.options.markup.leafAxisContainer;
    let leafAxisMarkup = fluid.stringTemplate(template, {
        axis: axis
    });

    let leafAxisContainer = $(leafAxisMarkup);
    that.container.append(leafAxisContainer);
    that.events.afterAxisContainerRendered.fire(axis, leafAxisContainer);
};

driftingLeaves.leafView.renderContainer = function (that) {
    let nameMarkup = fluid.stringTemplate(that.options.markup.leafHeader,
        that.model);
    that.container.append(nameMarkup);

    for (let axis of that.options.axes) {
        driftingLeaves.leafView.renderAxisContainer(that, axis);
    }
};
