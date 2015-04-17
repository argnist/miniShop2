miniShop2.grid.PersonTypes = function(config) {
    config = config || {};

    Ext.applyIf(config,{
        id: 'minishop2-grid-person-types'
        ,url: miniShop2.config.connector_url
        ,baseParams: {
            action: 'mgr/settings/person-types/getlist'
        }
        ,fields: ['id','name','active','sort']
        ,autoHeight: true
        ,paging: true
        ,remoteSort: true
        ,save_action: 'mgr/settings/person-types/updatefromgrid'
        ,autosave: true
        ,columns: [
            {header: _('ms2_id'),dataIndex: 'id',width: 50}
            ,{header: _('ms2_name'),dataIndex: 'name',width: 100, editor: {xtype: 'textfield', allowBlank: false}}
            ,{header: _('ms2_activity'),dataIndex: 'active',width: 100, editor: {xtype: 'combo-boolean', renderer: 'boolean'}}
            ,{header: _('ms2_sort'),dataIndex: 'sort',width: 100, editor: {xtype: 'textfield', allowBlank: false}}
        ]
        ,tbar: [{
            text: _('ms2_btn_create')
            ,handler: this.createPersonType
            ,scope: this
        }]
    });
    miniShop2.grid.PersonTypes.superclass.constructor.call(this,config);
};
Ext.extend(miniShop2.grid.PersonTypes,MODx.grid.Grid,{
    windows: {}

    ,getMenu: function() {
        var m = [];
        m.push({
            text: _('ms2_menu_update')
            ,handler: this.updatePersonType
        });
        m.push('-');
        m.push({
            text: _('ms2_menu_remove')
            ,handler: this.removePersonType
        });
        this.addContextMenuItem(m);
    }

    ,createPersonType: function(btn,e) {
        var w = Ext.getCmp('minishop2-window-person-type-create');
        if (w) {w.hide().getEl().remove();}

        this.windows.createPersonType= MODx.load({
            xtype: 'minishop2-window-person-type-create'
            ,id: 'minishop2-window-person-type-create'
            ,fields: this.getPersonTypeFields('create', {})
            ,listeners: {
                success: {fn:function() { this.refresh(); },scope:this}
                ,hide: {fn:function() {this.getEl().remove()}}
            }
        });

        this.windows.createPersonType.fp.getForm().reset().setValues({
            sort : 100
        });
        this.windows.createPersonType.show(e.target);
    }


    ,updatePersonType: function(btn,e) {
        if (!this.menu.record || !this.menu.record.id) return false;
        var r = this.menu.record;

        var w = Ext.getCmp('minishop2-window-person-type-update');
        if (w) {w.hide().getEl().remove();}
        //if (!this.windows.updateDelivery) {
        this.windows.updatePersonType = MODx.load({
            xtype: 'minishop2-window-person-type-update'
            ,id: 'minishop2-window-person-type-update'
            ,record: r
            ,fields: this.getPersonTypeFields('update', r)
            ,listeners: {
                success: {fn:function() {this.refresh();},scope:this}
                ,hide: {fn:function() {this.getEl().remove()}}
            }
        });
        //}
        this.windows.updatePersonType.fp.getForm().reset();
        this.windows.updatePersonType.fp.getForm().setValues(r);
        this.windows.updatePersonType.show(e.target);

    }


    ,removePersonType: function(btn,e) {
        if (!this.menu.record) return false;

        MODx.msg.confirm({
            title: _('ms2_menu_remove') + '"' + this.menu.record.name + '"'
            ,text: _('ms2_menu_remove_confirm')
            ,url: this.config.url
            ,params: {
                action: 'mgr/settings/person-types/remove'
                ,id: this.menu.record.id
            }
            ,listeners: {
                success: {fn:function(r) {this.refresh();}, scope:this}
            }
        });
    }

    ,getPersonTypeFields: function(type) {
        var fields = [];
        fields.push({xtype: 'hidden',name: 'id', id: 'minishop2-person-type-id-'+type}
            ,{xtype: 'textfield',fieldLabel: _('ms2_name'), name: 'name', allowBlank: false, anchor: '99%', id: 'minishop2-person-type-name-'+type}
            ,{xtype: 'xcheckbox',fieldLabel: _('ms2_activity'), name: 'active', allowBlank: true, anchor: '99%', id: 'minishop2-person-type-activity-'+type}
            ,{xtype: 'numberfield',fieldLabel: _('ms2_sort'), name: 'sort', allowBlank: false, defaultValue:100, anchor: '99%', id: 'minishop2-person-type-sort-'+type}
        );
        return fields;
    }
});
Ext.reg('minishop2-grid-person-types',miniShop2.grid.PersonTypes);

miniShop2.window.createPersonType = function(config) {
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
        ,action: 'mgr/settings/person-types/create'
        ,fields: config.fields
        ,keys: [{key: Ext.EventObject.ENTER,shift: true,fn: function() {this.submit() },scope: this}]
    });
    miniShop2.window.createPersonType.superclass.constructor.call(this,config);
};
Ext.extend(miniShop2.window.createPersonType,MODx.Window);
Ext.reg('minishop2-window-person-type-create',miniShop2.window.createPersonType);

miniShop2.window.UpdatePersonType = function(config) {
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
        ,action: 'mgr/settings/person-types/update'
        ,fields: config.fields
        ,keys: [{key: Ext.EventObject.ENTER,shift: true,fn: function() {this.submit() },scope: this}]
    });
    miniShop2.window.UpdatePersonType.superclass.constructor.call(this,config);
};
Ext.extend(miniShop2.window.UpdatePersonType,MODx.Window);
Ext.reg('minishop2-window-person-type-update',miniShop2.window.UpdatePersonType);