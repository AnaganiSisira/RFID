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

  return BaseController.extend("rfidwarehousesuiteui.controller.ItemMasters", {
    formatter: formatter,
    onInit() {
      this.getRouter().getRoute("ItemMasters").attachPatternMatched(this._onRouterItemMastersMatched, this)
    },
    _onRouterItemMastersMatched: function (oEvent) {

    }
  });
});