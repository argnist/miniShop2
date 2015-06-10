<?php

class msSKUGenerateProcessor extends modObjectProcessor {
    public $classKey = 'msProductData';
    public $languageTopics = array('resource','minishop2:default');
    public $permission = 'msproduct_save';
    /* @var msProductData $object */
    public $object;
    /* @var msProduct $product */
    public $product;

    /**
     * @inheritdoc
     * @return mixed
     */
    public function process() {

        $fields = $this->getProperty('fields');
        $fields = $this->modx->fromJSON($fields);
        $variants = $this->cartesian($fields);
        $this->unsetProperty('fields');
        $path = dirname(dirname(dirname(dirname(__FILE__)))) . DIRECTORY_SEPARATOR;

        foreach ($variants as $variant) {
            $properties = array_merge($this->getProperties(), $variant);
            $this->modx->runProcessor('mgr/product/sku/create',$properties, array('processors_path' => $path));
        }
        return $this->success();
    }

    public function cartesian($input) {
        $input = array_filter($input);
        $result = array(array());
        foreach ($input as $key => $values) {
            $append = array();
            foreach($result as $product) {
                foreach($values as $item) {
                    $product[$key] = $item;
                    $append[] = $product;
                }
            }
            $result = $append;
        }
        return $result;
    }
}

return 'msSKUGenerateProcessor';