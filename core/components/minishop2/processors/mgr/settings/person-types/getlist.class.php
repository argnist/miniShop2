<?php

class msPersonTypeGetListProcessor extends modObjectGetListProcessor {
	public $classKey = 'msPersonType';
	public $defaultSortField = 'sort';
	public $defaultSortDirection  = 'asc';
	public $permission = 'mssetting_list';


	/** {@inheritDoc} */
	public function initialize() {
		if (!$this->modx->hasPermission($this->permission)) {
			return $this->modx->lexicon('access_denied');
		}
		return parent::initialize();
	}


    /** {@inheritDoc} */
    public function prepareQueryBeforeCount(xPDOQuery $c) {
        if ($this->getProperty('combo')) {
            $c->select('id,name');
            $c->where(array('active' => 1));
        }
        return $c;
    }


    /** {@inheritDoc} */
    public function prepareRow(xPDOObject $object) {
        if ($this->getProperty('combo')) {
            $array = array(
                'id' => $object->get('id')
                ,'name' => $object->get('name')
            );
        }
        else {
            $array = $object->toArray();
        }
        return $array;
    }

}

return 'msPersonTypeGetListProcessor';