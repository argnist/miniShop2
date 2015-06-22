<?php

class msSKUUpdateProcessor extends modObjectUpdateProcessor {
    public $classKey = 'msProductData';
    public $primaryKeyField = 'sku_id';
    public $languageTopics = array('resource','minishop2:default');
    public $permission = 'msproduct_save';
    /* @var msProductData $object */
    public $object;
    /* @var msProduct $product */
    public $product;

    public function beforeSet() {
        $this->unsetProperty('id');

        if ($this->getProperty('default')) {
            $this->modx->updateCollection('msProductData', array('default' => 0),
                array('id' => $this->object->get('id'), 'sku_id:!=' => $this->object->get('sku_id') ));
        } else if ($this->object->get('default')) {
            $this->setProperty('default', true);
        }

        return parent::beforeSet();
    }

    /**
     * @return bool
     */
    public function beforeSave() {

        $this->product = $this->object->getOne('Product');
        $this->product->fromArray($this->getProperties());
        $this->product->setProductOptions($this->object);

         $metadata = $this->modx->getFieldMeta('msProductData');

         foreach ($metadata as $key => $field) {
             if (in_array($field['phptype'], array('json','array')) && !is_array($this->getProperty($key))) {
                 $this->object->set($key, array($this->getProperty($key)));
             }
         }

        $sku_name = $this->object->generateSKUName($this->getProperty('sku_name'), $this->getProperties());
        $this->object->set('sku_name', $sku_name);

        return parent::beforeSave();
    }
}

return 'msSKUUpdateProcessor';