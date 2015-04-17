<?php

class msOrderPropertiesVariantsGetListProcessor extends modObjectGetListProcessor {
	public $classKey = 'msOrderPropertiesVariants';
	public $languageTopics = array('default','minishop2:order_properties','minishop2:manager');
	public $defaultSortField = 'sort';
	public $defaultSortDirection  = 'ASC';
	public $permission = 'msorder_list';
	/** @var  miniShop2 $ms2 */
	protected $ms2;

	/** {@inheritDoc} */
	public function initialize() {
		$this->ms2 = $this->modx->getService('miniShop2');

		if (!$this->modx->hasPermission($this->permission)) {
			return $this->modx->lexicon('access_denied');
		}
		return parent::initialize();
	}

    public function prepareQueryBeforeCount(xPDOQuery $c)
    {

        if ($propertyId = $this->getProperty('property_id')) {
            $c->where(array('order_property_id' => $propertyId));
        }

        return $c;
    }


}

return 'msOrderPropertiesVariantsGetListProcessor';
