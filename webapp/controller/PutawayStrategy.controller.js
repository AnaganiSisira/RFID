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



    return BaseController.extend("rfidwarehousesuiteui.controller.PutawayStrategy", {
        formatter: formatter,
        onInit: function () {

         this.getRouter().getRoute("PutawayStrategy").attachPatternMatched(this._onRouterPutawayStrategyMatched, this)
       
       
        },

         _onRouterPutawayStrategyMatched: function (oEvent) {

         },


        onCreatePutawayMasters: function () {
            if (!this._ItemsDialog) {
                this._ItemsDialog = this.loadFragment({
                    name: "rfidwarehousesuiteui.fragments.Putaway.CreatePutaway"
                });
            }
            this._ItemsDialog.then(function (oDialog) {
                oDialog.open();
            });
        },

    });
});