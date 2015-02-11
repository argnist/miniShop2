miniShop2.grid.Characteristic = function(config) {
	config = config || {};

	this.exp = new Ext.grid.RowExpander({
		expandOnDblClick: false
		,tpl : new Ext.Template('<p class="desc">{description}</p>')
		,renderer : function(v, p, record){return record.data.description != '' && record.data.description != null ? '<div class="x-grid3-row-expander">&#160;</div>' : '&#160;';}
	});

	this.dd = function(grid) {
		this.dropTarget = new Ext.dd.DropTarget(grid.container, {
			ddGroup : 'dd',
			copy:false,
			notifyDrop : function(dd, e, data) {
				var store = grid.store.data.items;
				var target = store[dd.getDragData(e).rowIndex].id;
				var source = store[data.rowIndex].id;
				if (target != source) {
					dd.el.mask(_('loading'),'x-mask-loading');
					MODx.Ajax.request({
						url: miniShop2.config.connector_url
						,params: {
							action: config.action || 'mgr/settings/status/sort'
							,source: source
							,target: target
						}
						,listeners: {
							success: {fn:function(r) {dd.el.unmask();grid.refresh();},scope:grid}
							,failure: {fn:function(r) {dd.el.unmask();},scope:grid}
						}
					});
				}
			}
		});
	};

	Ext.applyIf(config,{
		id: 'minishop2-grid-characteristic'
		,url: miniShop2.config.connector_url
		,baseParams: {
			action: 'mgr/settings/characteristic/getlist'
		}
		,fields: ['id','key','name','type','rank','active','allowblank']
		,autoHeight: true
		,paging: true
		,remoteSort: true
		,save_action: 'mgr/settings/characteristic/updatefromgrid'
		,autosave: true
		,plugins: this.exp
		,columns: [this.exp
			,{header: _('ms2_id'),dataIndex: 'id',width: 50, sortable: true}
			,{header: _('ms2_key'),dataIndex: 'key',width: 75, editor: {xtype: 'textfield', allowBlank: false}, sortable: true}
			,{header: _('ms2_name'),dataIndex: 'name',width: 150, editor: {xtype: 'textfield', allowBlank: false}, sortable: true}
			,{header: _('ms2_type'),dataIndex: 'type',width: 100, renderer: this.renderType}
			,{header: _('ms2_active'),dataIndex: 'active',width: 50, editor: {xtype: 'combo-boolean', renderer: 'boolean'}}
			,{header: _('ms2_required'),dataIndex: 'required',width: 50, editor: {xtype: 'combo-boolean', renderer: 'boolean'}}

		]
		,tbar: [{
			text: _('ms2_btn_create')
			,handler: this.createCharacteristic
			,scope: this
		},{
			text: _('ms2_btn_copy')
			,handler: this.copyCharacteristic
			,scope: this
		},'->',{
			xtype: 'textfield'
			,name: 'query'
			,width: 200
			,id: 'minishop2-characteristics-search'
			,emptyText: _('ms2_search')
			,listeners: {
				render: {fn:function(tf) {tf.getEl().addKeyListener(Ext.EventObject.ENTER,function() {this.FilterByQuery(tf);},this);},scope:this}
			}
		},{
			xtype: 'button'
			,id: 'minishop2-characteristics-clear'
			,text: '<i class="'+ (MODx.modx23 ? 'icon icon-times' : 'bicon-remove-sign') + '"></i>'/* + _('ms2_search_clear')*/
			,listeners: {
				click: {fn: this.clearFilter, scope: this}
			}
		}]
		,ddGroup: 'dd'
		,enableDragDrop: true
		,listeners: {render: {fn: this.dd, scope: this}}
	});
	miniShop2.grid.Characteristic.superclass.constructor.call(this,config);
};
Ext.extend(miniShop2.grid.Characteristic,MODx.grid.Grid,{
	windows: {}

	,getMenu: function() {
		var m = [];
		m.push({
			text: _('ms2_menu_update')
			,handler: this.updateCharacteristic
		});
		m.push('-');
		m.push({
			text: _('ms2_menu_remove')
			,handler: this.removeCharacteristic
		});
		this.addContextMenuItem(m);
	}

	,renderLogo: function(value) {
		if (/(jpg|png|gif|jpeg)$/i.test(value)) {
			if (!/^\//.test(value)) {value = '/' + value;}
			return '<img src="'+value+'" height="35" />';
		}
		else {
			return '';
		}
	}

	,renderType: function(value) {
		return _('ms2_characteristic_'+value);
	}

	,createCharacteristic: function(btn,e) {
		if (!this.windows.createCharacteristic) {
			this.windows.createCharacteristic = MODx.load({
				xtype: 'minishop2-window-characteristic-create'
				,fields: this.getCharacteristicFields('create')
				,listeners: {
					success: {fn:function() { this.refresh(); },scope:this}
				}
			});
		}
		this.windows.createCharacteristic.fp.getForm().reset();
		this.windows.createCharacteristic.show(e.target);
		Ext.getCmp('minishop2-characteristic-type_desc-create').getEl().dom.innerText = '';
	}

	,copyCharacteristic: function(btn,e){


	}

	,updateCharacteristic: function(btn,e) {
		if (!this.menu.record || !this.menu.record.id) return false;
		var r = this.menu.record;

		if (!this.windows.updateCharacteristic) {
			this.windows.updateCharacteristic = MODx.load({
				xtype: 'minishop2-window-characteristic-update'
				,record: r
				,fields: this.getCharacteristicFields('update')
				,listeners: {
					success: {fn:function() { this.refresh(); },scope:this}
				}
			});
		}
		this.windows.updateCharacteristic.fp.getForm().reset();
		this.windows.updateCharacteristic.fp.getForm().setValues(r);
		this.windows.updateCharacteristic.show(e.target);
		Ext.getCmp('minishop2-characteristic-type_desc-update').getEl().dom.innerText = r.type ? _('ms2_characteristic_'+r.type+'_desc') : '';
	}

	,removeCharacteristic: function(btn,e) {
		if (!this.menu.record) return false;

		MODx.msg.confirm({
			title: _('ms2_menu_remove') + '"' + this.menu.record.name + '"'
			,text: _('ms2_menu_remove_confirm')
			,url: this.config.url
			,params: {
				action: 'mgr/settings/characteristic/remove'
				,id: this.menu.record.id
			}
			,listeners: {
				success: {fn:function(r) {this.refresh();}, scope:this}
			}
		});
	}

	,getCharacteristicFields: function(type) {
		return [
			{xtype: 'hidden',name: 'id', id: 'minishop2-characteristic-id-'+type}
			,{xtype: 'textfield',fieldLabel: _('ms2_name'), name: 'name', allowBlank: false, anchor: '99%', id: 'minishop2-characteristic-name-'+type}
			,{xtype: 'minishop2-combo-characteristic-type',fieldLabel: _('ms2_type'), name: 'type', allowBlank: false, anchor: '99%', id: 'minishop2-characteristic-type-'+type
				,listeners: {
					select: function(combo,row,value) {
						Ext.getCmp('minishop2-characteristic-type_desc-'+type).getEl().dom.innerText = row.data.description;
					}
				}
				,disabled: type == 'update' ? 1 : 0
			}
			,{html: '',id: 'minishop2-characteristic-type_desc-'+type,
				style: 'font-style: italic; padding: 10px; color: #555555;'
			}
			,{xtype: 'textarea', fieldLabel: _('ms2_description'), name: 'description', anchor: '99%', id: 'minishop2-characteristic-description-'+type}
		];
	}

	,FilterByQuery: function(tf, nv, ov) {
		var s = this.getStore();
		s.baseParams.query = tf.getValue();
		this.getBottomToolbar().changePage(1);
		this.refresh();
	}

	,clearFilter: function(btn,e) {
		var s = this.getStore();
		s.baseParams.query = '';
		Ext.getCmp('minishop2-characteristics-search').setValue('');
		this.getBottomToolbar().changePage(1);
		this.refresh();
	}

});
Ext.reg('minishop2-grid-characteristic',miniShop2.grid.Characteristic);




miniShop2.window.CreateCharacteristic = function(config) {
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
		,action: 'mgr/settings/characteristic/create'
		,fields: config.fields
		,keys: [{key: Ext.EventObject.ENTER,shift: true,fn: function() {this.submit() },scope: this}]
	});
	miniShop2.window.CreateCharacteristic.superclass.constructor.call(this,config);
};
Ext.extend(miniShop2.window.CreateCharacteristic,MODx.Window);
Ext.reg('minishop2-window-characteristic-create',miniShop2.window.CreateCharacteristic);


miniShop2.window.UpdateCharacteristic = function(config) {
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
		,action: 'mgr/settings/characteristic/update'
		,fields: config.fields
		,keys: [{key: Ext.EventObject.ENTER,shift: true,fn: function() {this.submit() },scope: this}]
	});
	miniShop2.window.UpdateCharacteristic.superclass.constructor.call(this,config);
};
Ext.extend(miniShop2.window.UpdateCharacteristic,MODx.Window);
Ext.reg('minishop2-window-characteristic-update',miniShop2.window.UpdateCharacteristic);