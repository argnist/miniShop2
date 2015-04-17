miniShop2.grid.OrderProperties = function(config) {
	config = config || {};

	Ext.applyIf(config,{
		id: 'minishop2-grid-order-properties'
		,url: miniShop2.config.connector_url
		,baseParams: {
			action: 'mgr/orders/properties/getlist'
		}
		,fields: ['id','name','code','active','sort','type','required','multiple','group']
		,autoHeight: true
		,paging: true
		,remoteSort: true
		,autosave: false
        ,editable: false
		,columns: [
			{header: _('ms2_id'),dataIndex: 'id',width: 50}
			,{header: _('ms2_order_properties_name'),dataIndex: 'name',width: 100}
            ,{header: _('ms2_order_properties_code'),dataIndex: 'code',width: 100}
            ,{header: _('ms2_order_properties_activity'),dataIndex: 'active',width: 100, renderer: this.renderBoolean}
            ,{header: _('ms2_order_properties_required'),dataIndex: 'required',width: 100, renderer: this.renderBoolean}
            ,{header: _('ms2_order_properties_sort'),dataIndex: 'sort',width: 100}
            ,{header: _('ms2_order_properties_type'),dataIndex: 'type',width: 100}
            ,{header: _('ms2_order_properties_group_id'),dataIndex: 'group',width: 100}
            ,{header: _('ms2_order_properties_multiple'),dataIndex: 'multiple',width: 100, renderer: this.renderBoolean}
        ]
		,tbar: [{
			text: _('ms2_order_properties_btn_add')
			,handler: this.createOrderProperty
			,scope: this
		}]
        ,listeners: {
            rowDblClick: function(grid, rowIndex, e) {
                var row = grid.store.getAt(rowIndex);
                this.updateOrderProperty(grid, e, row);
            }
        }
	});
	miniShop2.grid.OrderProperties.superclass.constructor.call(this,config);
};
Ext.extend(miniShop2.grid.OrderProperties,MODx.grid.Grid,{
	windows: {}

    ,renderBoolean: function(value) {
        if (value == 1) {return _('yes');}
        else {return _('no');}
    }

    ,getMenu: function() {
        var m = [];
        m.push({
            text: _('ms2_menu_update')
            ,handler: this.updateOrderProperty
        });
        m.push('-');
        m.push({
            text: _('ms2_menu_remove')
            ,handler: this.removeOrderProperty
        });
        this.addContextMenuItem(m);
    }

	,createOrderProperty: function(btn,e) {
        var w = Ext.getCmp('minishop2-window-order-property-create');
        if (w) {w.hide().getEl().remove();}

        this.windows.createOrderProperty = MODx.load({
            xtype: 'minishop2-window-order-property-create'
            ,id: 'minishop2-window-order-property-create'
            ,fields: this.getOrderPropertyFields('create', {})
            ,listeners: {
                success: {fn:function() { this.refresh(); },scope:this}
                ,hide: {fn:function() {this.getEl().remove()}}
            }
        });

        this.windows.createOrderProperty.fp.getForm().reset().setValues({
            sort : 100
        });
        this.windows.createOrderProperty.show(e.target);
	}

    ,updateOrderProperty: function(btn,e,row) {
        if (typeof(row) != 'undefined') {this.menu.record = row.data;}
        var id = this.menu.record.id;

        MODx.Ajax.request({
            url: miniShop2.config.connector_url
            ,params: {
                action: 'mgr/orders/properties/get'
                ,id: id
            }
            ,listeners: {
                success: {fn:function(r) {
                    var w = Ext.getCmp('minishop2-window-order-property-update');
                    if (w) {w.hide().getEl().remove();}

                    w = MODx.load({
                        xtype: 'minishop2-window-order-property-update'
                        ,id: 'minishop2-window-order-property-update'
                        ,record:r.object
                        ,listeners: {
                            success: {fn:function() {this.refresh();},scope:this}
                            ,hide: {fn: function() {
                                if (miniShop2.grid.OrderProperties.changed === true) {
                                    Ext.getCmp('minishop2-grid-order-properties').getStore().reload();
                                    miniShop2.grid.OrderProperties.changed = false;
                                }
                                this.getEl().remove();
                            }}
                        }
                    });

                    Ext.getCmp('entities-panel').add({
                        xtype: 'minishop2-combo-entities',
                        name : 'delivery',
                        id: 'combo-delivery',
                        fieldLabel : _('ms2_order_properties_delivery_link'),
                        store : new Ext.data.JsonStore({
                            id: 'msDelivery-store'
                            ,root:'results'
                            ,autoLoad: true
                            ,autoSave: false
                            ,totalProperty:'total'
                            ,fields:['id','name']
                            ,url: miniShop2.config.connector_url
                            ,baseParams: {
                                action: 'mgr/settings/delivery/getlist'
                                ,combo: true
                            }
                        })
                    });
                    var comboDelivery = Ext.getCmp('combo-delivery');

                    comboDelivery.getStore().on('load',function(){
                        comboDelivery.setValue(r.object.delivery.join(","))
                    });

                    Ext.getCmp('entities-panel').add({
                        xtype: 'minishop2-combo-entities',
                        name : 'payment',
                        id : 'combo-payment',
                        fieldLabel : _('ms2_order_properties_payment_link'),
                        store : new Ext.data.JsonStore({
                            id: 'msPayment-store'
                            ,root:'results'
                            ,autoLoad: true
                            ,autoSave: false
                            ,totalProperty:'total'
                            ,fields:['id','name']
                            ,url: miniShop2.config.connector_url
                            ,baseParams: {
                                action: 'mgr/settings/payment/getlist'
                                ,combo: true
                            }
                        })
                    });
                    var comboPayment = Ext.getCmp('combo-payment');
                    comboPayment.getStore().on('load',function(){
                        comboPayment.setValue(r.object.payment.join(","))
                    });

                    w.fp.getForm().reset();
                    w.fp.getForm().setValues(r.object);
                    w.show(e.target,function() {w.setPosition(null,100)},this);
                },scope:this}
            }
        });
    }

    ,loadGroups: function(combo, record, index) {
        var groups = Ext.getCmp('minishop2-order-property-group_id-create');
        groups.getStore().setBaseParam('person_type_id',record.id);
        groups.getStore().load();
        groups.setDisabled(false);
    }

    ,getOrderPropertyFields: function(type) {
        var fields = [];

        switch (type){
            case 'create':
                fields.push({xtype: 'minishop2-combo-person-type',listeners: {
                        'select': {
                            fn: this.loadGroups,
                            scope: this
                        }
                    },fieldLabel: _('ms2_order_properties_groups_person_type_id'), name: 'person_type_id', allowBlank: false, anchor: '99%' , id: 'minishop2-order-properties-group-person_type_id-'+type}
                );
                break;
            case 'update' :
                fields.push({
                    xtype: 'displayfield',
                    name: 'person_type',
                    fieldLabel: _('ms2_order_properties_groups_person_type_id')
                });
                break;
        }

        fields.push({xtype: 'hidden',name: 'id', id: 'minishop2-order-property-id-'+type}
            ,{xtype: 'textfield',fieldLabel: _('ms2_order_properties_name'), name: 'name', allowBlank: false, anchor: '99%', id: 'minishop2-order-property-name-'+type}
            ,{xtype: 'textfield',fieldLabel: _('ms2_order_properties_code'), name: 'code', allowBlank: false, anchor: '99%', id: 'minishop2-order-property-code-'+type}
            ,{xtype: 'minishop2-combo-order-properties-types',fieldLabel: _('ms2_order_properties_type'), hiddenName: 'type', allowBlank: false, anchor: '99%', id: 'minishop2-order-property-type-'+type}
            ,{xtype: 'xcheckbox',fieldLabel: _('ms2_order_properties_activity'), name: 'active', allowBlank: true, anchor: '99%', id: 'minishop2-order-property-activity-'+type}
            ,{xtype: 'numberfield',fieldLabel: _('ms2_order_properties_sort'), name: 'sort', allowBlank: false, defaultValue:100, anchor: '99%', id: 'minishop2-order-property-sort-'+type}
            ,{xtype: 'minishop2-combo-order-properties-group-type',fieldLabel: _('ms2_order_properties_group_id'), name: 'group_id', allowBlank: false, anchor: '99%',disabled:true, id: 'minishop2-order-property-group_id-'+type}
            ,{xtype: 'textfield',fieldLabel: _('ms2_order_properties_default_value'), name: 'default_value', allowBlank: true, anchor: '99%', id: 'minishop2-order-property-default_value-'+type}
            ,{xtype: 'textarea',fieldLabel: _('ms2_order_properties_description'), name: 'description', allowBlank: true, anchor: '99%', id: 'minishop2-order-property-description-'+type}
            ,{xtype: 'xcheckbox',fieldLabel: _('ms2_order_properties_required'), name: 'required', allowBlank: true, anchor: '99%', id: 'minishop2-order-property-required-'+type}
        );
        return fields;
    }
});
Ext.reg('minishop2-grid-order-properties',miniShop2.grid.OrderProperties);

