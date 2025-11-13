sap.ui.define([
    "rfidwarehousesuiteui/controller/BaseController",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "rfidwarehousesuiteui/model/formatter"
], function (BaseController, Controller, Fragment, JSONModel, MessageToast, MessageBox, Filter, FilterOperator, formatter) {
    "use strict";

    return BaseController.extend("rfidwarehousesuiteui.controller.GoodsReceipt", {
        formatter: formatter,

        onInit: function () {
            this.getRouter().getRoute("GoodsReceipt").attachPatternMatched(this._onRouterGoodsReceiptMatched, this);

            // Initialize wizard model with empty structure
            this._oWizardModel = new JSONModel({
                poNumber: "",
                vendor: "",
                expectedDate: null,
                warehouse: "",
                totalItems: 0,
                totalValue: 0,
                currentStep: 0,
                lineItems: [],
                receiveItems: [],
                verifyItems: [],
                hasVariance: false,
                notes: "",
                grDocNumber: "",
                itemsReceived: 0,
                tagsAssigned: 0,
                selectedTagMethod: ""
            });

            // Load the GoodsReceipt model data
            var oModel = new JSONModel("model/GoodsReceiptModel.json");
            this.getView().setModel(oModel);
        },

        _onRouterGoodsReceiptMatched: function (oEvent) {
            // Reset wizard when route is matched
            if (this._oWizard) {
                this._oWizard.discardProgress(this._oWizard.getSteps()[0]);
            }
        },

        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            var oTable = this.byId("idGoodsReceiptTable");
            var oBinding = oTable.getBinding("items");

            if (oBinding) {
                var aFilters = [];
                if (sQuery) {
                    aFilters.push(new Filter({
                        filters: [
                            new Filter("documentNo", FilterOperator.Contains, sQuery),
                            new Filter("vendor", FilterOperator.Contains, sQuery)
                        ],
                        and: false
                    }));
                }
                oBinding.filter(aFilters);
            }
        },

        onSyncSAP: function () {
            MessageToast.show("Syncing with SAP...");
        },

        onQuickReceive: function () {
            MessageToast.show("Quick Receive mode activated");
        },

        onReceiveAndTag: function (oEvent) {
            var oSource = oEvent.getSource();
            var oContext = oSource.getBindingContext();
            var oSelectedDoc = oContext.getObject();

            // Get the full model data
            var oModel = this.getView().getModel();
            var oModelData = oModel.getData();

            // Prepare wizard data from selected document and model
            var oWizardData = {
                poNumber: oSelectedDoc.documentNo,
                vendor: oSelectedDoc.vendor,
                expectedDate: oSelectedDoc.expectedDate,
                warehouse: oModelData.WizardData.warehouse,
                totalItems: oSelectedDoc.totalItems,
                totalValue: oSelectedDoc.value,
                currentStep: 0,
                
                // Use line items from model
                lineItems: JSON.parse(JSON.stringify(oModelData.WizardData.lineItems)),
                
                // Use receive items from model
                receiveItems: JSON.parse(JSON.stringify(oModelData.WizardData.receiveItems)),
                
                // Initialize verify items as empty
                verifyItems: [],
                
                hasVariance: false,
                notes: "",
                grDocNumber: "",
                itemsReceived: 0,
                tagsAssigned: 0,
                selectedTagMethod: ""
            };

            // Set the wizard model data
            this._oWizardModel.setData(oWizardData);

            // Open the wizard dialog
            this._openWizardDialog();
        },

        _openWizardDialog: function () {
            var oView = this.getView();

            if (!this._pWizardDialog) {
                this._pWizardDialog = Fragment.load({
                    id: oView.getId(),
                    name: "rfidwarehousesuiteui.fragments.GoodsReceipt.AddGoodsReceipt",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    // Set wizard model to dialog
                    oDialog.setModel(this._oWizardModel, "wizard");
                    return oDialog;
                }.bind(this));
            }

            this._pWizardDialog.then(function (oDialog) {
                // Update wizard model
                oDialog.setModel(this._oWizardModel, "wizard");

                // Initialize wizard on open
                setTimeout(function () {
                    this._initializeWizard();
                }.bind(this), 100);

                oDialog.open();
            }.bind(this));
        },

        _initializeWizard: function () {
            this._oWizard = this.byId("goodsReceiptWizard");
            if (this._oWizard) {
                // Reset wizard to first step
                this._oWizard.discardProgress(this._oWizard.getSteps()[0]);
                this._iSelectedStepIndex = 0;
                this._oSelectedStep = this._oWizard.getSteps()[this._iSelectedStepIndex];
                this._updateWizardButtons();
            }
        },

        _updateWizardButtons: function () {
            // Update next button text based on current step
            var oNextButton = this.byId("wizardNextButton");
            if (oNextButton) {
                var aStepTitles = ["Next: Receive & Tag", "Next: Verify", "Complete Receipt"];
                if (this._iSelectedStepIndex < aStepTitles.length) {
                    oNextButton.setText(aStepTitles[this._iSelectedStepIndex]);
                }
            }

            // Update current step in model
            this._oWizardModel.setProperty("/currentStep", this._iSelectedStepIndex);
        },

        onStep1Activate: function () {
            this._iSelectedStepIndex = 0;
            this._updateWizardButtons();
            MessageToast.show("Document Review");
        },

        onStep2Activate: function () {
            this._iSelectedStepIndex = 1;
            this._updateWizardButtons();
            MessageToast.show("Receive & Tag");
        },

        onStep2Complete: function () {
            // Calculate variance when moving from step 2 to step 3
            var aReceiveItems = this._oWizardModel.getProperty("/receiveItems");
            var aVerifyItems = [];
            var hasVariance = false;

            aReceiveItems.forEach(function (item) {
                var variance = item.received - item.expected;
                if (variance !== 0) {
                    hasVariance = true;
                }
                aVerifyItems.push({
                    material: item.material,
                    description: item.description,
                    expected: item.expected,
                    received: item.received,
                    variance: variance,
                    reason: variance !== 0 ? item.reason || "" : ""
                });
            });

            this._oWizardModel.setProperty("/verifyItems", aVerifyItems);
            this._oWizardModel.setProperty("/hasVariance", hasVariance);

            MessageToast.show("Items received and tagged");
        },

        onStep3Activate: function () {
            this._iSelectedStepIndex = 2;
            this._updateWizardButtons();
            MessageToast.show("Verification");
        },

        onStep3Complete: function () {
            // Validation before completing
            var aVerifyItems = this._oWizardModel.getProperty("/verifyItems");
            var bAllReasonsProvided = true;

            aVerifyItems.forEach(function (item) {
                if (item.variance !== 0 && !item.reason) {
                    bAllReasonsProvided = false;
                }
            });

            if (!bAllReasonsProvided) {
                MessageBox.error("Please provide reasons for all variance items.");
                return false;
            }

            return true;
        },

        onStep4Activate: function () {
            this._iSelectedStepIndex = 3;
            this._updateWizardButtons();
            MessageToast.show("Completion");
        },

        onSelectTagMethod: function (oEvent) {
            var sButtonId = oEvent.getSource().getId();
            var sMethod = "Manual Entry";

            if (sButtonId.indexOf("btnBarcode") > -1) {
                sMethod = "Barcode Scanner";
            } else if (sButtonId.indexOf("btnRFID") > -1) {
                sMethod = "RFID Reader";
            } else if (sButtonId.indexOf("btnExcel") > -1) {
                sMethod = "Excel Upload";
            }

            this._oWizardModel.setProperty("/selectedTagMethod", sMethod);
            MessageToast.show("Tag method selected: " + sMethod);
        },

        onReceivedChange: function (oEvent) {
            var oInput = oEvent.getSource();
            var sValue = oInput.getValue();
            // Update is automatic through two-way binding
        },

        onTagTypeChange: function (oEvent) {
            var oSelect = oEvent.getSource();
            var sValue = oSelect.getSelectedKey();
            // Update is automatic through two-way binding
        },

        onTagNumberChange: function (oEvent) {
            // Update is automatic through two-way binding
        },

        onReasonChange: function (oEvent) {
            // Update is automatic through two-way binding
        },

        onAddMoreRows: function () {
            var aReceiveItems = this._oWizardModel.getProperty("/receiveItems");

            aReceiveItems.push({
                material: "",
                description: "",
                expected: 0,
                received: 0,
                tagType: "RFID",
                tagNumber: "",
                reason: ""
            });

            this._oWizardModel.setProperty("/receiveItems", aReceiveItems);
            MessageToast.show("New row added");
        },

        onGenerateSequential: function () {
            var aReceiveItems = this._oWizardModel.getProperty("/receiveItems");
            var iCounter = 1;

            aReceiveItems.forEach(function (item) {
                if (item.material && item.received > 0) {
                    var sPrefix = item.tagType === "RFID" ? "RFID" : "BC";
                    item.tagNumber = sPrefix + "-" + item.material + "-" + String(iCounter).padStart(3, '0');
                    iCounter++;
                }
            });

            this._oWizardModel.setProperty("/receiveItems", aReceiveItems);
            MessageToast.show("Sequential tag numbers generated");
        },

        onWizardNext: function () {
            if (!this._oWizard) {
                return;
            }

            // Validate current step before proceeding
            var bValidated = true;

            if (this._iSelectedStepIndex === 2) {
                // Validate step 3 before completing
                bValidated = this.onStep3Complete();
                if (!bValidated) {
                    return;
                }
            }

            // Navigate to next step
            if (this._iSelectedStepIndex < 2) {
                this._oWizard.nextStep();
            } else if (this._iSelectedStepIndex === 2) {
                // Complete receipt
                this._completeReceipt();
            }
        },

        onWizardBack: function () {
            if (!this._oWizard) {
                return;
            }

            this._oWizard.previousStep();
        },

        _completeReceipt: function () {
            var that = this;

            MessageBox.confirm("Are you sure you want to complete this goods receipt?", {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                emphasizedAction: MessageBox.Action.YES,
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {
                        // Calculate totals
                        var aVerifyItems = that._oWizardModel.getProperty("/verifyItems");
                        var iTotalReceived = aVerifyItems.reduce(function (sum, item) {
                            return sum + item.received;
                        }, 0);

                        // Generate GR document number
                        var sGRDoc = "50" + String(Math.floor(Math.random() * 10000000)).padStart(8, '0');

                        // Update completion data
                        that._oWizardModel.setProperty("/grDocNumber", sGRDoc);
                        that._oWizardModel.setProperty("/itemsReceived", iTotalReceived);
                        that._oWizardModel.setProperty("/tagsAssigned", iTotalReceived);

                        // Move to completion step
                        that._oWizard.nextStep();

                        MessageToast.show("Goods Receipt completed successfully!", {
                            duration: 3000
                        });
                    }
                }
            });
        },

        onSaveDraft: function () {
            MessageToast.show("Draft saved successfully");
        },

        onPrintLabels: function () {
            MessageToast.show("Printing labels...");
        },

        onStartPutAway: function () {
            MessageToast.show("Starting put-away process...");
            this._closeWizardDialog();
        },

        onGRDocPress: function () {
            var sDocNumber = this._oWizardModel.getProperty("/grDocNumber");
            MessageToast.show("Opening GR Document: " + sDocNumber);
        },

        onCancelWizard: function () {
            var that = this;

            MessageBox.warning("Are you sure you want to cancel? All unsaved changes will be lost.", {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                emphasizedAction: MessageBox.Action.NO,
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {
                        that._closeWizardDialog();
                    }
                }
            });
        },

        onCloseWizard: function () {
            this._closeWizardDialog();
        },

        _closeWizardDialog: function () {
            this._pWizardDialog.then(function (oDialog) {
                oDialog.close();

                // Reset wizard
                if (this._oWizard) {
                    this._oWizard.discardProgress(this._oWizard.getSteps()[0]);
                    this._iSelectedStepIndex = 0;
                }

                // Reset wizard model
                this._oWizardModel.setData({
                    poNumber: "",
                    vendor: "",
                    expectedDate: null,
                    warehouse: "",
                    totalItems: 0,
                    totalValue: 0,
                    currentStep: 0,
                    lineItems: [],
                    receiveItems: [],
                    verifyItems: [],
                    hasVariance: false,
                    notes: "",
                    grDocNumber: "",
                    itemsReceived: 0,
                    tagsAssigned: 0,
                    selectedTagMethod: ""
                });
            }.bind(this));
        },

        onWizardComplete: function () {
            MessageToast.show("Wizard completed!");
        }
    });
});