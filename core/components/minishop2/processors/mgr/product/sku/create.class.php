<?php

class msSKUCreateProcessor extends modObjectCreateProcessor {
	public $classKey = 'msProductData';
	public $languageTopics = array('resource','minishop2:default');
	public $permission = 'msproduct_save';
	/* @var msProductData $object */
	public $object;

}

return 'msSKUCreateProcessor';