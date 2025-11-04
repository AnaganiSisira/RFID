sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "rfidwarehousesuiteui/model/formatter"
], function (UIComponent, Device, JSONModel, formatter) {
    "use strict";

    return UIComponent.extend("rfidwarehousesuiteui.Component", {

        metadata: {
            manifest: "json"
        },

        formatter: formatter,

        /**
         * The component is initialized by UI5 automatically during the startup of the app
         * @public
         * @override
         */
        init: function () {
            // Call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // Enable routing
            this.getRouter().initialize();

            // Set device model
            this.setModel(new JSONModel(Device), "device");

            // Initialize application models
            this._initializeModels();

            // Setup security
            this._setupSecurity();
        },

        /**
         * Initialize application models
         * @private
         */
        _initializeModels: function () {
            // App state model for global application state
            const oAppStateModel = new JSONModel({
                busy: false,
                currentUser: null,
                warehouse: null,
                permissions: {},
                settings: {},
                online: true
            });
            this.setModel(oAppStateModel, "appState");

            // User preferences model
            const oUserPrefsModel = new JSONModel({
                language: "en",
                theme: "sap_horizon",
                dateFormat: "MMM dd, yyyy",
                timeFormat: "HH:mm",
                timezone: "UTC",
                refreshInterval: 10000,
                soundEnabled: true,
                notificationsEnabled: true
            });
            this.setModel(oUserPrefsModel, "userPrefs");

            // Load user preferences from local storage
            this._loadUserPreferences();
        },

        /**
         * Load user preferences from local storage
         * @private
         */
        _loadUserPreferences: function () {
            const oUserPrefsModel = this.getModel("userPrefs");
            const sStoredPrefs = localStorage.getItem("rfid.warehouse.userPrefs");
            
            if (sStoredPrefs) {
                try {
                    const oPrefs = JSON.parse(sStoredPrefs);
                    oUserPrefsModel.setData(oPrefs);
                } catch (e) {
                    console.error("Error loading user preferences:", e);
                }
            }
        },

        /**
         * Save user preferences to local storage
         * @public
         */
        saveUserPreferences: function () {
            const oUserPrefsModel = this.getModel("userPrefs");
            const oPrefs = oUserPrefsModel.getData();
            
            try {
                localStorage.setItem("rfid.warehouse.userPrefs", JSON.stringify(oPrefs));
            } catch (e) {
                console.error("Error saving user preferences:", e);
            }
        },

        /**
         * Setup security and authentication
         * @private
         */
        _setupSecurity: function () {
            // Check authentication status
            this._checkAuthentication();

            // Setup CSRF token handling for OData calls
            this._setupCSRFToken();

            // Monitor online/offline status
            this._monitorOnlineStatus();
        },

        /**
         * Check if user is authenticated
         * @private
         */
        _checkAuthentication: function () {
            const oAppStateModel = this.getModel("appState");
            
            // Check if running in Fiori Launchpad
            if (sap.ushell && sap.ushell.Container) {
                // Get user info from Fiori Launchpad
                const oUser = sap.ushell.Container.getService("UserInfo");
                const sUserId = oUser.getId();
                const sUserName = oUser.getFullName();
                const sUserEmail = oUser.getEmail();
                
                oAppStateModel.setProperty("/currentUser", {
                    userId: sUserId,
                    userName: sUserName,
                    email: sUserEmail,
                    authenticated: true
                });
            } else {
                // Standalone mode - simulate user
                oAppStateModel.setProperty("/currentUser", {
                    userId: "TESTUSER",
                    userName: "Test User",
                    email: "test@warehouse.com",
                    authenticated: true
                });
            }

            // Load user permissions
            this._loadUserPermissions();
        },

        /**
         * Load user permissions
         * @private
         */
        _loadUserPermissions: function () {
            const oAppStateModel = this.getModel("appState");
            
            // TODO: Load actual permissions from backend
            oAppStateModel.setProperty("/permissions", {
                canCreateGoodsReceipt: true,
                canCreatePickingTask: true,
                canAssignTasks: true,
                canManageBins: true,
                canManageTags: true,
                canViewReports: true,
                canManageUsers: true,
                canConfigureSystem: true
            });
        },

        /**
         * Setup CSRF token for OData requests
         * @private
         */
        _setupCSRFToken: function () {
            const oModel = this.getModel();
            
            if (oModel && oModel.refreshSecurityToken) {
                oModel.refreshSecurityToken();
            }
        },

        /**
         * Monitor online/offline status
         * @private
         */
        _monitorOnlineStatus: function () {
            const oAppStateModel = this.getModel("appState");
            
            window.addEventListener("online", function () {
                oAppStateModel.setProperty("/online", true);
                sap.m.MessageToast.show("Connection restored");
            });
            
            window.addEventListener("offline", function () {
                oAppStateModel.setProperty("/online", false);
                sap.m.MessageToast.show("No internet connection");
            });
        },

        /**
         * Get content density class
         * @public
         * @returns {string} CSS class
         */
        getContentDensityClass: function () {
            if (this._sContentDensityClass === undefined) {
                if (Device.support.touch) {
                    this._sContentDensityClass = "sapUiSizeCozy";
                } else {
                    this._sContentDensityClass = "sapUiSizeCompact";
                }
            }
            return this._sContentDensityClass;
        },

        /**
         * Clean up component resources
         * @public
         * @override
         */
        destroy: function () {
            // Save user preferences before exit
            this.saveUserPreferences();
            
            // Call parent destroy
            UIComponent.prototype.destroy.apply(this, arguments);
        }

    });
});