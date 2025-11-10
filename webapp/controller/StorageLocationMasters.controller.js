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
    },
    onGenerateCodes: function () {
    const view = this.getView();
    const components = [];

    const addComp = (chkId, fromId, toId) => {
        const chk = view.byId(chkId);
        if (chk.getSelected()) {
            components.push({
                from: this.byId(fromId).getValue(),
                to: this.byId(toId).getValue()
            });
        }
    };

    addComp("chkAisle", "inpAisleFrom", "inpAisleTo");
    addComp("chkRack", "inpRackFrom", "inpRackTo");
    addComp("chkLevel", "inpLevelFrom", "inpLevelTo");
    addComp("chkBin", "inpBinFrom", "inpBinTo");

    if (components.length === 0) {
        this.getView().getModel("locationModel").setProperty("/displayCodes", "(Select at least one component)");
        return;
    }

    // Build ranges
    const ranges = components.map(c => {
        const from = c.from || "1";
        const to = c.to || "1";
        if (isNaN(from)) {
            const start = from.charCodeAt(0);
            const end = to.charCodeAt(0);
            return Array.from({ length: end - start + 1 }, (_, i) => String.fromCharCode(start + i));
        } else {
            const start = parseInt(from);
            const end = parseInt(to);
            return Array.from({ length: end - start + 1 }, (_, i) => (start + i).toString().padStart(2, "0"));
        }
    });

    // Generate combinations
    const combinations = ranges.reduce((acc, curr) => {
        const res = [];
        acc.forEach(a => curr.forEach(b => res.push(a + "-" + b)));
        return res;
    }, [""]);

    if (combinations.length === 0) {
        this.getView().getModel("localModel").setProperty("/displayCodes", "(No combinations found)");
        return;
    }

    // Select first 2 + last 2
    const sampleCodes = [
        combinations[0] || combinations[1],
        combinations[2] || combinations[1],
        "...",
        combinations[combinations.length - 2],
        combinations[combinations.length - 1]
    ].filter(Boolean);

    this.getView().getModel("localModel").setProperty("/displayCodes", sampleCodes.join("    "));
}

  });
});