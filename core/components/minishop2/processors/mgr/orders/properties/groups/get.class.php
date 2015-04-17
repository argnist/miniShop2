<?php

class msOrderPropertiesGroupsGetProcessor extends modObjectGetProcessor {
	public $classKey = 'msOrderPropertiesGroups';
	public $languageTopics = array('minishop2:default');
	public $permission = 'msorder_view';


	/** {@inheritDoc} */
	public function initialize() {
		if (!$this->modx->hasPermission($this->permission)) {
			return $this->modx->lexicon('access_denied');
		}
		return parent::initialize();
	}
}

return 'msOrderPropertiesGroupsGetProcessor';