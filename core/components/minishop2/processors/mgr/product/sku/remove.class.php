<?php

class msSKURemoveProcessor extends modObjectRemoveProcessor {
    public $classKey = 'msProductData';
    public $primaryKeyField = 'sku_id';
    public $objectType = 'ms2';
    public $languageTopics = array('minishop2:default');

    public function beforeRemove() {
        $sku_count = $this->modx->getCount($this->classKey, array('id' => $this->object->get('id')));
        if ($sku_count == 1) {
            return $this->modx->lexicon('ms2_sku_err_notsku');
        }

        return parent::beforeRemove();
    }
}

return 'msSKURemoveProcessor';
