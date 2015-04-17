<?php
$xpdo_meta_map['msOrderPropertiesDeliveries']= array (
  'package' => 'minishop2',
  'version' => '1.1',
  'table' => 'ms2_order_properties_deliveries',
  'extends' => 'xPDOObject',
  'fields' => 
  array (
    'property_id' => 0,
    'delivery_id' => 0,
  ),
  'fieldMeta' => 
  array (
    'property_id' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'phptype' => 'integer',
      'null' => false,
      'default' => 0,
      'index' => 'pk',
    ),
    'delivery_id' => 
    array (
      'dbtype' => 'int',
      'precision' => '11',
      'phptype' => 'integer',
      'null' => false,
      'default' => 0,
      'index' => 'pk',
    ),
  ),
  'indexes' => 
  array (
    'PRIMARY' => 
    array (
      'alias' => 'PRIMARY',
      'primary' => true,
      'unique' => true,
      'type' => 'BTREE',
      'columns' => 
      array (
        'property_id' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
        'delivery_id' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
  ),
  'aggregates' => 
  array (
    'Property' => 
    array (
      'class' => 'msOrderProperties',
      'local' => 'property_id',
      'foreign' => 'id',
      'cardinality' => 'one',
      'owner' => 'foreign',
    ),
    'Delivery' => 
    array (
      'class' => 'msDelivery',
      'local' => 'delivery_id',
      'foreign' => 'id',
      'cardinality' => 'one',
      'owner' => 'foreign',
    ),
  ),
);
