<?php

class msOrderPropertiesGroupsRemoveProcessor extends modObjectRemoveProcessor  {
	public $classKey = 'msOrderPropertiesGroups';
	public $languageTopics = array('minishop2');
	public $permission = 'msorderpropertiesgroups_save';


	/** {@inheritDoc} */
	public function initialize() {
		if (!$this->modx->hasPermission($this->permission)) {
			return $this->modx->lexicon('access_denied');
		}
		return parent::initialize();
	}

}
return 'msOrderPropertiesGroupsRemoveProcessor';