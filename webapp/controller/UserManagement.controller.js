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



    return BaseController.extend("rfidwarehousesuiteui.controller.UserManagement", {
        formatter: formatter,
        onInit: function () {

         this.getRouter().getRoute("UserManagement").attachPatternMatched(this._onRouterUsersMastersMatched, this)
       
       
        },

         _onRouterUsersMastersMatched: function (oEvent) {

         },


        onCreateUsersMasters: function () {
            if (!this._ItemsDialog) {
                this._ItemsDialog = this.loadFragment({
                    name: "rfidwarehousesuiteui.fragments.Users.CreateUserDailog"
                });
            }
            this._ItemsDialog.then(function (oDialog) {
                oDialog.open();
            });
        },

    });
});