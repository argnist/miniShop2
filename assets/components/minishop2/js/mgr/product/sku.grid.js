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
        ,stateful: true
        ,stateId: 'minishop2-grid-sku-state-'+MODx.request.id
        ,tbar: [{
            text: _('ms2_btn_create')
            ,handler: this.createSKU
            ,scope: this
        },{
            text: _('ms2_btn_generateSKU')
            ,handler: this.generateSKU
            ,scope: this
        }]
    });
    miniShop2.grid.SKU.superclass.constructor.call(this,config);
};
Ext.extend(miniShop2.grid.SKU,MODx.grid.Grid, {

    getMenu: function() {
        var m = [];
        m.push({
            text: _('ms2_menu_update')
            ,handler: this.updateSKU
        });
        m.push({
            text: _('ms2_menu_remove')
            ,handler: this.removeSKU
        });
        this.addContextMenuItem(m);
    }

    ,getFields: function(config) {
        var fields = miniShop2.config.data_fields;
        for (var i=0; i<miniShop2.config.option_fields.length; i++) {
            fields.push(miniShop2.config.option_fields[i]['key']);
        }
        return fields;
    }

    ,getColumns: function() {
        var columnsConfig =  {
            article: {width:50, sortable:true, editor:{xtype:'textfield'}}
            ,sku_name: {width:50, sortable:true, editor:{xtype:'textfield'}}
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
                Ext.apply(columnsConfig, add);
            }
        }

        var optionColumns = [];
        for (var i=0; i<miniShop2.config.option_fields.length; i++) {
            var field = miniShop2.config.option_fields[i];
            var add = {
                dataIndex: field['key'],
                header: field['caption'],
                width: 50,
                sortable: true,
                hidden: true
            };
            optionColumns.push(add);
        }

        var columns = [this.sm];
        var fields = miniShop2.config.sku_grid_fields;
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            if (columnsConfig[field]) {
                Ext.applyIf(columnsConfig[field], {
                    header: _('ms2_product_' + field)
                    ,dataIndex: field
                });
                columns.push(columnsConfig[field]);
            }
        }
        columns = columns.concat(optionColumns);

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
        this.windows.createSKU.setValues({'sku_name': Ext.getCmp('modx-resource-pagetitle').getValue()});
        this.windows.createSKU.show(e.target);
    }

    ,updateSKU: function(btn,e) {
        var w = Ext.getCmp('minishop2-window-product-sku-update');
        if (w) {w.hide().getEl().remove();}
        if (!this.menu.record || !this.menu.record.id) return false;
        var r = this.menu.record;

        this.windows.updateSKU = MODx.load({
            xtype: 'minishop2-window-product-sku-update'
            ,id: 'minishop2-window-product-sku-update'
            ,fields: this.getSKUFields('update')
            ,record: r
            ,listeners: {
                success: {fn:function() { this.refresh(); },scope:this}
            }
        });
        this.windows.updateSKU.fp.getForm().reset();
        this.windows.updateSKU.fp.getForm().setValues(r);
        this.windows.updateSKU.show(e.target);
    }

    /*,prepareFormField: function(type, fieldName, product_fields) {
        return this.panel.getExtField(this.panel.config, fieldName, Ext.apply(product_fields[fieldName], {id:'minishop2-sku-'+fieldName+'-'+type}))
    }*/

    ,getSKUFields: function(type) {
        var panel = Ext.getCmp('minishop2-product-settings-panel');
        var product_fields = panel.getAllProductFields(panel.config);
        product_fields['id'] = {xtype: 'hidden'};
        product_fields['product_id'] = {xtype: 'hidden', value:MODx.request.id};
        product_fields['sku_name'] = {xtype: 'textfield',fieldLabel: _('ms2_product_sku_name'),description:_('ms2_product_sku_name'),maxLength: 255,allowBlank: false};
        var data_fields = miniShop2.config.data_fields;

        var fields = [];
        for (var i = 0; i < data_fields.length; i++) {
            var field = data_fields[i];
            if (tmp = product_fields[field]) {
                if (tmp.xtype == 'minishop2-combo-options') {
                    tmp.xtype = 'minishop2-combo-autocomplete';
                    tmp.value = '';
                }
                tmp = panel.getExtField(panel.config, field, tmp);
                tmp.id += '-sku-'+type;
                fields.push(tmp);
            }
        }

        var optionFields = panel.getOptionFields(panel.config);
        for (var i=0; i<optionFields.length; i++) {
            optionFields[i].id += '-sku-'+type;
        }
        return [{
            layout: 'form',
            items: fields
        }, {
            xtype: 'fieldset'
            ,title: _('ms2_product_tv')
            ,border: false
            ,defaults: {border: false}
            ,items: optionFields
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

    ,generateSKU: function(btn,e) {
        var w = Ext.getCmp('minishop2-window-product-sku-generate');
        if (w) {w.hide().getEl().remove();}

        this.vcb = new Ext.ux.grid.CheckColumn({
            header: _('checked')
            ,dataIndex: 'checked'
            ,width: 40
            ,sortable: false
        });

        this.sm = new Ext.grid.CheckboxSelectionModel({width:50,singleSelect:false});

        var fields = [];//this.getSKUFields('create');
        fields.push({
            xtype:'modx-grid-local'
            ,id: 'minishop2-grid-sku-generate-fields'
            ,sm: this.sm
            ,fields: ['value','checked','option','rank']
            ,data:this.getGenerateData()
            ,autoHeight: true
            ,grouping: true
            ,groupBy: 'option'
            ,groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "'+_('ms2_values')+'" : "'+_('ms2_value')+'"]})'
            ,hideGroupedColumn: true
            ,plugins: [Ext.ux.grid.plugins.GroupCheckboxSelection]
            ,stateful: false
            ,remoteSort: false
            ,sortBy: 'rank'
            ,sortDir: 'ASC'
            ,layout: 'anchor'
            ,anchor: '100%'
            ,viewConfig: {
                forceFit:true
                ,enableRowBody:true
                ,scrollOffset: 0
                ,autoFill: true
            }
            ,columns:[{
                header: _('value'),dataIndex: 'value'
            },this.sm,{
                header: _('option'),dataIndex: 'option',
                groupRenderer: function(field) {
                    var group = _("ms2_product_"+field);
                    if (!group) {
                        var fields = miniShop2.config.option_fields;
                        for (var i=0; i<fields.length; i++) {
                            if (fields[i]['key'] == field) {
                                return fields[i]['caption'];
                            }
                        }
                    }
                    return group;
                }
            }]
            ,listeners: {
                viewready: function() {
                    this.getSelectionModel().selectAll();
                    var a = Ext.query('#minishop2-grid-sku-generate-fields .x-grid3-hd-checker:has(.x-grid3-hd-checker)');
                    Ext.each(a, function(item){
                        Ext.fly(item).addClass('x-grid3-hd-checker-on');
                    });
                }
            }
        });
        this.windows.generateSKU = MODx.load({
            xtype: 'minishop2-window-product-sku-generate'
            ,id: 'minishop2-window-product-sku-generate'
            ,fields: fields
            ,listeners: {
                success: {fn:function() { this.refresh(); },scope:this}
                ,beforeSubmit: function(o,a,b,c) {
                    Ext.apply(this.fp.baseParams,{
                        fields: Ext.getCmp('minishop2-grid-sku-generate-fields').encode()
                    });
                }
            }
        });
        this.windows.generateSKU.show(e.target);
    }

    ,getGenerateData: function() {
        var data = [];
        for (var field in this.record) {
            if (typeof(this.record[field]) == 'object' && this.record[field] && this.record[field] instanceof Array
                && this.record[field].length > 0) {
                for (var i = 0; i < this.record[field].length; i++) {
                    if (typeof(this.record[field][i]) == 'object') {
                        if (typeof(this.record[field][i])['value'] != 'undefined') {
                            data.push([this.record[field][i]['value'], true, field,i]);
                        }
                    } else {
                        data.push([this.record[field][i], true, field,i]);
                    }
                }
            }
        }
        return data;
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
        title: _('ms2_menu_create')
        ,width: 600
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


miniShop2.window.UpdateSKU = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('ms2_menu_update')
        ,width: 600
        ,labelAlign: 'left'
        ,labelWidth: 180
        ,url: miniShop2.config.connector_url
        ,action: 'mgr/product/sku/update'
        ,fields: config.fields
        ,keys: [{key: Ext.EventObject.ENTER,shift: true,fn: function() {this.submit() },scope: this}]
    });
    miniShop2.window.UpdateSKU.superclass.constructor.call(this,config);
};

