sap.ui.define([
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/format/NumberFormat"
], function (DateFormat, NumberFormat) {
    "use strict";

    return {

        /**
         * Format date and time
         * @param {Date} oDate - Date object
         * @returns {string} Formatted date time
         */
        formatDateTime: function (oDate) {
            if (!oDate) {
                return "";
            }
            
            const oDateFormat = DateFormat.getDateTimeInstance({
                pattern: "MMM dd, yyyy HH:mm"
            });
            
            return oDateFormat.format(new Date(oDate));
        },

        /**
         * Format date only
         * @param {Date} oDate - Date object
         * @returns {string} Formatted date
         */
        formatDate: function (oDate) {
            if (!oDate) {
                return "";
            }
            
            const oDateFormat = DateFormat.getDateInstance({
                pattern: "MMM dd, yyyy"
            });
            
            return oDateFormat.format(new Date(oDate));
        },

        /**
         * Format time only
         * @param {Date} oDate - Date object
         * @returns {string} Formatted time
         */
        formatTime: function (oDate) {
            if (!oDate) {
                return "";
            }
            
            const oTimeFormat = DateFormat.getTimeInstance({
                pattern: "HH:mm:ss"
            });
            
            return oTimeFormat.format(new Date(oDate));
        },

        /**
         * Format relative time (e.g., "2 hours ago")
         * @param {Date} oDate - Date object
         * @returns {string} Relative time string
         */
        formatRelativeTime: function (oDate) {
            if (!oDate) {
                return "";
            }

            const iNow = Date.now();
            const iDate = new Date(oDate).getTime();
            const iDiff = iNow - iDate;
            
            const iSeconds = Math.floor(iDiff / 1000);
            const iMinutes = Math.floor(iSeconds / 60);
            const iHours = Math.floor(iMinutes / 60);
            const iDays = Math.floor(iHours / 24);

            if (iSeconds < 60) {
                return "Just now";
            } else if (iMinutes < 60) {
                return `${iMinutes} minute${iMinutes !== 1 ? 's' : ''} ago`;
            } else if (iHours < 24) {
                return `${iHours} hour${iHours !== 1 ? 's' : ''} ago`;
            } else if (iDays < 7) {
                return `${iDays} day${iDays !== 1 ? 's' : ''} ago`;
            } else {
                return this.formatDate(oDate);
            }
        },

        /**
         * Format number with thousand separators
         * @param {number} iNumber - Number to format
         * @returns {string} Formatted number
         */
        formatNumber: function (iNumber) {
            if (iNumber === null || iNumber === undefined) {
                return "";
            }
            
            const oNumberFormat = NumberFormat.getIntegerInstance({
                groupingEnabled: true
            });
            
            return oNumberFormat.format(iNumber);
        },

        /**
         * Format currency
         * @param {number} fAmount - Amount
         * @param {string} sCurrency - Currency code
         * @returns {string} Formatted currency
         */
        formatCurrency: function (fAmount, sCurrency) {
            if (fAmount === null || fAmount === undefined) {
                return "";
            }
            
            const oCurrencyFormat = NumberFormat.getCurrencyInstance({
                currencyCode: false
            });
            
            return `${sCurrency || '$'} ${oCurrencyFormat.format(fAmount)}`;
        },

        /**
         * Format percentage
         * @param {number} fValue - Value (0-100)
         * @returns {string} Formatted percentage
         */
        formatPercent: function (fValue) {
            if (fValue === null || fValue === undefined) {
                return "";
            }
            
            const oPercentFormat = NumberFormat.getPercentInstance({
                decimals: 1
            });
            
            return oPercentFormat.format(fValue / 100);
        },

        /**
         * Format status text with icon
         * @param {string} sStatus - Status code
         * @returns {object} Object with icon and text
         */
        formatStatus: function (sStatus) {
            const mStatusMap = {
                "NEW": {
                    text: "New",
                    state: "Information",
                    icon: "sap-icon://information"
                },
                "ASSIGNED": {
                    text: "Assigned",
                    state: "Success",
                    icon: "sap-icon://user-edit"
                },
                "IN_PROGRESS": {
                    text: "In Progress",
                    state: "Warning",
                    icon: "sap-icon://time-entry-request"
                },
                "COMPLETED": {
                    text: "Completed",
                    state: "Success",
                    icon: "sap-icon://accept"
                },
                "CANCELLED": {
                    text: "Cancelled",
                    state: "Error",
                    icon: "sap-icon://cancel"
                },
                "ON_HOLD": {
                    text: "On Hold",
                    state: "Warning",
                    icon: "sap-icon://pause"
                }
            };

            return mStatusMap[sStatus] || {
                text: sStatus,
                state: "None",
                icon: "sap-icon://question-mark"
            };
        },

        /**
         * Format priority
         * @param {string} sPriority - Priority level
         * @returns {string} Display text
         */
        formatPriority: function (sPriority) {
            const mPriorityMap = {
                "HIGH": "High Priority",
                "MEDIUM": "Medium Priority",
                "LOW": "Low Priority"
            };
            
            return mPriorityMap[sPriority] || sPriority;
        },

        /**
         * Get priority state
         * @param {string} sPriority - Priority level
         * @returns {string} Value state
         */
        getPriorityState: function (sPriority) {
            const mStateMap = {
                "HIGH": "Error",
                "MEDIUM": "Warning",
                "LOW": "Success"
            };
            
            return mStateMap[sPriority] || "None";
        },

        /**
         * Format boolean to Yes/No
         * @param {boolean} bValue - Boolean value
         * @returns {string} Yes or No
         */
        formatBoolean: function (bValue) {
            return bValue ? "Yes" : "No";
        },

        /**
         * Format file size
         * @param {number} iBytes - Size in bytes
         * @returns {string} Formatted file size
         */
        formatFileSize: function (iBytes) {
            if (!iBytes || iBytes === 0) {
                return "0 Bytes";
            }
            
            const aUnits = ["Bytes", "KB", "MB", "GB", "TB"];
            const iIndex = Math.floor(Math.log(iBytes) / Math.log(1024));
            const fSize = iBytes / Math.pow(1024, iIndex);
            
            return `${fSize.toFixed(2)} ${aUnits[iIndex]}`;
        },

        /**
         * Format duration in minutes
         * @param {number} iMinutes - Duration in minutes
         * @returns {string} Formatted duration
         */
        formatDuration: function (iMinutes) {
            if (!iMinutes || iMinutes === 0) {
                return "0 min";
            }
            
            const iHours = Math.floor(iMinutes / 60);
            const iMins = iMinutes % 60;
            
            if (iHours === 0) {
                return `${iMins} min`;
            } else if (iMins === 0) {
                return `${iHours} hr`;
            } else {
                return `${iHours} hr ${iMins} min`;
            }
        },

        /**
         * Truncate text with ellipsis
         * @param {string} sText - Text to truncate
         * @param {number} iMaxLength - Maximum length
         * @returns {string} Truncated text
         */
        truncateText: function (sText, iMaxLength) {
            if (!sText) {
                return "";
            }
            
            iMaxLength = iMaxLength || 50;
            
            if (sText.length <= iMaxLength) {
                return sText;
            }
            
            return sText.substring(0, iMaxLength) + "...";
        },

        /**
         * Get initials from name
         * @param {string} sName - Full name
         * @returns {string} Initials
         */
        getInitials: function (sName) {
            if (!sName) {
                return "";
            }
            
            const aParts = sName.trim().split(" ");
            
            if (aParts.length === 1) {
                return aParts[0].charAt(0).toUpperCase();
            }
            
            return (aParts[0].charAt(0) + aParts[aParts.length - 1].charAt(0)).toUpperCase();
        },

          
       
        getUtilizationState: function (utilization) {
            if (!utilization && utilization !== 0) {
                return "None";
            }

            var value = parseFloat(utilization);

            if (value <= 50) {
                return "Success"; // Green
            } else if (value <= 75) {
                return "Warning"; // Orange
            } else {
                return "Error"; // Red
            }
        },

        /**
         * Formatter to add custom CSS class for utilization styling
         * @param {number} utilization - The utilization percentage
         * @returns {string} The CSS class name
         */
        getUtilizationClass: function (utilization) {
            if (!utilization && utilization !== 0) {
                return "";
            }

            var value = parseFloat(utilization);

            if (value <= 50) {
                return "utilizationLow";
            } else if (value <= 75) {
                return "utilizationMedium";
            } else {
                return "utilizationHigh";
            }
        },

        /**
         * Formatter for status state
         * @param {string} status - The status value
         * @returns {string} The state for ObjectStatus
         */
        getStatusState: function (status) {
            switch (status) {
                case "Active":
                    return "Success";
                case "Inactive":
                    return "Error";
                case "Maintenance":
                    return "Warning";
                default:
                    return "None";
            }
        }

    };
});