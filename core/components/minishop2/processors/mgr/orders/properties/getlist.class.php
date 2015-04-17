<?php

class msOrderPropertiesGetListProcessor extends modObjectGetListProcessor {
	public $classKey = 'msOrderProperties';
	public $languageTopics = array('default','minishop2:order_properties','minishop2:manager');
	public $defaultSortField = 'sort';
	public $defaultSortDirection  = 'ASC';
	public $permission = 'msorder_list';
	/** @var  miniShop2 $ms2 */
	protected $ms2;
    protected $orderPropertiesTypes;

	/** {@inheritDoc} */
	public function initialize() {
        $this->orderPropertiesTypes = $this->modx->fromJSON($this->modx->getOption('ms_order_properties_types'));

        $this->ms2 = $this->modx->getService('miniShop2');

		if (!$this->modx->hasPermission($this->permission)) {
			return $this->modx->lexicon('access_denied');
		}
		return parent::initialize();
	}

    /** {@inheritDoc} */
    public function prepareQueryBeforeCount(xPDOQuery $c) {
        $c->leftJoin('msOrderPropertiesGroups','msOrderPropertiesGroups', '`msOrderProperties`.`group_id` = `msOrderPropertiesGroups`.`id`');

        $propertyColumns = $this->modx->getSelectColumns('msOrderProperties', 'msOrderProperties', '', array(), true);
        $c->select($propertyColumns . ', `msOrderPropertiesGroups`.`name` as `group`');

        return $c;
    }

    /** {@inheritDoc} */
    public function prepareRow(xPDOObject $object) {
        $array = $object->toArray();

        foreach($this->orderPropertiesTypes as $orderPropertiesType){
            if($array['type']==$orderPropertiesType['type']){
                $array['type'] = $orderPropertiesType['name'];
                break;
            }
        }

        return $array;
    }


}

return 'msOrderPropertiesGetListProcessor';
