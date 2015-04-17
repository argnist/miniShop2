<?php

class msOrderPropertiesVariantsRemoveProcessor extends modObjectRemoveProcessor  {
	public $classKey = 'msOrderPropertiesVariants';
	public $languageTopics = array('minishop2');
	public $permission = 'msorder_save';


	/** {@inheritDoc} */
	public function initialize() {
		if (!$this->modx->hasPermission($this->permission)) {
			return $this->modx->lexicon('access_denied');
		}
		return parent::initialize();
	}

}
return 'msOrderPropertiesVariantsRemoveProcessor';