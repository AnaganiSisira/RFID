sap.ui.define([
    "rfidwarehousesuiteui/controller/BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (BaseController, Controller, Fragment, JSONModel, MessageToast, MessageBox) {
    "use strict";

    return BaseController.extend("rfidwarehousesuiteui.controller.StorageLocationMasters", {

        onInit: function () {


        },
        onCreateStorageLocation: function () {
            if (!this._ItemsDialog) {
                this._ItemsDialog = this.loadFragments("rfidwarehousesuiteui.fragments.StorageLocationMaster.CreateStorageLocationDialog")
            }
            this._ItemsDialog.then(function (oDialog) {
                oDialog.open();
            });
        },
        onBulkOperations: function () {
            if (!this._BulkLocationDialog) {
                this._BulkLocationDialog = this.loadFragments("rfidwarehousesuiteui.fragments.StorageLocationMaster.CreateBulkLocationDialog")
            }
            this._BulkLocationDialog.then(function (oDialog) {
                oDialog.open();
            });
        }

    });
});