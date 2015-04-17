miniShop2.grid.OrderPropertiesGroups = function(config) {
    config = config || {};

    Ext.applyIf(config,{
        id: 'minishop2-grid-order-properties-groups'
        ,url: miniShop2.config.connector_url
        ,baseParams: {
            action: 'mgr/orders/properties/groups/getlist'
        }
        ,fields: ['id','person_type','name','sort']
        ,autoHeight: true
        ,paging: true
        ,remoteSort: true
        ,autosave: false
        ,columns: [
            {header: _('ms2_id'),dataIndex: 'id',width: 50}
            ,{header: _('ms2_order_properties_groups_name'),dataIndex: 'name',width: 100}
            ,{header: _('ms2_order_properties_groups_person_type_id'),dataIndex: 'person_type',width: 100}
            ,{header: _('ms2_order_properties_sort'),dataIndex: 'sort',width: 100}
        ]
        ,tbar: [{
            text: _('ms2_order_properties_groups_btn_add')
            ,handler: this.createOrderPropertiesGroups
            ,scope: this
        }]
        ,listeners: {
            rowDblClick: function(grid, rowIndex, e) {
                var row = grid.store.getAt(rowIndex);
                this.updateOrderPropertiesGroups(grid, e, row);
            }
        }
    });
    miniShop2.grid.OrderPropertiesGroups.superclass.constructor.call(this,config);
    this.changed = false;
};
Ext.extend(miniShop2.grid.OrderPropertiesGroups,MODx.grid.Grid,{
    windows: {}

    ,getMenu: function() {
        var m = [];
        m.push({
            text: _('ms2_menu_update')
            ,handler: this.updateOrderPropertiesGroups
        });
        m.push('-');
        m.push({
            text: _('ms2_menu_remove')
            ,handler: this.removeOrderPropertiesGroups
        });
        this.addContextMenuItem(m);
    }

    ,createOrderPropertiesGroups: function(btn,e) {
        var w = Ext.getCmp('minishop2-window-order-properties-group-create');
        if (w) {w.hide().getEl().remove();}

        this.windows.createOrderPropertiesGroup = MODx.load({
            xtype: 'minishop2-window-order-properties-group-create'
            ,id: 'minishop2-window-order-properties-group-create'
            ,fields: this.getOrderProperiesGroupFields('create', {})
            ,listeners: {
                success: {fn:function() { this.refresh(); },scope:this}
                ,hide: {fn:function() {this.getEl().remove()}}
            }
        });

        this.windows.createOrderPropertiesGroup.fp.getForm().reset().setValues({
            sort : 100
        });
        this.windows.createOrderPropertiesGroup.show(e.target);
    }

    ,updateOrderPropertiesGroups: function(btn,e,row) {
        if (typeof(row) != 'undefined') {this.menu.record = row.data;}
        var id = this.menu.record.id;

        MODx.Ajax.request({
            url: miniShop2.config.connector_url
            ,params: {
                action: 'mgr/orders/properties/groups/get'
                ,id: id
            }
            ,listeners: {
                success: {fn:function(r) {
                    var w = Ext.getCmp('minishop2-window-order-properties-group-update');
                    if (w) {w.hide().getEl().remove();}

                    w = MODx.load({
                        xtype: 'minishop2-window-order-properties-group-update'
                        ,id: 'minishop2-window-order-properties-group-update'
                        ,record:r.object
                        ,fields: this.getOrderProperiesGroupFields('update', {})
                        ,listeners: {
                            success: {fn:function() {this.refresh();},scope:this}
                            ,hide: {fn: function() {
                                if (miniShop2.grid.OrderPropertiesGroups.changed === true) {
                                    Ext.getCmp('minishop2-grid-order-properties-groups').getStore().reload();
                                    miniShop2.grid.OrderPropertiesGroups.changed = false;
                                }
                                this.getEl().remove();
                            }}
                        }
                    });

                    w.fp.getForm().reset();
                    w.fp.getForm().setValues(r.object);
                    w.show(e.target,function() {w.setPosition(null,100)},this);
                },scope:this}
            }
        });
    }

    ,removeOrderPropertiesGroups: function(btn,e) {
        if (!this.menu.record) return false;

        MODx.msg.confirm({
            title: _('ms2_menu_remove') + '"' + this.menu.record.name + '"'
            ,text: _('ms2_menu_remove_confirm')
            ,url: this.config.url
            ,params: {
                action: 'mgr/orders/properties/groups/remove'
                ,id: this.menu.record.id
            }
            ,listeners: {
                success: {fn:function(r) {this.refresh();}, scope:this}
            }
        });
    }

    ,getOrderProperiesGroupFields: function(type) {
        var fields = [];
        fields.push({xtype: 'hidden',name: 'id', id: 'minishop2-order-properties-group-id-'+type}
            ,{xtype: 'textfield',fieldLabel: _('ms2_order_properties_groups_name'), name: 'name', allowBlank: false, anchor: '99%', id: 'minishop2-order-properties-group-name-'+type}
            ,{xtype: 'minishop2-combo-person-type',fieldLabel: _('ms2_order_properties_groups_person_type_id'), name: 'person_type_id', allowBlank: false, anchor: '99%', id: 'minishop2-order-properties-group-person_type_id-'+type}
            ,{xtype: 'numberfield',fieldLabel: _('ms2_order_properties_sort'), name: 'sort', allowBlank: false, defaultValue:100, anchor: '99%', id: 'minishop2-order-properties-group-sort-'+type}
        );
        return fields;
    }
});
Ext.reg('minishop2-grid-order-properties-groups',miniShop2.grid.OrderPropertiesGroups);



miniShop2.window.createOrderPropertiesGroup = function(config) {
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
        ,action: 'mgr/orders/properties/groups/create'
        ,fields: config.fields
        ,keys: [{key: Ext.EventObject.ENTER,shift: true,fn: function() {this.submit() },scope: this}]
    });
    miniShop2.window.createOrderPropertiesGroup.superclass.constructor.call(this,config);
};
Ext.extend(miniShop2.window.createOrderPropertiesGroup,MODx.Window);
Ext.reg('minishop2-window-order-properties-group-create',miniShop2.window.createOrderPropertiesGroup);

miniShop2.window.UpdateOrderPropertiesGroup = function(config) {
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
        ,action: 'mgr/orders/properties/groups/update'
        ,fields: config.fields
        ,keys: [{key: Ext.EventObject.ENTER,shift: true,fn: function() {this.submit() },scope: this}]
    });
    miniShop2.window.UpdateOrderPropertiesGroup.superclass.constructor.call(this,config);
};
Ext.extend(miniShop2.window.UpdateOrderPropertiesGroup,MODx.Window);
Ext.reg('minishop2-window-order-properties-group-update',miniShop2.window.UpdateOrderPropertiesGroup);