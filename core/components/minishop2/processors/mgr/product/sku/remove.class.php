<?php

class msSKURemoveProcessor extends modObjectRemoveProcessor {
    public $classKey = 'msProductData';
    public $objectType = 'ms2';
    public $languageTopics = array('minishop2:default');

    public function beforeRemove() {
        if (!$this->object->get('sku')) {
            return $this->modx->lexicon('ms2_sku_err_notsku');
        }

        return parent::beforeRemove();
    }
}

return 'msSKURemoveProcessor';
