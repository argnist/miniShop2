<?php

$properties = array();

$tmp = array(
	'tplOuter' => array(
		'type' => 'textfield',
		'value' => 'tpl.msOrder.outer',
	),
	'tplPayment' => array(
		'type' => 'textfield',
		'value' => 'tpl.msOrder.payment',
	),
	'tplDelivery' => array(
		'type' => 'textfield',
		'value' => 'tpl.msOrder.delivery',
	),
	'tplEmpty' => array(
		'type' => 'textfield',
		'value' => '',
	),
	'tplSuccess' => array(
		'type' => 'textfield',
		'value' => 'tpl.msOrder.success',
	),

    'tplPersonType' => array(
        'type' => 'textfield',
        'value' => 'tpl.msOrder.personType',
    ),

    'tpl.msOrder.property.checkbox.row' => array(
        'type' => 'textfield',
        'value' => 'tpl.msOrder.property.checkbox.row',
    ),
    'tpl.msOrder.property.checkbox.variant' => array(
        'type' => 'textfield',
        'value' => 'tpl.msOrder.property.checkbox.variant',
    ),
    'tpl.msOrder.property.group' => array(
        'type' => 'textfield',
        'value' => 'tpl.msOrder.property.group',
    ),
    'tpl.msOrder.property.multiselect.row' => array(
        'type' => 'textfield',
        'value' => 'tpl.msOrder.property.multiselect.row',
    ),
    'tpl.msOrder.property.multiselect.variant' => array(
        'type' => 'textfield',
        'value' => 'tpl.msOrder.property.multiselect.variant',
    ),
    'tpl.msOrder.property.select.row' => array(
        'type' => 'textfield',
        'value' => 'tpl.msOrder.property.select.row',
    ),
    'tpl.msOrder.property.select.variant' => array(
        'type' => 'textfield',
        'value' => 'tpl.msOrder.property.select.variant',
    ),
    'tpl.msOrder.property.text.row' => array(
        'type' => 'textfield',
        'value' => 'tpl.msOrder.property.text.row',
    ),
    'tpl.msOrder.property.textarea.row' => array(
        'type' => 'textfield',
        'value' => 'tpl.msOrder.property.textarea.row',
    ),
    'tpl.msOrder.property.radio.variant' => array(
        'type' => 'textfield',
        'value' => 'tpl.msOrder.property.radio.variant',
    ),
    'tpl.msOrder.property.radio.row' => array(
        'type' => 'textfield',
        'value' => 'tpl.msOrder.property.radio.row',
    )
);

foreach ($tmp as $k => $v) {
	$properties[] = array_merge(array(
			'name' => $k,
			'desc' => 'ms2_prop_' . $k,
			'lexicon' => 'minishop2:properties',
		), $v
	);
}

return $properties;