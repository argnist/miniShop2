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
            ,height: 200
            ,autoScroll: true
            ,listeners: {
                success: {fn:function() { this.refresh(); },scope:this}
            }
        });
        this.windows.createSKU.show(e.target);
    }

    ,getSKUFields: function(type) {
        var panel = Ext.getCmp('minishop2-product-settings-panel');
        var product_fields = panel.getAllProductFields(panel.config);
        product_fields['product_id'] = {xtype: 'hidden', value:MODx.request.id};
        //product_fields['name'] = {xtype: 'textfield',fieldLabel: _('ms2_product_sku_name'),description:_('ms2_product_sku_name'),maxLength: 255,allowBlank: false};
        var data_fields = miniShop2.config.data_fields;
        var fields = [];
        for (var i = 0; i < data_fields.length; i++) {
            var field = data_fields[i];
            if (tmp = product_fields[field]) {
                tmp = panel.getExtField(panel.config, field, tmp);
                tmp.id += '-sku-'+type;
                fields.push(tmp);
            }
        }

       /* var main_fields = miniShop2.config.main_fields.filter(function(n) {
            return miniShop2.config.data_fields.indexOf(n) != -1
        });

        if (main_fields.length > 0) {
            var array = {
                layout:'column'
                ,xtype: 'fieldset'
                ,title: _('ms2_product')
                ,border: false
                ,defaults: {border: false}
                ,items: [{
                    columnWidth: .5
                    ,layout: 'form'
                    ,items: []
                },{
                    columnWidth: .5
                    ,layout: 'form'
                    ,items: []
                }]
            };

            var middle = Math.ceil(main_fields.length / 2) - 1;
            for (var i=0; i < main_fields.length; i++) {
                var tmp = product_fields[main_fields[i]]
                var field = panel.getExtField(panel.config, main_fields[i], tmp);
                field.anchor = '100%';
                if (i > middle) {
                    array.items[1].items.push(field);
                }
                else {
                    array.items[0].items.push(field);
                }
            }

            fields.push(array);
        }*/

        return [{
            layout: 'form',
            items: [
                panel.getExtField(panel.config, 'name',{xtype: 'textfield',fieldLabel: _('ms2_product_sku_name'),description:_('ms2_product_sku_name'),maxLength: 255,allowBlank: false})
            ]
        }, {
            layout: 'form',
            items: fields
        }];
    }

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
    Ext.applyIf(config,{
        title: _('ms2_menu_update')
        ,width: 600
        ,height:400,minHeight:400,maxHeight:400
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