<?php

class msOrderProperties extends xPDOSimpleObject
{
    public function getFrontendName()
    {
        /** @var miniShop2 $miniShop2 */
        $miniShop2 = $this->xpdo->getService('minishop2');
        $propertyTypesMap = $miniShop2->getPropertyTypesMap();

        $name = 'property[' . $this->code . ']';
        if ($propertyTypesMap[$this->type]['multiple'] == 1) $name .= '[]';

        return $name;
    }

    public function isHidden($paymentId, $deliveryId)
    {
        $deliveries = $this->getDeliveries();
        $payments = $this->getPayments();

        $hiddenByDelivery = 0;
        $hiddenByPayment = 0;
        if ($deliveries && !in_array($deliveryId, $deliveries)) {
            $hiddenByDelivery = 1;
        }
        if ($payments && !in_array($paymentId, $payments)) {
            $hiddenByPayment = 1;
        }

        $isHidden = $hiddenByDelivery || $hiddenByPayment;

        return $isHidden;
    }

    public function generateLexiconEntry()
    {
        $key = 'ms2_property_' . $this->get('code');
        /** @var modLexiconEntry $entry */
        $entry = $this->xpdo->getObject('modLexiconEntry', array(
            'name:=' => $key
        ));

        if ($entry && $entry->get('value') != $this->get('name')) {
            $entry->set('value', $this->get('name'));
            $entry->save();
        } else {
            $entry = $this->xpdo->newObject('modLexiconEntry');
            $entry->set('name', $key);
            $entry->set('value', $this->get('name'));
            $entry->set('topic', 'default');
            $entry->set('namespace', 'minishop2');
            $entry->set('language', 'ru');
            $entry->save();
        }
    }

    public function getDeliveries()
    {
        $result = array();
        $cacheKey = 'property-' . $this->get('id') . '/deliveries';
        if ($result = $this->xpdo->cacheManager->get($cacheKey)) {
            return $result;
        }

        $rows = $this->getMany('Deliveries');
        foreach ($rows as $row) {
            $result[] = $row->delivery_id;
        }

        $this->xpdo->cacheManager->set($cacheKey, $result);

        return $result;
    }

    public function getPayments()
    {
        $result = array();
        $cacheKey = 'property-' . $this->get('id') . '/payments';
        if ($result = $this->xpdo->cacheManager->get($cacheKey)) {
            return $result;
        }

        $rows = $this->getMany('Payments');
        foreach ($rows as $row) {
            $result[] = $row->payment_id;
        }

        $this->xpdo->cacheManager->set($cacheKey, $result);

        return $result;
    }

}