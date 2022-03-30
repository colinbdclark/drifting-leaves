/*
Copyright 2022 Colin Clark. Distributed under the MIT license.
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
        leafHeader: "<div class='grid-header row'><h2 class='leaf-name'>%displayName</h2></div>",
        leafAxisContainer: "<div class='row leaf-axis %axis'>\
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