Ext.extend(miniShop2.window.UpdateSKU,MODx.Window);
Ext.reg('minishop2-window-product-sku-update',miniShop2.window.UpdateSKU);

miniShop2.window.GenerateSKU = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('ms2_sku_generate')
        ,width: 600
        ,labelAlign: 'left'
        ,labelWidth: 180
        ,url: miniShop2.config.connector_url
        ,action: 'mgr/product/sku/generate'
        ,fields: config.fields
        ,keys: [{key: Ext.EventObject.ENTER,shift: true,fn: function() {this.submit() },scope: this}]
    });
    miniShop2.window.GenerateSKU.superclass.constructor.call(this,config);
};
Ext.extend(miniShop2.window.GenerateSKU,MODx.Window);
Ext.reg('minishop2-window-product-sku-generate',miniShop2.window.GenerateSKU);

/*miniShop2.grid.SKUFields = function(config) {
    config = config || {};
    this.vcb = new Ext.ux.grid.CheckColumn({
        header: _('visible')
        ,dataIndex: 'visible'
        ,width: 40
        ,sortable: false
    });
    Ext.applyIf(config,{
        id: 'modx-grid-fc-set-fields'
        ,fields: ['id','action','name','tab','tab_rank','other','rank','visible','label','default_value']
        ,autoHeight: true
        ,grouping: true
        ,groupBy: 'tab'
        ,plugins: [this.vcb]
        ,stateful: false
        ,remoteSort: false
        ,sortBy: 'rank'
        ,sortDir: 'ASC'
        ,hideGroupedColumn: true
        ,groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "'+_('fields')+'" : "'+_('field')+'"]})'
        ,columns: [{
            header: _('name')
            ,dataIndex: 'name'
            ,width: 200
        },{
            header: _('region')
            ,dataIndex: 'tab'
            ,width: 100
        },this.vcb,{
            header: _('label')
            ,dataIndex: 'label'
            ,editor: { xtype: 'textfield' }
            ,renderer: function(v,md) {
                return Ext.util.Format.htmlEncode(v);
            }
        },{
            header: _('default_value')
            ,dataIndex: 'default_value'
            ,editor: { xtype: 'textfield' }
            ,renderer: function(v,md) {
                return Ext.util.Format.htmlEncode(v);
            }
        }]
        ,viewConfig: {
            forceFit:true
            ,enableRowBody:true
            ,scrollOffset: 0
            ,autoFill: true
            ,showPreview: true
            ,getRowClass : function(rec, ri, p){
                return rec.data.visible ? 'grid-row-active' : 'grid-row-inactive';
            }
        }
    });
    miniShop2.grid.SKUFields.superclass.constructor.call(this,config);
    this.propRecord = Ext.data.Record.create(config.fields);
};
Ext.extend(miniShop2.grid.SKUFields,MODx.grid.LocalGrid);
Ext.reg('minishop2-grid-sku-fields',miniShop2.grid.SKUFields);
*/