<?php

class msOrderGetProcessor extends modObjectGetProcessor {
	public $classKey = 'msOrder';
	public $languageTopics = array('minishop2:default');
	public $permission = 'msorder_view';


	/** {@inheritDoc} */
	public function initialize() {
		if (!$this->modx->hasPermission($this->permission)) {
			return $this->modx->lexicon('access_denied');
		}
		return parent::initialize();
	}


	/** {@inheritDoc} */
	public function cleanup() {
		$array = $this->object->toArray();
		if ($address = $this->object->getOne('Address')) {
			$array = array_merge($array, $address->toArray('addr_'));
		}
		if ($profile = $this->object->getOne('UserProfile')) {
			$array['fullname'] = $profile->get('fullname');
		}
		else {
			$array['fullname'] = $this->modx->lexicon('no');
		}

		$array['createdon'] = $this->modx->miniShop2->formatDate($array['createdon']);
		$array['updatedon'] = $this->modx->miniShop2->formatDate($array['updatedon']);

        $this->setUserProperties($array);

		return $this->success('', $array);
	}

    private function setUserProperties(&$data){
        $result = array();

        $propertyValues = $this->object->getMany('Properties');
        $propertyValuesMap = array();

        foreach($propertyValues as $propertyValue){
            $data['property_'.$propertyValue->get('code')] = $propertyValue->get('value');
            $propertyValuesMap[$propertyValue->get('order_property_id')] = $propertyValue->toArray();
        }

        $query = $this->modx->newQuery('msOrderProperties');
        $query->select($this->modx->getSelectColumns('msOrderProperties','msOrderProperties'));
        $query->select(array(
            'msOrderPropertiesGroups.name as group_name,msOrderPropertiesGroups.id as group_id'
        ));
        $query->leftJoin('msOrderPropertiesGroups','msOrderPropertiesGroups','`msOrderPropertiesGroups`.`id` = `msOrderProperties`.`group_id`');
        $query->where(array('msOrderProperties.id:IN'=>array_keys($propertyValuesMap)));
        $query->sortby('msOrderProperties.sort');
        $properties = $this->modx->getCollection('msOrderProperties',$query);


        foreach($properties as $property){
            if(!isset($result[$property->get('group_id')])){
                $result[$property->get('group_id')]['groupName'] = $property->get('group_name');
            }
            $result[$property->get('group_id')]['properties'][] = $propertyValuesMap[$property->get('id')];
        }

        $data['userProperties'] = array_values($result);
    }
}

return 'msOrderGetProcessor';