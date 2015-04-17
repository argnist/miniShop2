<?php

class msOrderPropertiesGroupsGetProcessor extends modObjectGetProcessor {
	public $classKey = 'msOrderProperties';
	public $languageTopics = array('minishop2:default');
	public $permission = 'msorder_view';


	/** {@inheritDoc} */
	public function initialize() {
		if (!$this->modx->hasPermission($this->permission)) {
			return $this->modx->lexicon('access_denied');
		}
		return parent::initialize();
	}

    public function cleanup() {
        $data = $this->object->toArray();

        $payments = $this->object->getMany('Payments');
        $deliveries = $this->object->getMany('Deliveries');

        $data['payment'] = array();
        foreach($payments as $payment){
            $data['payment'][] = $payment->get('payment_id');
        }

        $data['delivery'] = array();
        foreach($deliveries as $delivery){
            $data['delivery'][] = $delivery->get('delivery_id');
        }

        if($personType = $this->object->getOne('PersonType')){
            $data['person_type'] = $personType->get('name');
        }

        return $this->success('',$data);
    }
}

return 'msOrderPropertiesGroupsGetProcessor';