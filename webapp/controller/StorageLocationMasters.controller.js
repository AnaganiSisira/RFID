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
      const oData = {
        Aisle: { visible: false, value: "" },
        Rack: { visible: false, value: "" },
        Level: { visible: false, value: "" },
        Bin: { visible: false, value: "" },
        GeneratedCode: "(Enter component values above)"
      };

      const oModel = new JSONModel(oData);
      this.getView().setModel(oModel, "localModel");

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
    onImportStorageLocation: function () {
      if (!this._ImportStorageLocationDialog) {
        this._ImportStorageLocationDialog = this.loadFragments("rfidwarehousesuiteui.fragments.StorageLocationMaster.StorageLocationsImport")
      }
      this._ImportStorageLocationDialog.then(function (oDialog) {
        oDialog.open();
      });
    },
    onAddComponent: function (oEvent) {
      const sComp = oEvent.getSource().getText();
      const oModel = this.getView().getModel("localModel");
      const oData = oModel.getData();

      if (oData[sComp].visible) {
        MessageToast.show(sComp + " already added");
        return;
      }

      oData[sComp].visible = true;
      oModel.refresh(true);
    },

    onRemoveComponent: function (sKey) {
      const sComp = sKey;
      const oModel = this.getView().getModel("localModel");
      const oData = oModel.getData();

      oData[sComp].visible = false;
      oData[sComp].value = "";
      this._updateGeneratedCode(oModel);
      oModel.refresh(true);
    },

    onInputChange: function () {
      const oModel = this.getView().getModel("localModel");
      this._updateGeneratedCode(oModel);
    },

    _updateGeneratedCode: function (oModel) {
      const oData = oModel.getData();
      const aComponents = ["Aisle", "Rack", "Level", "Bin"];
      const aValues = [];

      aComponents.forEach(sKey => {
        if (oData[sKey].visible && oData[sKey].value) {
          aValues.push(oData[sKey].value.trim().toUpperCase());
        }
      });

      oData.GeneratedCode =
        aValues.length > 0
          ? aValues.join("–")
          : "(Enter component values above)";
      oModel.refresh(true);
    }

  });
});