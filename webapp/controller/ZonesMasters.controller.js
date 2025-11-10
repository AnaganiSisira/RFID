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



    return BaseController.extend("rfidwarehousesuiteui.controller.ZonesMasters", {
        formatter: formatter,
        onInit: function () {


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
            oModel.setData({});
        },

        onZoneTypeSelect: function (oEvent) {

        },

        onOpenBulkCreateDialog: function () {
            if (!this._oBulkDialog) {
                this._oBulkDialog = sap.ui.xmlfragment(
                    "rfidwarehousesuiteui.fragments.Zonesmasters.CreateBulkZoneDialog",
                    this
                );
                this.getView().addDependent(this._oBulkDialog);
            }

            this._oBulkDialog.attachAfterOpen(function () {
                var oPatternCard = sap.ui.getCore().byId("patternMethodCard");
                var oExcelCard = sap.ui.getCore().byId("excelMethodCard");

                if (oPatternCard) {
                    oPatternCard.$().css("cursor", "pointer");
                    oPatternCard.$().on("click", this._onMethodCardClick.bind(this));
                }
                if (oExcelCard) {
                    oExcelCard.$().css("cursor", "pointer");
                    oExcelCard.$().on("click", this._onMethodCardClick.bind(this));
                }

                // Attach click handlers to template cards
                this._attachTemplateHandlers();
            }.bind(this));

            this._oBulkDialog.open();
        },

        // Handle method card click
        _onMethodCardClick: function (oEvent) {
            var oCard = sap.ui.getCore().getControl(oEvent.currentTarget.id);
            if (!oCard) return;

            var sMethod = oCard.data("method");
            this._switchCreationMethod(sMethod);
        },

        // Switch between Pattern and Excel methods
        _switchCreationMethod: function (sMethod) {
            var oPatternCard = sap.ui.getCore().byId("patternMethodCard");
            var oExcelCard = sap.ui.getCore().byId("excelMethodCard");
            var oPatternContent = sap.ui.getCore().byId("patternContent");
            var oExcelContent = sap.ui.getCore().byId("excelContent");
            var oCreateButton = sap.ui.getCore().byId("createButton");

            if (sMethod === "pattern") {
                // Switch to Pattern-based view
                oPatternCard.addStyleClass("selectedMethodCard");
                oExcelCard.removeStyleClass("selectedMethodCard");

                oPatternContent.setVisible(true);
                oExcelContent.setVisible(false);

                // Update button text
                // this._updateCreateButtonText();

            } else if (sMethod === "excel") {
                // Switch to Excel Import view
                oExcelCard.addStyleClass("selectedMethodCard");
                oPatternCard.removeStyleClass("selectedMethodCard");

                oPatternContent.setVisible(false);
                oExcelContent.setVisible(true);

                // Update button text
                oCreateButton.setText("Upload & Create");
                oCreateButton.setType("Emphasized");
            }
        },

        // Attach handlers to template cards
        _attachTemplateHandlers: function () {
            var aTemplatePanels = sap.ui.getCore().byId("patternContent").$().find(".quickTemplateCard");

            aTemplatePanels.each(function (index, element) {
                var oPanelControl = sap.ui.getCore().getControl(element.id);
                if (oPanelControl) {
                    jQuery(element).css("cursor", "pointer");
                    jQuery(element).on("click", function () {
                        var sTemplate = oPanelControl.data("template");
                        this._applyTemplate(sTemplate);
                    }.bind(this));
                }
            }.bind(this));
        },

        // Apply template
        _applyTemplate: function (sTemplate) {
            var oPrefixInput = sap.ui.getCore().byId("prefixInput");
            var oFromInput = sap.ui.getCore().byId("fromInput");
            var oToInput = sap.ui.getCore().byId("toInput");

            if (sTemplate === "small") {
                // Small Warehouse template
                oPrefixInput.setValue("STOR-");
                oFromInput.setValue("1");
                oToInput.setValue("5");

                sap.m.MessageToast.show("Small Warehouse template applied");

            } else if (sTemplate === "large") {
                // Large Warehouse template
                oPrefixInput.setValue("STOR-");
                oFromInput.setValue("1");
                oToInput.setValue("20");

                sap.m.MessageToast.show("Large Warehouse template applied");
            }

            // Update the generated codes preview
            this._updateGeneratedCodes();
        },

        onBulkOperations: function () {
            this.onOpenBulkCreateDialog();
        },

        onBulkCancelPress: function () {
            if (this._oBulkDialog) {
                this._oBulkDialog.close();
            }
        }




    });
});