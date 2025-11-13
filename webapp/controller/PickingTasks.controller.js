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

  return BaseController.extend("rfidwarehousesuiteui.controller.PickingTasks", {
    formatter: formatter,
    onInit() {
      this.getRouter().getRoute("PickingTasks").attachPatternMatched(this._onRouterPickingTasksMatched, this)
    },
    _onRouterPickingTasksMatched: function (oEvent) {

    },
    onCreatePickingTaskPress:function(){
      if (!this._CreatePickingTaskDialog) {
        this._CreatePickingTaskDialog = this.loadFragments("rfidwarehousesuiteui.fragments.PickingTasks.CreatePickingTask")
      }
      this._CreatePickingTaskDialog.then(function (oDialog) {
        oDialog.open();
      });
    },
    onCreateWavePress:function(){
      if (!this._CreatePickingWaveDialog) {
        this._CreatePickingWaveDialog = this.loadFragments("rfidwarehousesuiteui.fragments.PickingTasks.CreatePickingWave")
      }
      this._CreatePickingWaveDialog.then(function (oDialog) {
        oDialog.open();
      });
    }
  });
});