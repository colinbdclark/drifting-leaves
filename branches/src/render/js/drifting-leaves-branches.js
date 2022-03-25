// TODO:
//  - Use new renderer to render server view.
//  - Handle port disconnections (try to reconnect)

"use strict";

let require = globalThis.require || electron.nodeIntegration.require;
let osc = require("osc");
let os = require("os");

fluid.defaults("driftingLeaves.udpOSCServer", {
    gradeNames: ["fluid.component"],

    oscPortOptions: undefined,

    members: {
        oscPort: null
    },

    events: {
        onReady: null,
        onMessage: null,
        onError: null
    },

    listeners: {
        "onCreate.createPort": {
            funcName: "driftingLeaves.udpOSCServer.createPort",
            args: ["{that}"]
        },

        "onCreate.bindReady": {
            priority: "after:createPort",
            "this": "{that}.oscPort",
            method: "on",
            args: ["ready", "{that}.events.onReady.fire"]
        },

        "onCreate.bindMessage": {
            priority: "after:createPort",
            "this": "{that}.oscPort",
            method: "on",
            args: ["message", "{that}.events.onMessage.fire"]
        },

        "onCreate.bindError": {
            priority: "after:createPort",
            "this": "{that}.oscPort",
            method: "on",
            args: ["error", "{that}.events.onError.fire"]
        },

        "onError": {
            "this": "console",
            method: "log",
            args: ["{arguments}.0"]
        }
    }
});

driftingLeaves.udpOSCServer.createPort = function (that) {
    let oscPort = new osc.UDPPort({
        localAddress: that.options.oscPortOptions.localAddress,
        port: that.options.oscPortOptions.port
    });
    that.oscPort = oscPort;
};

driftingLeaves.udpOSCServer.printOSCMessage = function (msg) {
    let argsStr = "";
    for (let arg of msg.args) {
        argsStr += arg + " ";
    }
    console.log(msg.address, argsStr);
};

fluid.defaults("driftingLeaves.oscServerView", {
    gradeNames: ["fluid.viewComponent"],

    localPort: undefined,

    components: {
        leafRenderer: {
            type: "driftingLeaves.leafRenderer",
            container: "#leaves"
        }
    },

    events: {
        onReady: null,
        onMessage: null
    },

    modelListeners: {
        "*":{
            func: "{leafRenderer}.refreshView",
            args: ["{change}"]
        }
    },

    listeners: {
        "onReady.renderNetworkInterfaces": {
            funcName: "driftingLeaves.oscServerView.renderNetworkInterfaces",
            args: [
                "{that}.container",
                "{that}.options.localPort"
            ]
        }
    }
});


driftingLeaves.oscServerView.renderNetworkInterfaces = function (container,
    localPort) {
    let ipAddresses = driftingLeaves.oscServerView.getIPAddresses();
    ipAddresses.forEach(function (address) {
        let view = $("#net-interfaces-template").clone();
        view.attr("id", address);
        view.removeClass("template");
        view.find(".ip-address").text(address);
        view.find(".port").text(localPort);
        view.appendTo("#network-interfaces");
    });
};


fluid.defaults("driftingLeaves.leafRenderer", {
    gradeNames: ["fluid.viewComponent"],

    invokers: {
        refreshView: {
            funcName: "driftingLeaves.leafRenderer.renderLeaf",
            args: [
                "{that}.container",
                "{arguments}.0"
            ]
        }
    }
});

driftingLeaves.leafRenderer.renderLeafContainer = function (container,
    change) {
    let leafContainer = container.find("#leaf-template").clone();
    leafContainer.attr("id", change.path);
    leafContainer.find(".leaf-name").text(
        change.value.displayName || "Unknown Leaf");
    leafContainer.removeClass("template");
    container.append(leafContainer);

    let axisTemplate = leafContainer.find("#leaf-axis-template");
    let axes = ["x", "y", "z"];
    for (let axis of axes) {
        let axisContainer = axisTemplate.clone();
        axisContainer.removeClass("template");
        axisContainer.attr("id", null);
        axisContainer.find(".leaf-axis-label").text(axis);
        leafContainer.append(axisContainer);
    }
    axisTemplate.remove();

    return leafContainer;
};

driftingLeaves.leafRenderer.renderLeaf = function (container,
     change) {
    let macAddress = change.path;
    let leafContainer = document.getElementById(macAddress) ||
        driftingLeaves.leafRenderer.renderLeafContainer(
            container, change);

    let axes = ["x", "y", "z"];
    let leafAxes = $(leafContainer).find(".leaf-axis");
    let argIdx = 0;
    for (let axisContainer of leafAxes) {
        let key = axes[argIdx];
        let value = change.value[key];
        argIdx++;
        let valueRounded = (Math.round(
            (value + Number.EPSILON) * 10000) / 10000).toFixed(4);
        $(axisContainer).find(".leaf-axis-value").text(valueRounded).
            attr("data-value", value);
    }
};

driftingLeaves.oscServerView.getIPAddresses = function () {
    let interfaces = os.networkInterfaces(),
        ipAddresses = [];

    for (let deviceName in interfaces) {
        let addresses = interfaces[deviceName];
        for (let i = 0; i < addresses.length; i++) {
            let addressInfo = addresses[i];
            if (addressInfo.family === "IPv4" && !addressInfo.internal) {
                ipAddresses.push(addressInfo.address);
            }
        }
    }

    return ipAddresses;
};

fluid.defaults("driftingLeaves.branches", {
    gradeNames: "fluid.modelComponent",

    leafMACLookup: {
        "3c6151611bc": "Oak",
        "7c9ebdf93f84": "Maple",
        "7c9ebd3ad2c8": "Poplar",
        "84cca8783ffc": "Aspen"
    },

    model: {
        /*
        <macAddress>: {
            displayName: "poplar",
            x: 0,
            y: 1.0,
            z: -1.0,
            scale: 1.0,
            offset: 0.0
        }
        */
    },

    oscPortOptions: {
        localAddress: "0.0.0.0",
        localPort: 57121
    },

    invokers: {
        start: "{that}.events.onStart.fire()"
    },

    events: {
        onStart: null,
        onMessage: null
    },

    components: {
        oscServer: {
            type: "driftingLeaves.udpOSCServer",
            options: {
                oscPortOptions: "{branches}.options.oscPortOptions",
                events: {
                    onMessage: "{branches}.events.onMessage"
                }
            }
        },

        serverView: {
            type: "driftingLeaves.oscServerView",
            container: "#server-view",
            options: {
                localPort: "{branches}.options.oscPortOptions.localPort",
                model: "{branches}.model",
                events: {
                    onReady: "{oscServer}.events.onReady",
                    onMessage: "{branches}.events.onMessage"
                }
            }
        }
    },

    listeners: {
        "onMessage.updateModel": {
            funcName: "driftingLeaves.branches.modelizeOSCMessage",
            args: ["{that}", "{arguments}.0"]
        }
    }
});

driftingLeaves.branches.modelizeOSCMessage = function (that, msg) {
    let macAddress = msg.args[0];
    that.applier.change(macAddress, {
        displayName: that.options.leafMACLookup[macAddress],
        x: msg.args[1],
        y: msg.args[2],
        z: msg.args[3]
    });
};
