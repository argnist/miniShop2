<?php
/**
 * Get a list of SKU
 *
 * @package minishop2
 * @subpackage processors
 */
class msSKUGetListProcessor extends modObjectGetListProcessor {
	public $classKey = 'msProductData';
    public $primaryKeyField = 'sku_id';
	public $languageTopics = array('default','minishop2:product');
	public $defaultSortField = 'sku_id';
	public $defaultSortDirection  = 'ASC';
    /** @var msProductData */
    public $object;
//	public $parent = 0;
//
//
	/** {@inheritDoc} */
	public function initialize() {
		if (!$this->getProperty('limit')) {$this->setProperty('limit', 20);}

		return parent::initialize();
	}


	/** {@inheritDoc} */
	public function prepareQueryBeforeCount(xPDOQuery $c) {
        $productId = $this->getProperty('product', 0);
        $c->select(array($this->modx->getSelectColumns('msProductData','msProductData')));
        /** @var msProduct $product */
        $product = $this->modx->getObject('msProduct', $productId);
        $options = array();
        if ($product) {
            $options = $product->getOptionKeys();
        }
        foreach ($options as $option) {
            $c->leftJoin('msProductOption', $option, "msProductData.sku_id={$option}.product_id AND {$option}.key='{$option}'");
            $c->select(array("{$option}.`value` {$option}"));
        }

		$c->where(array(
            'id' => $productId,
        ));
		return $c;
	}

    public function prepareRow(xPDOObject $object) {
        $data = parent::prepareRow($object);
        /* modx-grid считает поле id уникальным.
           Если оно не уникально, то запись перезаписывается и выводится только последняя строка
        */
        $data['id'] = $data['sku_id'];
        return $data;
    }
}

return 'msSKUGetListProcessor';