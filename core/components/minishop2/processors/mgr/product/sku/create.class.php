<?php

class msSKUCreateProcessor extends modObjectCreateProcessor {
	public $classKey = 'msProductData';
    public $primaryKeyField = 'sku_id';
	public $languageTopics = array('resource','minishop2:default');
	public $permission = 'msproduct_save';
	/* @var msProductData $object */
	public $object;
    /* @var msProduct $product */
    public $product;

    public function beforeSave() {
        /** @var msProduct $product */
        $this->product = $this->object->getOne('Product');
        //$this->product->fromArray($this->getProperties());
        //$this->product->setProductOptions($this->object);
        $options = $this->product->getOptionKeys();
        $productOptions = array();
        // нужно передать опции в данные товара
        foreach ($options as $option) {
            $productOptions[$option] = $this->object->get($option);
        }
        $this->object->set('product_options', $productOptions);

        $metadata = $this->modx->getFieldMeta('msProductData');
        foreach ($metadata as $key => $field) {
            if (in_array($field['phptype'], array('json','array'))) {
                $this->object->set($key, array($this->getProperty($key)));
            }
        }

        $sku_name = $this->generateSKUName($this->getProperty('sku_name'));
        $this->object->set('sku_name', $sku_name);

        return parent::beforeSave();
    }

    public function generateSKUName($sku_name) {
        if ($count = preg_match_all('/{=(.+?)}/', $sku_name, $matches)) {
            for ($i = 0; $i < $count; $i++) {
                $field = $this->getProperty($matches[1][$i]);
                if (is_array($field)) {
                    $field = implode(',', $field);
                }
                if ($matches[1][$i] == 'pagetitle') {
                    $field = $this->product->get('pagetitle');
                } else if ($matches[1][$i] == 'vendor') {
                    $field = $this->product->get('vendor.name');
                } else if ($matches[1][$i] == 'id') {
                    $field = $this->product->get('id');
                }
                $sku_name = str_replace($matches[0][$i], $field, $sku_name);
            }
        }

        return $sku_name;
    }

}

return 'msSKUCreateProcessor';