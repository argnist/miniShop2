miniShop2.grid.OrderPropertiesVariants = function(config) {
	config = config || {};

	Ext.applyIf(config,{
		id: 'minishop2-grid-order-properties-variants'
		,url: miniShop2.config.connector_url
		,baseParams: {
			action: 'mgr/orders/properties/variants/getlist'
            ,property_id : config.property_id
		}
		,fields: ['id','name','value','sort','description']
		,autoHeight: true
		,paging: true
		,remoteSort: true
		,save_action: 'mgr/orders/properties/variants/updatefromgrid'
		,autosave: true
		,columns: [
			{header: _('ms2_id'),dataIndex: 'id',width: 50}
			,{header: _('ms2_order_properties_name'),dataIndex: 'name',width: 100, editor: {xtype: 'textfield', allowBlank: false}}
            ,{header: _('ms2_order_properties_sort'),dataIndex: 'sort',width: 100, editor: {xtype: 'textfield', allowBlank: false}}
            ,{header: _('ms2_order_properties_value'),dataIndex: 'value',width: 100, editor: {xtype: 'textfield', allowBlank: false}}
            ,{header: _('ms2_order_properties_description'),dataIndex: 'description',width: 100, editor: {xtype: 'textfield', allowBlank: false}}
        ]
		,tbar: [{
			text: _('ms2_menu_create')
			,handler: this.createOrderPropertyVariant
			,scope: this
		}]
	});
	miniShop2.grid.OrderPropertiesVariants.superclass.constructor.call(this,config);
};
Ext.extend(miniShop2.grid.OrderPropertiesVariants,MODx.grid.Grid,{
	windows: {}

    ,getMenu: function() {
        var m = [];
        m.push({
            text: _('ms2_menu_remove')
            ,handler: this.removeOrderPropertyVariant
        });
        this.addContextMenuItem(m);
    }

	,createOrderPropertyVariant: function(btn,e) {
        var w = Ext.getCmp('minishop2-minishop2-window-order-property-variant-create');
        if (w) {w.hide().getEl().remove();}

        this.windows.createOrderPropertyVariant = MODx.load({
            xtype: 'minishop2-minishop2-window-order-property-variant-create'
            ,id: 'minishop2-minishop2-window-order-property-variant-create'
            ,fields: this.getOrderPropertyVariantFields('create', {})
            ,listeners: {
                success: {fn:function() { this.refresh(); },scope:this}
                ,hide: {fn:function() {this.getEl().remove()}}
            }
        });

        this.windows.createOrderPropertyVariant.fp.getForm().reset().setValues({
            sort : 100
            ,order_property_id : Ext.getCmp('minishop2-grid-order-properties-variants').baseParams.property_id
        });
        this.windows.createOrderPropertyVariant.show(e.target);
	}

    ,removeOrderPropertyVariant: function(btn,e) {
        if (!this.menu.record) return false;

        MODx.msg.confirm({
            title: _('ms2_menu_remove') + '"' + this.menu.record.name + '"'
            ,text: _('ms2_menu_remove_confirm')
            ,url: this.config.url
            ,params: {
                action: 'mgr/orders/properties/variants/remove'
                ,id: this.menu.record.id
            }
            ,listeners: {
                success: {fn:function(r) {this.refresh();}, scope:this}
            }
        });
    }

    ,getOrderPropertyVariantFields: function(type) {
        var fields = [];
        fields.push({xtype: 'hidden',name: 'order_property_id', id: 'minishop2-order-property-variant-id-'+type}
            ,{xtype: 'textfield',fieldLabel: _('ms2_order_properties_name'), name: 'name', allowBlank: false, anchor: '99%', id: 'minishop2-order-property-variant-name-'+type}
            ,{xtype: 'numberfield',fieldLabel: _('ms2_order_properties_sort'), name: 'sort', allowBlank: false, defaultValue:100, anchor: '99%', id: 'minishop2-order-property-variant-sort-'+type}
            ,{xtype: 'textfield',fieldLabel: _('ms2_order_properties_value'), name: 'value', allowBlank: false, anchor: '99%', id: 'minishop2-order-property-variant-value-'+type}
            ,{xtype: 'textarea',fieldLabel: _('ms2_order_properties_description'), name: 'description', allowBlank: true, anchor: '99%', id: 'minishop2-order-property-variant-description-'+type}
        );
        return fields;
    }
});
Ext.reg('minishop2-grid-order-properties-variants',miniShop2.grid.OrderPropertiesVariants);

miniShop2.window.createOrderPropertyVariant = function(config) {
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
        ,action: 'mgr/orders/properties/variants/create'
        ,fields: config.fields
        ,keys: [{key: Ext.EventObject.ENTER,shift: true,fn: function() {this.submit() },scope: this}]
    });
    miniShop2.window.createOrderPropertyVariant.superclass.constructor.call(this,config);
};
Ext.extend(miniShop2.window.createOrderPropertyVariant,MODx.Window);
Ext.reg('minishop2-minishop2-window-order-property-variant-create',miniShop2.window.createOrderPropertyVariant);
