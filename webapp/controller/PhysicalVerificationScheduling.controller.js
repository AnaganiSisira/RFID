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
      this.getRouter().getRoute("PhysicalVerificationScheduling").attachPatternMatched(this._onRouterPhysicalVerificationSchedulingMatched, this)
    },
    _onRouterPhysicalVerificationSchedulingMatched: function (oEvent) {

    },
    onViewPVPress: function () {
      if (!this._DamageAssessmentDialog) {
        this._DamageAssessmentDialog = this.loadFragments("rfidwarehousesuiteui.fragments.PhysicalVerification.DamageAssessment")
      }
      this._DamageAssessmentDialog.then(function (oDialog) {
        oDialog.open();
      });
    },
    
  });
});