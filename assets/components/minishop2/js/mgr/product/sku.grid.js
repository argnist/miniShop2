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
        if (type == 'update') {
            product_fields['id'] = {xtype: 'hidden'};
        }
        product_fields['product_id'] = {xtype: 'hidden', value:MODx.request.id};
        var sku_name = {
            layout:'column'
            ,items: [{
                columnWidth: 0.7
                ,layout:'form'
                ,labelAlign: 'top'
                ,items: [{
                    xtype: 'textfield'
                    ,fieldLabel: _('ms2_product_sku_name')
                    ,description:_('ms2_product_sku_name')
                    ,maxLength: 255
                    ,allowBlank: false
                    ,width: '100%'
                    ,id: 'modx-resource-sku_name-'+type
                    ,name: 'sku_name'
                }]
            },{
                columnWidth: 0.2
                ,items: [{
                    xtype: 'button'
                    ,text: '<i class="'+ (MODx.modx23 ? 'icon icon-list' : 'bicon-list') + '"></i> ' + _('ms2_btn_options')
                    ,id: 'modx-resource-sku_name-button'+type
                    ,style: {
                        margin: '20px 0 0 20px'
                    }
                    ,menu: this.getSKUBtnFields('modx-resource-sku_name-'+type)
                }]
            }]
        };
        var data_fields = miniShop2.config.data_fields;

        var fields = [];
        for (var i = 0; i < data_fields.length; i++) {
            var field = data_fields[i];
            if (this.isMultipleField(field) && type == 'generate') continue;

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

        fields.unshift(sku_name);

        var allOptionFields = panel.getOptionFields(panel.config);
        var optionFields = [];
        for (var i=0; i<allOptionFields.length; i++) {
            if (this.isMultipleField(allOptionFields[i].name) && type == 'generate') continue;
            allOptionFields[i].id += '-sku-'+type;

            if (allOptionFields[i].xtype == 'minishop2-combo-options') {
                var values = [];
                for (var j= 0, len=allOptionFields[i].value.length; j<len; j++) {
                    values.push([allOptionFields[i].value[j].value]);
                }

                Ext.apply(allOptionFields[i], {
                    xtype: 'modx-combo'
                    ,store: new Ext.data.SimpleStore({
                        fields: ['value']
                        ,data: values
                    })
                    ,displayField: 'value'
                    ,valueField: 'value'
                    ,value: ''
                });

            }
            optionFields.push(allOptionFields[i]);
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

    ,isMultipleField: function(field) {
        return (typeof(this.record[field]) == 'object' && this.record[field] &&
           this.record[field] instanceof Array && this.record[field].length > 0);
    }

    ,getSKUBtnFields: function(field) {
        var fields = [];
        var data = miniShop2.config.data_fields;
        var data_exclude = ["product_id","sku","sku_name","price","old_price","image","thumb","new","popular","favorite","source"];

        top:
        for (var i=0, len = data.length; i<len; i++ ) {
            for (var j=0, len2 = data_exclude.length; j<len2; j++) {
                if (data_exclude[j] == data[i]) continue top;
            }
            var text = _('ms2_product_'+data[i]);
            if (!text) {
                text = this.getOptCaption(data[i]);
            }
            fields.push({text: text, dataField: data[i], targetField: field, handler: this.editName, scope: this})
        }
        fields.unshift({text: _('pagetitle'), dataField: 'pagetitle', targetField: field, handler: this.editName, scope: this});

        return fields;
    }

    ,editName: function(btn) {
        var field = Ext.getCmp(btn.targetField);
        var value = field.getValue();
        if (value.length > 0) {
            value += ' ';
        }
        value += "{=" + btn.dataField + "}";
        field.setValue(value);
        field.setCursorPosition(value.length);
    }

    ,getOptCaption: function(field) {
        var opts = miniShop2.config.option_fields;
        for (var i= 0, len = opts.length; i<len; i++) {
            if (opts[i]['key'] == field) {
                return opts[i]['caption'];
            }
        }
        return '';
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

        this.sm = new Ext.grid.CheckboxSelectionModel({width:50,singleSelect:false});

        var fields = this.getSKUFields('generate');
        fields.push({
            xtype:'modx-grid-local'
            ,id: 'minishop2-grid-sku-generate-fields'
            ,sm: this.sm
            ,fields: ['value','option','rank']
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
                    var group = _("ms2_product_" + field);
                    if (!group) {
                        group = this.getOptCaption(field);
                    }
                    return group;
                },scope:this
            }]
            ,listeners: {
                viewready: function() {
                    this.getSelectionModel().selectAll();
                    var a = Ext.query('#minishop2-grid-sku-generate-fields .x-grid3-hd-checker:has(.x-grid3-hd-checker)');
                    Ext.each(a, function(item){
                        Ext.fly(item).addClass('x-grid3-hd-checker-on');
                    });
                }
                ,rowcontextmenu: function() { return false; }
            }
        });
        this.windows.generateSKU = MODx.load({
            xtype: 'minishop2-window-product-sku-generate'
            ,id: 'minishop2-window-product-sku-generate'
            ,fields: fields
            ,listeners: {
                success: {fn:function() { this.refresh(); },scope:this}
                ,beforeSubmit: function(o,a,b,c) {
                    var rs = {};
                    var sel = Ext.getCmp('minishop2-grid-sku-generate-fields').getSelectionModel().getSelections();
                    for (var i=0;i<sel.length;i++) {
                        var data = sel[i].data;
                        if (!rs[data['option']]) {
                            rs[data['option']] = [];
                        }
                        rs[data['option']].push(data['value']);
                    }
                    Ext.apply(this.fp.baseParams,{
                        fields: Ext.encode(rs)
                    });
                }
            }
        });
        this.windows.generateSKU.show(e.target);
    }

    ,getGenerateData: function() {
        var data = [];
        for (var field in this.record) {
            if (this.isMultipleField(field)) {
                for (var i = 0; i < this.record[field].length; i++) {
                    if (typeof(this.record[field][i]) == 'object') { // стандартное поле
                        if (typeof(this.record[field][i])['value'] != 'undefined') {
                            data.push([this.record[field][i]['value'], field, i]); // value, option, rank
                        }
                    } else { // опция
                        data.push([this.record[field][i], field, i]);// value, option, rank
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
        ,width: '50%'
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
