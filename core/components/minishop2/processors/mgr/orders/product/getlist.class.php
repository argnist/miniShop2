<?php

class msProductGetListProcessor extends modObjectGetListProcessor {
	public $classKey = 'msOrderProduct';
	public $languageTopics = array('minishop2:product');
	public $defaultSortField = 'id';
	public $defaultSortDirection  = 'ASC';
	public $permission = 'msorder_list';


	/** {@inheritDoc} */
	public function initialize() {
		if (!$this->modx->hasPermission($this->permission)) {
			return $this->modx->lexicon('access_denied');
		}
		return parent::initialize();
	}


	/** {@inheritDoc} */
	public function prepareQueryBeforeCount(xPDOQuery $c) {
		$c->innerJoin('msOrder','msOrder', '`msOrderProduct`.`order_id` = `msOrder`.`id`');
        $c->leftJoin('msProductData','msProductData', '`msOrderProduct`.`product_id` = `msProductData`.`sku_id`');
		$c->leftJoin('msProduct','msProduct', '`msProductData`.`id` = `msProduct`.`id`');

		$c->where(array(
			'order_id' => $this->getProperty('order_id')
		));

		$c->select($this->modx->getSelectColumns('msOrderProduct','msOrderProduct'));
		$c->select($this->modx->getSelectColumns('msProduct','msProduct', 'product_', array('id'), true));
		$c->select($this->modx->getSelectColumns('msProductData','msProductData', 'product_', array('id'), true));

		if ($query = $this->getProperty('query',null)) {
			$c->where(array(
				'msProduct.pagetitle:LIKE' => '%'.$query.'%'
				,'OR:msProduct.description:LIKE' => '%'.$query.'%'
				,'OR:msProduct.introtext:LIKE' => '%'.$query.'%'
                ,'OR:msProductData.sku_name:LIKE' =>  '%'.$query.'%'
				,'OR:msProductData.article:LIKE' =>  '%'.$query.'%'
				,'OR:msProductData.vendor:LIKE' =>  '%'.$query.'%'
				,'OR:msProductData.made_in:LIKE' =>  '%'.$query.'%'
			));
		}

		return $c;
	}

    /**
     * @param msProduct $product
     * @return mixed
     */
    public function getProductName($product) {
        if ($product->get('name')) {
            return $product->get('name');
        } elseif ($product->get('product_sku_name')) {
            return $product->get('product_sku_name');
        } else {
            return $product->get('product_pagetitle');
        }
    }

	/** {@inheritDoc} */
	public function prepareRow(xPDOObject $object) {
		$fields = array_map('trim', explode(',', $this->modx->getOption('ms2_order_product_fields', null, '')));
		$fields = array_values(array_unique(array_merge($fields, array('id','product_id','name','product_sku_name','product_pagetitle'))));

		$data = array();
		foreach ($fields as $v) {
			$data[$v] = $object->get($v);
			if ($v === 'product_price' || $v === 'product_old_price') {$data[$v] = round($data[$v],2);}
			else if ($v === 'product_weight') {$data[$v] = round($data[$v],3);}
		}

		$data['name'] = $this->getProductName($object);

		$options = $object->get('options');
		if (!empty($options) && is_array($options)) {
			$tmp = array();
			foreach ($options as $k => $v) {
				$tmp[] = $this->modx->lexicon('ms2_'.$k) . ': ' .$v;
				$data['option_'.$k] = $v;
			}
			$data['options'] = implode('; ', $tmp);
		}

		return $data;
	}


}

return 'msProductGetListProcessor';