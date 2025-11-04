sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("rfidwarehousesuiteui.controller.App", {

        onInit: function () {
            // Initialize app state model
            const oAppStateModel = new JSONModel({
                sideNavExpanded: false,
                selectedKey: "Dashboard",
                busy: false,
                notificationCount: 3,
                userName: "John Doe",
                userInitials: "JD",
                userRole: "Warehouse Manager",
                warehouseName: "Main Warehouse - Atlanta",
                currentShift: "Morning Shift"
            });
            this.getView().setModel(oAppStateModel, "appState");

            // Get router
            this._oRouter = this.getOwnerComponent().getRouter();
            this._oRouter.attachRouteMatched(this._onRouteMatched, this);

            // Initialize user data
            this._loadUserData();

            // Start notification polling
            this._startNotificationPolling();

            // Set up device model
            this._setupDeviceModel();
        },

        /**
         * Load user data from backend
         */
        _loadUserData: function () {
            const oAppStateModel = this.getView().getModel("appState");
            
            // Simulated user data - replace with actual service call
            const oUserData = {
                userName: "John Doe",
                userInitials: "JD",
                userRole: "Warehouse Manager",
                userId: "JDOE001",
                email: "john.doe@company.com"
            };

            oAppStateModel.setProperty("/userName", oUserData.userName);
            oAppStateModel.setProperty("/userInitials", oUserData.userInitials);
            oAppStateModel.setProperty("/userRole", oUserData.userRole);
        },

        /**
         * Setup device model for responsive behavior
         */
        _setupDeviceModel: function () {
            const oDeviceModel = new JSONModel(sap.ui.Device);
            oDeviceModel.setDefaultBindingMode("OneWay");
            this.getView().setModel(oDeviceModel, "device");
        },

        /**
         * Start polling for notifications
         */
        _startNotificationPolling: function () {
            this._notificationInterval = setInterval(() => {
                this._loadNotifications();
            }, 30000);

            this._loadNotifications();
        },

        /**
         * Load notifications from backend
         */
        _loadNotifications: function () {
            const oAppStateModel = this.getView().getModel("appState");
            const iNotificationCount = Math.floor(Math.random() * 10);
            oAppStateModel.setProperty("/notificationCount", iNotificationCount);
        },

        /**
         * Handle route matched event
         */
        _onRouteMatched: function (oEvent) {
            const sRouteName = oEvent.getParameter("name");
            const oAppStateModel = this.getView().getModel("appState");
            
            oAppStateModel.setProperty("/selectedKey", sRouteName);
            this._updatePageTitle(sRouteName);
        },

        /**
         * Update page title based on route
         */
        _updatePageTitle: function (sRouteName) {
            const mTitles = {
                "Dashboard": "Dashboard",
                "GoodsReceipt": "Goods Receipt",
                "PutAway": "Put-Away Management",
                "ReceivingHistory": "Receiving History",
                "PickingTasks": "Picking Tasks",
                "Packing": "Packing Management",
                "Shipping": "Shipping Queue",
                "Analytics": "Analytics Dashboard",
                "PerformanceReports": "Performance Reports",
                "ExceptionReports": "Exception Reports",
                "BinManagement": "Bin Management",
                "TagRegistry": "Tag Registry",
                "ZoneConfiguration": "Zone Configuration",
                "UserManagement": "User Management",
                "SystemSettings": "System Settings"
            };

            const sTitle = mTitles[sRouteName] || "RFID Warehouse Suite";
            document.title = `${sTitle} - RFID Warehouse Suite`;
        },

        /**
         * Toggle side navigation
         */
        onSideNavButtonPress: function () {
            const oAppStateModel = this.getView().getModel("appState");
            const bExpanded = oAppStateModel.getProperty("/sideNavExpanded");
            oAppStateModel.setProperty("/sideNavExpanded", !bExpanded);
        },

        /**
         * Handle side navigation item selection
         */
        onItemSelect: function (sKey) {
            // const oItem = oEvent.getParameter("item");
            // const sKey = oItem.getKey();

            if (sKey === "Help") {
                this._showHelp();
                return;
            }

            if (sKey === "About") {
                this._showAbout();
                return;
            }

            this._oRouter.navTo(sKey);

            if (sap.ui.Device.system.phone) {
                const oAppStateModel = this.getView().getModel("appState");
                oAppStateModel.setProperty("/sideNavExpanded", false);
            }
        },

        /**
         * Handle user avatar press
         */
        onUserAvatarPress: function (oEvent) {
            const oAppStateModel = this.getView().getModel("appState");
            const sUserName = oAppStateModel.getProperty("/userName");
            const sUserRole = oAppStateModel.getProperty("/userRole");

            if (!this._oUserActionsSheet) {
                this._oUserActionsSheet = new sap.m.ActionSheet({
                    title: sUserName + " - " + sUserRole,
                    showCancelButton: true,
                    buttons: [
                        new sap.m.Button({
                            text: "My Profile",
                            icon: "sap-icon://employee",
                            press: this.onMyProfile.bind(this)
                        }),
                        new sap.m.Button({
                            text: "Change Password",
                            icon: "sap-icon://key",
                            press: this.onChangePassword.bind(this)
                        }),
                        new sap.m.Button({
                            text: "Preferences",
                            icon: "sap-icon://action-settings",
                            press: this.onPreferences.bind(this)
                        }),
                        new sap.m.Button({
                            text: "Logout",
                            icon: "sap-icon://log",
                            type: "Emphasized",
                            press: this.onLogout.bind(this)
                        })
                    ]
                });
            }

            this._oUserActionsSheet.openBy(oEvent.getSource());
        },

        /**
         * Handle search button press
         */
        onSearchButtonPressed: function (oEvent) {
            MessageBox.information(
                "Search functionality will open a dialog to search across:\n\n" +
                "• Materials\n" +
                "• Purchase Orders\n" +
                "• Sales Orders\n" +
                "• Bins\n" +
                "• Tasks\n" +
                "• Tags",
                {
                    title: "Global Search",
                    styleClass: "sapUiSizeCompact"
                }
            );
            // TODO: Open search dialog with advanced filters
        },

        /**
         * Handle search live change
         */
        onSearchLiveChange: function (oEvent) {
            const sValue = oEvent.getParameter("value");
        },

        /**
         * Handle notifications button press
         */
        onNotificationsPressed: function (oEvent) {
            const oButton = oEvent.getSource();
            
            if (!this._oNotificationsPopover) {
                this._oNotificationsPopover = new sap.m.ResponsivePopover({
                    title: "Notifications",
                    placement: sap.m.PlacementType.Bottom,
                    contentWidth: "400px",
                    content: [
                        new sap.m.List({
                            items: [
                                new sap.m.NotificationListItem({
                                    title: "New Picking Task Assigned",
                                    description: "PT-10007 has been assigned to you",
                                    datetime: "2 minutes ago",
                                    priority: sap.ui.core.Priority.High,
                                    close: function(oEvent) {
                                        oEvent.getSource().getParent().removeItem(oEvent.getSource());
                                    }
                                }),
                                new sap.m.NotificationListItem({
                                    title: "Zone B Capacity Warning",
                                    description: "Zone B has reached 88% capacity",
                                    datetime: "15 minutes ago",
                                    priority: sap.ui.core.Priority.Medium,
                                    close: function(oEvent) {
                                        oEvent.getSource().getParent().removeItem(oEvent.getSource());
                                    }
                                }),
                                new sap.m.NotificationListItem({
                                    title: "Goods Receipt Completed",
                                    description: "PO-12345 has been fully received",
                                    datetime: "1 hour ago",
                                    priority: sap.ui.core.Priority.Low,
                                    close: function(oEvent) {
                                        oEvent.getSource().getParent().removeItem(oEvent.getSource());
                                    }
                                })
                            ]
                        })
                    ],
                    footer: new sap.m.Toolbar({
                        content: [
                            new sap.m.ToolbarSpacer(),
                            new sap.m.Button({
                                text: "Clear All",
                                press: function() {
                                    this._oNotificationsPopover.getContent()[0].removeAllItems();
                                    const oAppStateModel = this.getView().getModel("appState");
                                    oAppStateModel.setProperty("/notificationCount", 0);
                                }.bind(this)
                            })
                        ]
                    })
                });
            }
            
            this._oNotificationsPopover.openBy(oButton);
        },

        /**
         * Show help dialog
         */
        _showHelp: function () {
            MessageBox.information(
                "For help and support, please contact:\n\n" +
                "Email: support@rfidwarehouse.com\n" +
                "Phone: +1-800-RFID-HELP\n\n" +
                "Documentation: https://docs.rfidwarehouse.com",
                {
                    title: "Help & Support",
                    styleClass: "sapUiSizeCompact"
                }
            );
        },

        /**
         * Show about dialog
         */
        _showAbout: function () {
            MessageBox.information(
                "RFID Warehouse Suite\n" +
                "Version 1.0.0\n\n" +
                "© 2025 Your Company\n\n" +
                "Powered by SAP Fiori and SAPUI5",
                {
                    title: "About",
                    styleClass: "sapUiSizeCompact"
                }
            );
        },

        onMyProfile: function () {
            MessageToast.show("Opening profile...");
        },

        onChangePassword: function () {
            MessageToast.show("Opening change password dialog...");
        },

        onPreferences: function () {
            MessageToast.show("Opening preferences...");
        },

        onLogout: function () {
            MessageBox.confirm(
                "Are you sure you want to logout?",
                {
                    title: "Confirm Logout",
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.OK) {
                            if (this._notificationInterval) {
                                clearInterval(this._notificationInterval);
                            }
                            MessageToast.show("Logging out...");
                        }
                    }.bind(this)
                }
            );
        },

        onExit: function () {
            if (this._notificationInterval) {
                clearInterval(this._notificationInterval);
            }
            if (this._oUserActionsSheet) {
                this._oUserActionsSheet.destroy();
            }
            if (this._oNotificationsPopover) {
                this._oNotificationsPopover.destroy();
            }
        }

    });
});