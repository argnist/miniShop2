miniShop2.grid.SKU = function(config) {
    config = config || {};

    this.sm = new Ext.grid.CheckboxSelectionModel();

    Ext.applyIf(config,{
        id: 'minishop2-grid-sku'
        ,url: miniShop2.config.connector_url
        ,baseParams: {
            action: 'mgr/product/sku/getlist'
            ,product: config.record.id
        }
        ,sm: this.sm
        ,fields: this.getFields()
        ,autoHeight: true
        ,paging: true
        ,remoteSort: true
        ,columns: this.getColumns(config)
        ,tbar: [{
            text: _('ms2_btn_create')
            ,handler: this.createSKU
            ,scope: this
        }]
    });
    miniShop2.grid.SKU.superclass.constructor.call(this,config);
};
Ext.extend(miniShop2.grid.SKU,MODx.grid.Grid, {

    getMenu: function() {
        var m = [];
        m.push({
            text: _('ms2_menu_remove')
            ,handler: this.removeSKU
        });
        this.addContextMenuItem(m);
    }

    ,getFields: function(config) {
        return miniShop2.config.data_fields;
    }

    ,getColumns: function() {
        var columnsConfig =  {
            article: {width:50, sortable:true, editor:{xtype:'textfield'}}
            ,name: {width:50, sortable:true, editor:{xtype:'textfield'}}
            ,price: {width:50, sortable:true, editor:{xtype:'numberfield', decimalPrecision: 2}}
            ,old_price: {width:50, sortable:true, editor:{xtype:'numberfield', decimalPrecision: 2}}
            ,weight: {width:50, sortable:true, editor:{xtype:'numberfield', decimalPrecision: 3}}
            ,image: {width:50, sortable:false, renderer: this.renderThumb}
            ,thumb: {width:50, sortable:false, renderer: this.renderThumb}
            ,vendor: {width:50, sortable:true, renderer: this.renderVendor, editor: {xtype: 'minishop2-combo-vendor'}}
            ,made_in: {width:50, sortable:true, editor: {xtype: 'minishop2-combo-autocomplete', name: 'made_in'}}
            ,color: {width:50, sortable:false, renderer: this.renderColor}
            ,size: {width:50, sortable:false, renderer: this.renderSize}
            ,new: {width:50, sortable:true, editor:{xtype:'combo-boolean', renderer:'boolean'}}
            ,favorite: {width:50, sortable:true, editor:{xtype:'combo-boolean', renderer:'boolean'}}
            ,popular: {width:50, sortable:true, editor:{xtype:'combo-boolean', renderer:'boolean'}}
        };

        for (i in miniShop2.plugin) {
            if (typeof(miniShop2.plugin[i]['getColumns']) == 'function') {
                var add = miniShop2.plugin[i].getColumns();
                Ext.apply(columns, add);
            }
        }

        var columns = [this.sm];
        var fields = miniShop2.config.data_fields;
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            if (columnsConfig[field] && miniShop2.config.active_fields.indexOf(field) !== -1) {
                Ext.applyIf(columnsConfig[field], {
                    header: _('ms2_product_' + field)
                    ,dataIndex: field
                });
                columns.push(columnsConfig[field]);
            }
        }
        return columns;
    }

    ,createSKU: function(btn,e) {
        var w = Ext.getCmp('minishop2-window-product-sku-create');
        if (w) {w.hide().getEl().remove();}

        this.windows.createSKU = MODx.load({
            xtype: 'minishop2-window-product-sku-create'
            ,id: 'minishop2-window-product-sku-create'
            ,fields: this.getSKUFields('create')
            ,listeners: {
                success: {fn:function() { this.refresh(); },scope:this}
            }
        });
        this.windows.createSKU.show(e.target);
    }

    ,getSKUFields: function(type) {
        return [
            {xtype: 'textfield',fieldLabel: _('ms2_product_article'), name: 'article', anchor: '99%', id: 'minishop2-sku-article-'+type}
            ,{xtype: 'textfield',fieldLabel: _('ms2_product_sku_name'), name: 'sku_name', anchor: '99%', id: 'minishop2-sku-name-'+type}
            ,{xtype: 'numberfield',fieldLabel: _('ms2_product_price'), name: 'price', decimalPrecision: 2, anchor: '99%', id: 'minishop2-sku-price-'+type}
            ,{xtype: 'numberfield',fieldLabel: _('ms2_product_old_price'), name: 'old_price', decimalPrecision: 2, anchor: '99%', id: 'minishop2-sku-old-price-'+type}
            ,{xtype: 'numberfield',fieldLabel: _('ms2_product_weight'), name: 'weight', decimalPrecision: 3, anchor: '99%', id: 'minishop2-sku-weight-'+type}
            ,{xtype: 'hidden', name: 'product_id', id: 'minishop2-sku-product-id-'+type, value: MODx.request.id}
        ];
    }

    ,article: {xtype: 'textfield'}
    ,price: {xtype: 'numberfield', decimalPrecision: 2, description: '<b>[[+price]]</b><br />'+_('ms2_product_price_help')}
    ,old_price: {xtype: 'numberfield', decimalPrecision: 2, description: '<b>[[+old_price]]</b><br />'+_('ms2_product_old_price_help')}
    ,weight: {xtype: 'numberfield', decimalPrecision: 3, description: '<b>[[+weight]]</b><br />'+_('ms2_product_weight_help')}

    ,removeSKU: function(btn,e) {
        if (this.menu.record) {
            MODx.msg.confirm({
                title: _('ms2_menu_remove')
                ,text: _('ms2_menu_remove_confirm')
                ,url: miniShop2.config.connector_url
                ,params: {
                    action: 'mgr/product/sku/remove'
                    ,id: this.menu.record.id
                }
                ,listeners: {
                    success: {fn:function(r) { this.refresh(); },scope:this}
                }
            });
        }
    }

    ,renderThumb: function(value) {
        if (value) {
            return '<img src="' + value + '" height="41" style="display:block;margin:auto;"/>';
        }
        else {
            return '';
        }
    }

    ,renderVendor: function(value, cell, row) {
        return row.data['vendor_name'];
    }

    ,renderColor: function(value, cell, row) {
        if (!row.data.color || row.data.color.length == 0) return '';
        return row.data.color.join(',');
    }

    ,renderSize: function(value, cell, row) {
        if (!row.data.size || row.data.size.length == 0) return '';
        return row.data.size.join(',');
    }
});
Ext.reg('minishop2-product-sku-grid',miniShop2.grid.SKU);


miniShop2.window.CreateSKU = function(config) {
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
        ,action: 'mgr/product/sku/create'
        ,fields: config.fields
        ,keys: [{key: Ext.EventObject.ENTER,shift: true,fn: function() {this.submit() },scope: this}]
    });
    miniShop2.window.CreateSKU.superclass.constructor.call(this,config);
};
Ext.extend(miniShop2.window.CreateSKU,MODx.Window);
Ext.reg('minishop2-window-product-sku-create',miniShop2.window.CreateSKU);