miniShop2.window.createOrderProperty = function(config) {
    config = config || {};
    this.ident = config.ident || 'mecitem'+Ext.id();
    Ext.applyIf(config,{
        title: _('ms2_menu_create')
        ,id: this.ident
        ,width: 600
        ,autoHeight: true
        ,labelAlign: 'left'
        ,labelWidth: 180
        ,url: miniShop2.config.connector_url
        ,action: 'mgr/orders/properties/create'
        ,fields: config.fields
        ,keys: [{key: Ext.EventObject.ENTER,shift: true,fn: function() {this.submit() },scope: this}]
    });
    miniShop2.window.createOrderProperty.superclass.constructor.call(this,config);
};
Ext.extend(miniShop2.window.createOrderProperty,MODx.Window);
Ext.reg('minishop2-window-order-property-create',miniShop2.window.createOrderProperty);

miniShop2.window.UpdateOrderProperty = function(config) {
    config = config || {};
    this.ident = config.ident || 'meuitem'+Ext.id();
    Ext.applyIf(config,{
        title: _('ms2_menu_update')
        ,id: this.ident
        ,width: 600
        ,autoHeight: true
        ,labelAlign: 'left'
        ,labelWidth: 180
        ,url: miniShop2.config.connector_url
        ,action: 'mgr/orders/properties/update'
        ,fields: {
            xtype: 'modx-tabs'
            //,border: true
            ,activeTab: config.activeTab || 0
            ,bodyStyle: { background: 'transparent'}
            ,deferredRender: false
            ,autoHeight: true
            ,stateful: true
            ,stateId: 'minishop2-window-order-property-update'
            ,stateEvents: ['tabchange']
            ,getState:function() {return {activeTab:this.items.indexOf(this.getActiveTab())};}
            ,items: this.getTabs(config)
        }
        ,keys: [{key: Ext.EventObject.ENTER,shift: true,fn: function() {this.submit() },scope: this}]
    });
    miniShop2.window.UpdateOrderProperty.superclass.constructor.call(this,config);
};
Ext.extend(miniShop2.window.UpdateOrderProperty,MODx.Window,{

    getTabs: function(config) {
        var tabs = [{
            layout: 'form'
            ,title: _('ms2_order_property_fields')
            ,hideMode: 'offsets'
            ,bodyStyle: 'padding:5px 0;'
            ,defaults: {msgTarget: 'under',border: false}
            ,items: Ext.getCmp('minishop2-grid-order-properties').getOrderPropertyFields('update')
        }, {
            id: 'entities-panel'
            ,title: _('ms2_order_property_linking')
            ,xtype: 'panel'
            ,hidden: true
            ,layout: 'form'
            ,border: false
            ,autoHeight: true
            ,autoWidth: true
            ,preventRender: true
            ,items: []
        }];

        for(i in miniShop2.config.order_properties_types){
            if(miniShop2.config.order_properties_types[i].type == config.record.type){
                if(miniShop2.config.order_properties_types[i].variants == 1){
                    tabs.push({
                        xtype: 'minishop2-grid-order-properties-variants'
                        ,title: _('ms2_order_property_variants_values')
                        ,property_id: config.record.id
                    });
                }

                break;
            }
        }

        return tabs;
    }


    ,getLinkingFields: function(config,type){
        var fields = [];

        return fields;
    }
});
Ext.reg('minishop2-window-order-property-update',miniShop2.window.UpdateOrderProperty);

miniShop2.combo.OrderPropertiesTypes = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        typeAhead: true,
        triggerAction: 'all',
        lazyRender:true,
        mode: 'local',
        valueField: 'type',
        displayField: 'name',
        store: new Ext.data.JsonStore({
            fields: ['name','type']
            ,root: 'data'
            ,data: this.getTypes()
        })
    });
    miniShop2.combo.OrderPropertiesTypes.superclass.constructor.call(this,config);
};
Ext.extend(miniShop2.combo.OrderPropertiesTypes, MODx.combo.ComboBox,{

    getTypes : function(){
        var types = {};
        types.data = miniShop2.config.order_properties_types;
        return types;
    }
});
Ext.reg('minishop2-combo-order-properties-types',miniShop2.combo.OrderPropertiesTypes);