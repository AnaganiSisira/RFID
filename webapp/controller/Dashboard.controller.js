sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/format/DateFormat"
], function (Controller, JSONModel, MessageToast, MessageBox, DateFormat) {
    "use strict";

    return Controller.extend("rfidwarehousesuiteui.controller.Dashboard", {

        onInit: function () {
            // Initialize dashboard model
            const oDashboardModel = new JSONModel({
                warehouseName: "Main Warehouse - Atlanta",
                currentDateTime: this._getCurrentDateTime(),
                kpi: {
                    activeTasks: 24,
                    activeTasksTrend: 12,
                    pendingReceipts: 8,
                    completedToday: 156,
                    todayTarget: 180,
                    activeAlerts: 3
                },
                activities: [],
                zones: [],
                activeWorkers: [],
                activeWorkersCount: 0,
                activities: [
            { name: "John D.",     action: "Picked SKU-10234",  time: "2s ago",  type: "pick" },
            { name: "Sarah M.",    action: "Put away SKU-20145", time: "8s ago",  type: "putaway" },
            { name: "Mike R.",     action: "Picked SKU-30456",   time: "15s ago", type: "pick" },
            { name: "Lisa K.",     action: "Counted SKU-40234",  time: "23s ago", type: "count" },
            { name: "Tom B.",      action: "Put away SKU-50123", time: "34s ago", type: "putaway" },
            { name: "David H.",    action: "Error SKU-70345",    time: "1m ago",  type: "error" }
        ]
            });
            this.getView().setModel(oDashboardModel, "dashboard");

            // Load initial data
            this._loadDashboardData();

            // Start real-time updates
            this._startRealTimeUpdates();

            // Update date/time every second
            this._startDateTimeUpdate();

            // Get router
            this._oRouter = this.getOwnerComponent().getRouter();
        },

        /**
         * Get current date and time formatted
         */
        _getCurrentDateTime: function () {
            const oDateFormat = DateFormat.getDateTimeInstance({
                pattern: "EEE, MMM dd, yyyy - HH:mm:ss"
            });
            return oDateFormat.format(new Date());
        },

        /**
         * Start date/time update interval
         */
        _startDateTimeUpdate: function () {
            this._dateTimeInterval = setInterval(() => {
                const oDashboardModel = this.getView().getModel("dashboard");
                oDashboardModel.setProperty("/currentDateTime", this._getCurrentDateTime());
            }, 1000);
        },

        /**
         * Load all dashboard data
         */
        _loadDashboardData: function () {
            this._loadKPIs();
            this._loadActivities();
            this._loadZoneStatus();
            this._loadActiveWorkers();
        },

        /**
         * Load KPI data
         */
        _loadKPIs: function () {
            // TODO: Replace with actual OData service call
            const oDashboardModel = this.getView().getModel("dashboard");
            
            // Simulated data - replace with service call
            const oKPIData = {
                activeTasks: Math.floor(Math.random() * 50) + 10,
                activeTasksTrend: Math.floor(Math.random() * 30) - 10,
                pendingReceipts: Math.floor(Math.random() * 15) + 5,
                completedToday: Math.floor(Math.random() * 100) + 100,
                todayTarget: 180,
                activeAlerts: Math.floor(Math.random() * 5)
            };

            oDashboardModel.setProperty("/kpi", oKPIData);
        },

        /**
         * Load activity feed
         */
        _loadActivities: function () {
            // TODO: Replace with actual OData service call
            const oDashboardModel = this.getView().getModel("dashboard");
            
            // Simulated activity data
            const aActivities = [
                {
                    userName: "John Smith",
                    icon: "sap-icon://receipt",
                    taskType: "Goods Receipt",
                    timestamp: "2 minutes ago",
                    description: "Completed goods receipt for PO-12345 (125 items)"
                },
                {
                    userName: "Sarah Johnson",
                    icon: "sap-icon://cart",
                    taskType: "Picking",
                    timestamp: "5 minutes ago",
                    description: "Started picking task PT-8976 for Sales Order SO-54321"
                },
                {
                    userName: "Mike Wilson",
                    icon: "sap-icon://add-product",
                    taskType: "Put-Away",
                    timestamp: "8 minutes ago",
                    description: "Put away 45 items to Zone A - Bin A-12-03"
                },
                {
                    userName: "Emma Davis",
                    icon: "sap-icon://shipping-status",
                    taskType: "Packing",
                    timestamp: "12 minutes ago",
                    description: "Completed packing for shipment SH-7890"
                },
                {
                    userName: "System",
                    icon: "sap-icon://alert",
                    taskType: "Alert",
                    timestamp: "15 minutes ago",
                    description: "Zone B capacity reached 85% - Consider redistribution"
                }
            ];

            oDashboardModel.setProperty("/activities", aActivities);
        },

        /**
         * Load warehouse zone status
         */
        _loadZoneStatus: function () {
            // TODO: Replace with actual OData service call
            const oDashboardModel = this.getView().getModel("dashboard");
            
            // Simulated zone data
            const aZones = [
                {
                    zoneName: "Zone A - Fast Moving",
                    occupancyPercent: 75,
                    capacity: 200,
                    usedBins: 150
                },
                {
                    zoneName: "Zone B - Bulk Storage",
                    occupancyPercent: 88,
                    capacity: 500,
                    usedBins: 440
                },
                {
                    zoneName: "Zone C - Secure",
                    occupancyPercent: 45,
                    capacity: 100,
                    usedBins: 45
                },
                {
                    zoneName: "Zone D - Cold Storage",
                    occupancyPercent: 62,
                    capacity: 150,
                    usedBins: 93
                }
            ];

            oDashboardModel.setProperty("/zones", aZones);
        },

        /**
         * Load active workers
         */
        _loadActiveWorkers: function () {
            // TODO: Replace with actual OData service call
            const oDashboardModel = this.getView().getModel("dashboard");
            
            // Simulated worker data
            const aWorkers = [
                {
                    initials: "JS",
                    name: "John Smith",
                    currentTask: "Picking - PT-8976",
                    location: "Zone A - Aisle 12",
                    tasksCompleted: 23,
                    status: "Busy"
                },
                {
                    initials: "SJ",
                    name: "Sarah Johnson",
                    currentTask: "None",
                    location: "Receiving Dock",
                    tasksCompleted: 18,
                    status: "Available"
                },
                {
                    initials: "MW",
                    name: "Mike Wilson",
                    currentTask: "Put-Away - PA-5432",
                    location: "Zone B - Aisle 5",
                    tasksCompleted: 31,
                    status: "Busy"
                },
                {
                    initials: "ED",
                    name: "Emma Davis",
                    currentTask: "Packing - PK-1234",
                    location: "Packing Station 3",
                    tasksCompleted: 15,
                    status: "Busy"
                },
                {
                    initials: "RB",
                    name: "Robert Brown",
                    currentTask: "None",
                    location: "Break Room",
                    tasksCompleted: 12,
                    status: "Available"
                }
            ];

            oDashboardModel.setProperty("/activeWorkers", aWorkers);
            oDashboardModel.setProperty("/activeWorkersCount", aWorkers.length);
        },

        /**
         * Start real-time updates
         */
        _startRealTimeUpdates: function () {
            // Refresh data every 10 seconds
            this._updateInterval = setInterval(() => {
                this._loadDashboardData();
            }, 10000);
        },

        /**
         * Refresh dashboard manually
         */
        onRefresh: function () {
            const oDashboardModel = this.getView().getModel("dashboard");
            oDashboardModel.setProperty("/currentDateTime", this._getCurrentDateTime());
            
            this._loadDashboardData();
            MessageToast.show("Dashboard refreshed");
        },

        /**
         * View alerts details
         */
        onViewAlerts: function () {
            MessageBox.information(
                "Active Alerts:\n\n" +
                "1. Zone B capacity at 88%\n" +
                "2. Picking task PT-7654 overdue\n" +
                "3. RFID reader offline in Zone C",
                {
                    title: "Active Alerts",
                    actions: [MessageBox.Action.OK, "View All Alerts"],
                    onClose: function (sAction) {
                        if (sAction === "View All Alerts") {
                            this._oRouter.navTo("ExceptionReports");
                        }
                    }.bind(this)
                }
            );
        },

        /**
         * Filter activities
         */
        onFilterActivities: function () {
            MessageToast.show("Activity filter dialog - Coming soon");
            // TODO: Implement activity filter dialog
        },

        /**
         * Quick Action: Create Picking Wave
         */
        onCreatePickingWave: function () {
            this._oRouter.navTo("PickingTasks");
        },

        /**
         * Quick Action: Start Goods Receipt
         */
        onStartGoodsReceipt: function () {
            this._oRouter.navTo("GoodsReceipt");
        },

        /**
         * Quick Action: Generate Tags
         */
        onGenerateTags: function () {
            this._oRouter.navTo("TagRegistry");
        },

        /**
         * Quick Action: Start Cycle Count
         */
        onStartCycleCount: function () {
            MessageBox.information(
                "Cycle Count functionality will be available in the next release.",
                {
                    title: "Coming Soon"
                }
            );
        },

        /**
         * Quick Action: View Reports
         */
        onViewReports: function () {
            this._oRouter.navTo("Analytics");
        },

        /**
         * Quick Action: Manage Bins
         */
        onManageBins: function () {
            this._oRouter.navTo("BinManagement");
        },

        /**
         * Cleanup on exit
         */
        onExit: function () {
            if (this._updateInterval) {
                clearInterval(this._updateInterval);
            }
            if (this._dateTimeInterval) {
                clearInterval(this._dateTimeInterval);
            }
        },
        onToggleActivityFeed:function(){
            let sVisible=this.byId("activityFeedSidebar").getVisible();
            this.byId("activityFeedSidebar").setVisible(!sVisible);
        }

    });
});