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
            if (!this._CreateStorageDialog) {
                this._CreateStorageDialog = this.loadFragments("rfidwarehousesuiteui.fragments.StorageLocationMaster.CreateStorageLocationDialog")
            }
            this._CreateStorageDialog.then(function (oDialog) {
                oDialog.open();
            });
        },
        onBulkLocationOperations: function () {
            if (!this._BulkLocationDialog) {
                this._BulkLocationDialog = this.loadFragments("rfidwarehousesuiteui.fragments.StorageLocationMaster.CreateBulkLocationDialog")
            }
            this._BulkLocationDialog.then(function (oDialog) {
                oDialog.open();
            });
        },
        onImportStorageLocation: function(){
            if (!this._ImportStorageLocationDialog) {
                this._ImportStorageLocationDialog = this.loadFragments("rfidwarehousesuiteui.fragments.StorageLocationMaster.StorageLocationsImport")
            }
            this._ImportStorageLocationDialog.then(function (oDialog) {
                oDialog.open();
            });
        }

    });
});