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
    /** @var msProduct */
    public $product;
    /** @var array */
    public $options = array();

	/** {@inheritDoc} */
	public function initialize() {
		if (!$this->getProperty('limit')) {$this->setProperty('limit', 20);}

		return parent::initialize();
	}


	/** {@inheritDoc} */
	public function prepareQueryBeforeCount(xPDOQuery $c) {
        $c->select(array($this->modx->getSelectColumns('msProductData','msProductData')));

        $productId = $this->getProperty('product', 0);
        if ($productId) {
            $this->product = $this->modx->getObject('msProduct', $productId);
        } else if ($skuId = $this->getProperty('sku_id')) {
            $sku = $this->modx->getObject('msProductData', $skuId);
            $this->product = $sku->getOne('Product');
            $productId = $this->product->get('id');
        }

        if ($this->product) {
            $this->options = $this->product->getOptionKeys();
        }
        foreach ($this->options as $option) {
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

        $this->prepareCombo($data);

        return $data;
    }

    public function prepareCombo(&$data) {
        if ($this->getProperty('combo')) {
            $data['options'] = array();
            foreach ($this->options as $option) {
                $data['options'][$this->product->get($option.'.caption')] = $data[$option] ? $data[$option] : '';
            }
            $data['options'][$this->modx->lexicon('ms2_product_color')] = isset($data['color'][0]) ? $data['color'][0] : '';
            $data['options'][$this->modx->lexicon('ms2_product_size')] = isset($data['size'][0]) ? $data['size'][0] : '';
            $data['options'] = json_encode($data['options'],JSON_UNESCAPED_UNICODE);
        }
    }
}

return 'msSKUGetListProcessor';