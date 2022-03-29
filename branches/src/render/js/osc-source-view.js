/*
Copyright 2022 Colin Clark

Licensed under the MIT license.
https://github.com/colinbdclark/bubbles/raw/master/LICENSE
*/

fluid.defaults("driftingLeaves.oscSourceView", {
    gradeNames: ["fluid.viewComponent"],

    localPort: undefined,

    invokers: {
        renderLeafContainer: {
            funcName: "driftingLeaves.oscSourceView.renderLeafContainer",
            args: [
                "{that}",
                "{that}.dom.leaves",
                "{arguments}.0"  // Leaf model
            ]
        }
    },

    dynamicComponents: {
        networkInterfaceView: {
            createOnEvent: "onReady",
            type: "driftingLeaves.networkInterfaceView",
            container: "{that}.dom.networkInterfaces",
            options: {
                localPort: "{oscSourceView}.options.localPort"
            }
        },

        leafView: {
            createOnEvent: "afterLeafContainerRendered",
            type: "driftingLeaves.leafView",
            container: "{arguments}.0",
            options: {
                macAddress: "{arguments}.1",
                modelRelay: {
                    source: {
                        context: "branches",
                        segs: [
                            "{that}.options.macAddress"
                        ]
                    },
                    target: "",
                    singleTransform: {
                        type: "fluid.transforms.identity"
                    }
                }
            }
        }
    },

    events: {
        onReady: null,
        afterLeafContainerRendered: null
    },

    selectors: {
        networkInterfaces: "#network-interfaces",
        leaves: "#leaves"
    },

    markup: {
        leafContainer: "<div id='%macAddress' class='leaf'></div>"
    }
});

driftingLeaves.oscSourceView.renderLeafContainer = function (that,
    leavesContainer, leafModel) {
    let leafContainerMarkup = fluid.stringTemplate(
        that.options.markup.leafContainer, leafModel);
    let leafContainer = $(leafContainerMarkup);
    leavesContainer.append(leafContainer);

    that.events.afterLeafContainerRendered.fire(leafContainer,
        leafModel.macAddress);
};
