<?php

class msOrderPropertiesGroupsGetListProcessor extends modObjectGetListProcessor {
	public $classKey = 'msOrderPropertiesGroups';
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

    /** {@inheritDoc} */
    public function prepareQueryBeforeCount(xPDOQuery $c) {
        $c->leftJoin('msPersonType','msPersonType', '`msOrderPropertiesGroups`.`person_type_id` = `msPersonType`.`id`');

        $groupColumns = $this->modx->getSelectColumns('msOrderPropertiesGroups', 'msOrderPropertiesGroups', '', array('name','sort'), true);
        $c->select($groupColumns . ', `msPersonType`.`name` as `person_type`');

        if($this->getProperty('person_type_id')){
            $person = (int) $this->getProperty('person_type_id');
            $c->where(array('person_type_id' => $person));
        }

        return $c;
    }

}

return 'msOrderPropertiesGroupsGetListProcessor';
