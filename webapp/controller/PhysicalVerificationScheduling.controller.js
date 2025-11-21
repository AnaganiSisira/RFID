sap.ui.define([
  "rfidwarehousesuiteui/controller/BaseController",
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/Fragment",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "rfidwarehousesuiteui/model/formatter"
], function (BaseController, Controller, Fragment, JSONModel, MessageToast, MessageBox, formatter) {
  "use strict";

  return BaseController.extend("rfidwarehousesuiteui.controller.PhysicalVerificationScheduling", {
    formatter: formatter,
    onInit() {
      this.getRouter().getRoute("PickStrategy").attachPatternMatched(this._onRouterPickStrategyMatched, this)
    },
    _onRouterPickStrategysMatched: function (oEvent) {

    }
  });
});