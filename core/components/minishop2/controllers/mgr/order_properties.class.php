<?php
require_once dirname(dirname(dirname(__FILE__))) . '/index.class.php';

class ControllersOrderPropertiesManagerController extends miniShop2MainController {
    public static function getDefaultController() {
        return 'order_properties';
    }
}

class Minishop2OrderPropertiesManagerController extends miniShop2MainController {

    public function getPageTitle() {
        return 'miniShop2 :: ' . $this->modx->lexicon('ms2_order_properties');
    }


    public function getLanguageTopics() {
        return array('minishop2:default', 'minishop2:manager', 'minishop2:order_properties');
    }


    public function loadCustomCssJs() {

        $orderPropertiesTypes = $this->modx->getOption('ms_order_properties_types');

        $this->addJavascript($this->miniShop2->config['jsUrl'] . 'mgr/misc/ms2.combo.js');
        $this->addJavascript($this->miniShop2->config['jsUrl'] . 'mgr/order-properties/order-properties-groups.grid.js');
        $this->addJavascript($this->miniShop2->config['jsUrl'] . 'mgr/order-properties/order-properties-variants.grid.js');
        $this->addJavascript($this->miniShop2->config['jsUrl'] . 'mgr/order-properties/order-properties.grid.js');
        $this->addJavascript($this->miniShop2->config['jsUrl'] . 'mgr/order-properties/order-properties.panel.js');
        $this->addHtml('<script type="text/javascript">
			Ext.onReady(function() {
				miniShop2.config.order_properties_types = ' . $orderPropertiesTypes . ';
				MODx.load({ xtype: "minishop2-page-order-properties"});
			});
		</script>');
        $this->modx->invokeEvent('msOnManagerCustomCssJs', array('controller' => &$this, 'page' => 'order_properties'));
    }


    public function getTemplateFile() {
        return $this->miniShop2->config['templatesPath'] . 'mgr/order_properties.tpl';
    }
}

// MODX 2.3
class ControllersMgrOrderPropertiesManagerController extends ControllersOrderPropertiesManagerController {
    public static function getDefaultController() {
        return 'mgr/order_properties';
    }
}

class Minishop2MgrOrderPropertiesManagerController extends Minishop2OrderPropertiesManagerController {
}