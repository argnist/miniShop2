<?php

$properties = array();

$tmp = array(
    'tplRow' => array(
        'type' => 'textfield',
        'value' => 'tpl.msProductOptions.row',
    ),
    'tplOuter' => array(
        'type' => 'textfield',
        'value' => 'tpl.msProductOptions.outer',
    ),
    'valuesSeparator' => array(
        'type' => 'textfield',
        'value' => ', ',
    ),
    'outputSeparator' => array(
        'type' => 'textfield',
        'value' => "\n"
    ),
    'ignoreOptions' => array(
        'type' => 'textfield',
        'value' => '',
    ),
    'hideEmpty' => array(
        'type' => 'combo-boolean',
        'value' => false,
    ),
    'tplValue' => array(
        'type' => 'textfield',
        'value' => '@INLINE [[+value]]',
    ),
    'groups' => array(
        'type' => 'textfield',
        'value' => '',
    ),
    'groupByGroups' => array(
        'type' => 'textfield',
        'value' => '',
    ),
    'groupSeparator' => array(
        'type' => 'textfield',
        'value' => '',
    ),
    'tplGroup' => array(
        'type' => 'textfield',
        'value' => '@INLINE <p>[[+category_name:default=`Без категории`]]:</p><p>[[+rows]]</p>',
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