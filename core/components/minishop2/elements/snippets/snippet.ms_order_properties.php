<?php
/* @var array $scriptProperties */
/* @var miniShop2 $miniShop2 */
$miniShop2 = $modx->getService('minishop2');
$miniShop2->initialize($modx->context->key);
/* @var pdoFetch $pdoFetch */
if (!$modx->loadClass('pdofetch', MODX_CORE_PATH . 'components/pdotools/model/pdotools/', false, true)) {return false;}
$pdoFetch = new pdoFetch($modx, $scriptProperties);
$order = $miniShop2->order->get();

$propertyTypes = $modx->fromJSON($modx->getOption('ms_order_properties_types'));
$propertyData = array();
if($propertyTypes){
    $propertyTypesMap = array();

    foreach($propertyTypes as $propertyType){
        $propertyTypesMap[$propertyType['type']] = $propertyType;
    }

    $query = $modx->newQuery('msOrderProperties');
    $query->select($modx->getSelectColumns('msOrderProperties','msOrderProperties'));
    $query->select(array(
        'msOrderPropertiesGroups.name as group_name,msOrderPropertiesGroups.id as group_id'
    ));
    $query->leftJoin('msOrderPropertiesGroups','msOrderPropertiesGroups','`msOrderPropertiesGroups`.`id` = `msOrderProperties`.`group_id`');
    $query->where(array(
        'msOrderProperties.active'=>1,
        'msOrderProperties.person_type_id'=>$order['person_type']
    ));
    $query->sortby('msOrderPropertiesGroups.sort,msOrderProperties.sort');
    $properties = $modx->getCollection('msOrderProperties',$query);

    $groupsData = array();
    foreach($properties as $property){
        $type = strtolower($property->type);
        $name = 'property['.$property->code.']';
        if($propertyTypesMap[$property->type]['multiple']==1) $name .= '[]';

        $isHidden = $property->isHidden($order['payment'],$order['delivery']);

        $tplRow = $scriptProperties['tpl.msOrder.property.'.$type.'.row'];
        if(isset($scriptProperties['tpl.msOrder.property.'.$property->code.'row'])){
            $tplRow = $scriptProperties['tpl.msOrder.property.'.$property->code.'variant'];
        }

        $variants = array();
        if(isset($propertyTypesMap[$property->type]['variants']) && $propertyTypesMap[$property->type]['variants']==1){
            $variants = $property->getMany('Variants');
        }

        $dataRow = array();
        if($variants){
            $rows = array();
            $tplVariant = $scriptProperties['tpl.msOrder.property.'.$type.'.variant'];
            if(isset($scriptProperties['tpl.msOrder.property.'.$property->code.'variant'])){
                $tplVariant = $scriptProperties['tpl.msOrder.property.'.$property->code.'variant'];
            }

            foreach($variants as $variant){
                $data = array(
                    'value' => (isset($variant->value))?$variant->value:$variant->name,
                    'title' => $variant->name,
                    'name' => $name,
                    'default_value' => $property->default_value,
                    'selected' => 0,
                    'is_hidden' => $isHidden
                );
                $rows[] = empty($tplVariant)
                    ? $pdoFetch->getChunk('', $data)
                    : $pdoFetch->getChunk($tplVariant, $data);
            }

            $dataRow = array(
                'title' => $property->name,
                'name' => $name,
                'rows' => implode(" ",$rows)
            );
        }
        else{
            $dataRow = array(
                'title' => $property->name,
                'name' => $name,
                'selected' => 0,
                'default_value' => $property->default_value
            );
        }

        if(!isset($groupsData[$property->group_id])){
            $groupsData[$property->group_id] = array(
                'name' => $property->group_name,
                'rows' => array()
            );
        }

        $dataRow['is_hidden'] = $isHidden;

        $groupsData[$property->group_id]['rows'][] = empty($tplRow)
            ? $pdoFetch->getChunk('', $dataRow)
            : $pdoFetch->getChunk($tplRow, $dataRow);

    }

    $tplGroup = $scriptProperties['tpl.msOrder.property.group'];

    foreach($groupsData as $groupRow){
        $groupRow['rows'] = implode(" ",$groupRow['rows']);

        $propertyData[] = empty($tplGroup)
            ? $pdoFetch->getChunk('', $groupRow)
            : $pdoFetch->getChunk($tplGroup, $groupRow);
    }

}

// Saving params into cache for ajax requests
$_SESSION['msOrderProperties']['properties'] = $scriptProperties;

return implode('', $propertyData);