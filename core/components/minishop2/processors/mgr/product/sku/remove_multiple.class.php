<?php

class msSKURemoveMultipleProcessor extends modObjectProcessor {
    public $classKey = 'msProductData';
    public $objectType = 'ms2';
    public $languageTopics = array('minishop2:default');

    /** {@inheritDoc} */
    public function process() {
        $ids = $this->getProperty('ids',null);
        if (empty($ids)) {
            return $this->success();
        }
        $ids = is_array($ids) ? $ids : explode(',',$ids);

        $path = dirname(dirname(dirname(dirname(__FILE__)))) . DIRECTORY_SEPARATOR;

        foreach ($ids as $id) {
            if (!empty($id)) {
                $this->modx->runProcessor('mgr/product/sku/remove',array('id' => $id), array('processors_path' => $path));
            }
        }
        return $this->success();
    }
}

return 'msSKURemoveMultipleProcessor';
