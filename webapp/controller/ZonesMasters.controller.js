sap.ui.define([
    "rfidwarehousesuiteui/controller/BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (BaseController, Controller, Fragment, JSONModel, MessageToast, MessageBox) {
    "use strict";

    return BaseController.extend("rfidwarehousesuiteui.controller.ZonesMasters", {

        onInit: function () {


        },
        onBulkOperations: function () {
            if (!this._BulkLocationDialog) {
                this._BulkLocationDialog = this.loadFragment({
                    name: "rfidwarehousesuiteui.fragments.Zonesmasters.CreateBulkZoneDialog"
                });
            }
            this._BulkLocationDialog.then(function (oDialog) {
                oDialog.open();
            });
        },

        onCreateZonesMasters: function () {
            if (!this._ItemsDialog) {
                this._ItemsDialog = this.loadFragment({
                    name: "rfidwarehousesuiteui.fragments.Zonesmasters.CreateZoneDialog"
                });
            }
            this._ItemsDialog.then(function (oDialog) {
                oDialog.open();
            });
        },

        onCreateZone: function () {
            const oData = this.getView().getModel("zoneModel").getData();
            console.log("Zone Created:", oData);
            this.byId("CreateZoneDialog").close();
        },

        onSaveAndAddAnother: function () {
            const oModel = this.getView().getModel("zoneModel");
            console.log("Zone Saved:", oModel.getData());
            oModel.setData({}); // reset form
        },

        onCancelPress: function () {
            if (this._ItemsDialog) {
                this._ItemsDialog.then(function (oDialog) {
                    oDialog.close();
                });
            }
        }

    });
});