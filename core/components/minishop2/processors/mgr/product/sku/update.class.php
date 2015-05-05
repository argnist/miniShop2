<?php

class msSKUUpdateProcessor extends modObjectUpdateProcessor {
    public $classKey = 'msProductData';
    public $languageTopics = array('resource','minishop2:default');
    public $permission = 'msproduct_save';
    /* @var msProductData $object */
    public $object;

    public function beforeSave() {
        /** @var msProduct $product */
        $product = $this->object->getOne('SKUProduct');
        $options = $product->getOptionKeys();
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

        return parent::beforeSave();
    }
}

return 'msSKUUpdateProcessor';