miniShop2.page.OrderProperties = function(config) {
	config = config || {};
	Ext.applyIf(config,{
		components: [{
			xtype: 'minishop2-panel-order-properties'
			,renderTo: 'minishop2-panel-order-properties-div'
		}]
	});
	miniShop2.page.OrderProperties.superclass.constructor.call(this,config);
};
Ext.extend(miniShop2.page.OrderProperties,MODx.Component);
Ext.reg('minishop2-page-order-properties',miniShop2.page.OrderProperties);

miniShop2.panel.OrderProperties = function(config) {
	config = config || {};
	Ext.apply(config,{
		border: false
		,deferredRender: true
		,baseCls: 'modx-formpanel'
		,items: [{
			html: '<h2>'+_('minishop2') + ' :: ' + _('ms2_order_properties')+'</h2>'
			,border: false
			,cls: 'modx-page-header container'
		},{
			xtype: 'modx-tabs'
			,bodyStyle: 'padding: 5px'
			,defaults: { border: false ,autoHeight: true }
			,border: true
			,hideMode: 'offsets'
			,stateful: true
			,stateId: 'minishop2-order-properties-tabpanel'
			,stateEvents: ['tabchange']
			,getState:function() {return { activeTab:this.items.indexOf(this.getActiveTab())};}
			,items: [{
                title: _('ms2_order_properties_list')
                ,deferredRender: true
                ,items: [{
                    html: '<p>'+_('ms2_order_properties_intro')+'</p>'
                    ,border: false
                    ,bodyCssClass: 'panel-desc'
                    ,bodyStyle: 'margin-bottom: 10px'
                },{
                    xtype: 'minishop2-grid-order-properties'
                }]
            },{
                title: _('ms2_order_properties_groups_list')
                ,deferredRender: true
                ,items: [{
                    html: '<p>'+_('ms2_order_properties_groups_intro')+'</p>'
                    ,border: false
                    ,bodyCssClass: 'panel-desc'
                    ,bodyStyle: 'margin-bottom: 10px'
                },{
                    xtype: 'minishop2-grid-order-properties-groups'
                }]
            }]
		}]
	});
	miniShop2.panel.OrderProperties.superclass.constructor.call(this,config);
};
Ext.extend(miniShop2.panel.OrderProperties,MODx.Panel);
Ext.reg('minishop2-panel-order-properties',miniShop2.panel.OrderProperties);