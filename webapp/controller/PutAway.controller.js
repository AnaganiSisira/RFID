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

    return BaseController.extend("rfidwarehousesuiteui.controller.PutAway", {
        formatter: formatter,
        onInit() {
            this.getRouter().getRoute("PutAway").attachPatternMatched(this._onRouterPutAwayMatched, this)
        },
        _onRouterPutAwayMatched: function (oEvent) {
        },
        onBulkProcess: function () {
            if (!this._ManualPutawayDialog) {
                this._ManualPutawayDialog = this.loadFragments("rfidwarehousesuiteui.fragments.GoodsReceiptPutaway.ManualPutawayDialog")
            }
            this._ManualPutawayDialog.then(function (oDialog) {
                oDialog.open();
            });
        },
        onPutAwayProcess: function () {
            if (!this._CreateStorageDialog) {
                this._CreateStorageDialog = this.loadFragments("rfidwarehousesuiteui.fragments.GoodsReceiptPutaway.CreatePutaway")
            }
            this._CreateStorageDialog.then(function (oDialog) {
                oDialog.open();
            });
        },
        onAssignWorkersPress: function () {
            if (!this._assignWorkersDialog) {
                this._assignWorkersDialog = this.loadFragments("rfidwarehousesuiteui.fragments.GoodsReceiptPutaway.AssignWorkersDialog")
            }
            this._assignWorkersDialog.then(function (oDialog) {
                oDialog.open();
            });
        },
        onAction: function (oEvent) {
            var oButton = oEvent.getSource();
            var oContext = oButton.getBindingContext("PutAwayModel");
            var oData = oContext.getObject();

            // Open Cross-Dock Processing Dialog
            if (oData.actionText.includes("Cross-Dock")) {
                this._openCrossDockDialog(oData);
            } else {
                MessageToast.show("Action: " + oData.actionText + " for " + oData.grNumber);
            }
        },

        _openCrossDockDialog: function (oGRData) {
            var oView = this.getView();

            // Create dialog model with data
            var oCrossDockData = {
                grNumber: oGRData.grNumber,
                vendor: oGRData.vendor,
                itemCount: "3",
                totalUnits: "500",
                summary: "2 items selected | 1 cross-dock | 1 split required",
                items: [
                    {
                        selected: true,
                        itemCode: "FOOD-201",
                        description: "Organic Rice 5kg - Batch BTH2024004",
                        quantity: "200 BAGS",
                        weight: "1000 kg",
                        volume: "2.5 m³",
                        expiry: "2025-06-15",
                        expiryWarning: true,
                        tempReq: "Ambient",
                        qcSample: true,
                        perishable: true,
                        hasConsolidation: true,
                        consolidationText: "Same SKU found in F-08-02-FLOOR (150 bags, exp: 2025-07-20).",
                        recommendedLocation: "F-08-01-FLOOR",
                        strategy: "Strategy: FEFO + Zone Consolidation + Capacity Optimization",
                        confidence: "94%",
                        capacityPercent: 85,
                        capacityText: "After: 85% (+1000kg)",
                        currentCapacity: "70%",
                        afterCapacity: "85% (+1000kg)",
                        maxCapacity: "5000kg",
                        splitRequired: true,
                        splitLocations: [
                            {
                                quantity: "150",
                                location: "F-08-01-FLOOR"
                            },
                            {
                                quantity: "50",
                                location: "F-08-02-FLOOR"
                            }
                        ]
                    },
                    {
                        selected: true,
                        itemCode: "FOOD-115",
                        crossDockItemCode: "FOOD-115",
                        description: "Frozen Vegetables Mix",
                        crossDockDescription: "Frozen Vegetables Mix",
                        quantity: "100 BAGS",
                        crossDockQuantity: "100 BAGS",
                        customerOrder: "SO-2024-1893",
                        shipTime: "14:00 Today",
                        qcSample: false,
                        perishable: false,
                        isCrossDock: true,
                        crossDockSelected: true,
                        directShipText: "Direct to Shipping Dock 8 - No storage required. ETA: 2 hours | Assigned to: Express Lane",
                        hasConsolidation: false,
                        splitRequired: false
                    }
                ]
            };

            var oCrossDockModel = new JSONModel(oCrossDockData);

            // Create dialog if it doesn't exist
            if (!this._oCrossDockDialog) {
                Fragment.load({
                    id: oView.getId(),
                    name: "myapp.view.fragments.CrossDockProcessing",
                    controller: this
                }).then(function (oDialog) {
                    this._oCrossDockDialog = oDialog;
                    oView.addDependent(this._oCrossDockDialog);
                    this._oCrossDockDialog.setModel(oCrossDockModel, "crossDockModel");
                    this._oCrossDockDialog.open();
                }.bind(this));
            } else {
                this._oCrossDockDialog.setModel(oCrossDockModel, "crossDockModel");
                this._oCrossDockDialog.open();
            }
        },

        onCloseDialog: function () {
            this._oCrossDockDialog.close();
        },

        onCancel: function () {
            this._oCrossDockDialog.close();
        },

        onSaveDraft: function () {
            MessageToast.show("Draft saved successfully");
        },

        onValidateAssign: function () {
            MessageToast.show("Validating and assigning putaway tasks...");
            this._oCrossDockDialog.close();
        },

        onTabSelect: function (oEvent) {
            var sKey = oEvent.getParameter("key");
            MessageToast.show("Tab selected: " + sKey);
        },

        onConsolidate: function (oEvent) {
            MessageToast.show("Consolidating items...");
        },

        onAddSplitLocation: function () {
            var oModel = this._oCrossDockDialog.getModel("crossDockModel");
            var aItems = oModel.getProperty("/items");

            // Find the item with split locations
            for (var i = 0; i < aItems.length; i++) {
                if (aItems[i].splitRequired && aItems[i].splitLocations) {
                    aItems[i].splitLocations.push({
                        quantity: "0",
                        location: "F-08-01-FLOOR"
                    });
                    break;
                }
            }

            oModel.setProperty("/items", aItems);
            MessageToast.show("Split location added");
        },

        onRemoveSplitLocation: function (oEvent) {
            MessageToast.show("Split location removed");
            // Add logic to remove the specific split location
        },

        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("query");
            var oTable = this.byId("grTable");
            var oBinding = oTable.getBinding("items");

            if (sQuery) {
                var aFilters = [
                    new sap.ui.model.Filter("grNumber", sap.ui.model.FilterOperator.Contains, sQuery),
                    new sap.ui.model.Filter("poNumber", sap.ui.model.FilterOperator.Contains, sQuery),
                    new sap.ui.model.Filter("vendor", sap.ui.model.FilterOperator.Contains, sQuery)
                ];
                var oFilter = new sap.ui.model.Filter({
                    filters: aFilters,
                    and: false
                });
                oBinding.filter(oFilter);
            } else {
                oBinding.filter([]);
            }
        },

        onRefresh: function () {
            MessageToast.show("Data refreshed");
        },

        // onBulkProcess: function () {
        //     var oTable = this.byId("grTable");
        //     var aSelectedItems = oTable.getSelectedItems();

        //     if (aSelectedItems.length === 0) {
        //         MessageToast.show("Please select at least one item");
        //         return;
        //     }

        //     MessageToast.show(aSelectedItems.length + " items selected for bulk processing");
        // }
        onAssoignWorkers:function(){
            this.onCancelPress('assignWorkersDialog');
            this.onSavePress('Assigned','CreatePutAwayDialog')
        }

    });
});