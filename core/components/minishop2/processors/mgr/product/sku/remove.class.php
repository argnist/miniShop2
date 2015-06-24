<?php

class msSKURemoveProcessor extends modObjectRemoveProcessor {
    public $classKey = 'msProductData';
    public $primaryKeyField = 'sku_id';
    public $objectType = 'ms2';
    public $languageTopics = array('minishop2:default');

    public function beforeRemove() {
        if ($this->object->get('default')) {
            return $this->modx->lexicon('ms2_sku_err_notsku');
        }

        return parent::beforeRemove();
    }
}

return 'msSKURemoveProcessor';
