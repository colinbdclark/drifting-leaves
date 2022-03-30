/*
Copyright 2022 Colin Clark. Distributed under the MIT license.
*/

let os = electron.nodeIntegration.require("os");

fluid.defaults("driftingLeaves.networkInterfaceView", {
    gradeNames: ["fluid.viewComponent"],

    model: {
        interfaces: []
    },

    modelListeners: {
        "interfaces": {
            funcName: "driftingLeaves.networkInterfaceView.renderInterfaces",
            args: ["{that}", "{change}.value"]
        }
    },

    listeners: {
        "onCreate.modelizeInterfaces": {
            funcName: "driftingLeaves.networkInterfaceView.updateIPAddresses",
            args: ["{that}"]
        }
    },

    markup: {
        ipAddress: "<div class='net-interface'>\
            <span class='ip-address'>%ipAddress</span>:<span class='port'>%localPort</span>\
        </div>",
    }
});

driftingLeaves.networkInterfaceView.updateIPAddresses = function (that) {
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

    that.applier.change("interfaces", ipAddresses);
};

driftingLeaves.networkInterfaceView.renderInterfaces = function (that,
    ipAddresses) {

    for (let ipAddress of ipAddresses) {
        let template = that.options.markup.ipAddress;
        let interfaceMarkup = fluid.stringTemplate(template, {
            ipAddress: ipAddress,
            localPort: that.options.localPort
        });
        that.container.append(interfaceMarkup);
    }
};
