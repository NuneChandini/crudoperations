sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller}
     */
    function (Controller, MessageBox) {
        "use strict";

        return Controller.extend("crudoperations.controller.View1", {
            onInit: function () {
                this.onReadAll();
                // this.onReadFilters();
                // this.onReadSorter();
                // this.onReadParameters();
                // this.onReadKey();
            },
            onDelete: function (oEvent) {
                debugger;
                var oContext = oEvent.getSource().getBindingContext().getObject();
                MessageBox.confirm("Are you sure that you want to delete the record", {
                    title: "Confirm",
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function (sAction) {
                        if (sAction === "YES") {
                            this.onDeleteSpecificRecord(oContext);
                        }
                    }.bind(this),
                })
            },
            onDeleteSpecificRecord: function (oRecord) {
                var oDataModel = this.getOwnerComponent().getModel();
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Deleting Record",
                    text: "please wait...",
                });
                oBusyDialog.open();
                oDataModel.remove("/Products(ID=" + oRecord.ID + ")", {
                    success: function (oresponse) {
                        oBusyDialog.close();
                        this.onReadAll();
                    },
                    error: function (oerror) {
                        oBusyDialog.close();
                    }.bind(this)
                })
            },

            onReadAll: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/Products", {
                    success: function (odata) {
                        var jModel = new sap.ui.model.json.JSONModel(odata);
                        that.getView().byId("idProducts").setModel(jModel);
                    },
                    error: function (oerror) {
                        console.log(oerror);
                    }
                });
            },
            oncheck: function () {
                var inputvalue = this.getView().byId("idinput").getValue();
                if (inputvalue < 5) {
                    MessageBox.success("arey-kottinakoda");
                }
                else {
                    MessageBox.error("dobindi");
                }
            },
            onReadFilters: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var oFilter = new sap.ui.model.Filter('Rating', 'EQ', '4');
                oModel.read("/Products", {
                    filters: [oFilter],
                    success: function (odata) {
                        var jModel = new sap.ui.model.json.JSONModel(odata);
                        that.getView().byId("idProducts").setModel(jModel);
                    }, error: function (oerror) {
                        console.log(oerror);
                    }
                });
            },
            onReadSorter: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var oSorter = new sap.ui.model.Sorter('Price', false);
                oModel.read("/Products", {
                    sorters: [oSorter],
                    success: function (odata) {
                        var jModel = new sap.ui.model.json.JSONModel(odata);
                        that.getView().byId("idProducts").setModel(jModel);
                    },
                    error: function (oerror) {
                        console.log(oerror);
                    }
                });
            },
            onReadParameters: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/Products", {
                    urlParameters: { $skip: 2, $top: 4 },
                    success: function (odata) {
                        var jModel = new sap.ui.model.json.JSONModel(odata);
                        that.getView().byId("idProducts").setModel(jModel);
                    },
                    error: function (oerror) {
                        console.log(oerror);
                    }
                });
            },
            onReadKey: function () {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/Products(2)", {
                    success: function (odata) {
                        var jModel = new sap.ui.model.json.JSONModel({ results: [odata] });
                        that.getView().byId("idProducts").setModel(jModel);
                    },
                    error: function (oerror) {
                        console.log(oerror);
                    }
                });
            },
            onEdit: function (oEvent) {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                oModel.setUseBatch(false);
                if (oEvent.getSource().getText() === "Edit") {
                    oEvent.getSource().setText("Submit");
                    oEvent.getSource().getParent().getParent().getCells()[3].setEditable(true);

                }
                else {
                    oEvent.getSource().setText("Edit");
                    oEvent.getSource().getParent().getParent().getCells()[3].setEditable(false);
                    var oInput = oEvent.getSource().getParent().getParent().getCells()[3].getValue();
                    var oId = oEvent.getSource().getBindingContext().getProperty("ID");
                    oModel.update("/Products(" + oId + ")", { Rating: oInput }, {
                        success: function (odata) {
                            that.onReadAll();
                        },
                        error: function (oerror) {
                            console.log(oerror);
                        }
                    });
                }

            },
            onCreate: function () {
                this.getView().byId("idcreate").setVisible(true).open();
                // var jModel = new sap.ui.model.json.JSONModel();
                // this.getView().setModel(jModel, "create");
                // sap.ui.getCore().setModel()(jModel, "create");
            },
            onAdd: function () {
                var jModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(jModel, "create");
                var oCreateData = this.getView().getModel("create").byId("idcreate").getData();

                var oModel = this.getOwnerComponent().getModel();
                this.getView().byId("idcreate").setVisible(true).close();
                oModel.create("/Products", oCreateData, {
                    success: function (oData) {
                        console.log(oData);
                    }, error: function (oerror) {
                        console.log(oerror);
                    }
                });
            },
            onCancel: function () {
                this.getView().byId("idcreate").setVisible(true).close();
            },
            onDuplicate: function (oEvent) {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                oModel.setUseBatch(false);
                var oduplicatedata = oEvent.getSource().getBindingContext().getObject();
                oduplicatedata.ID = 100 + oduplicatedata.ID;
                oModel.create("/Products", oduplicatedata, {
                    success: function (oData) {
                        that.onReadAll();
                    }, error: function (oerror) {
                        console.log(oerror);
                    }
                });
            }
        });
    });
