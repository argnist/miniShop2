<?php
$xpdo_meta_map['msOrderPropertiesValues']= array (
  'package' => 'minishop2',
  'version' => '1.1',
  'table' => 'ms2_order_properties_values',
  'extends' => 'xPDOSimpleObject',
  'fields' => 
  array (
    'order_id' => NULL,
    'order_property_id' => NULL,
    'name' => NULL,
    'value' => NULL,
    'code' => NULL,
  ),
  'fieldMeta' => 
  array (
    'order_id' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'phptype' => 'integer',
      'attributes' => 'unsigned',
      'null' => false,
    ),
    'order_property_id' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'phptype' => 'integer',
      'attributes' => 'unsigned',
      'null' => false,
    ),
    'name' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '255',
      'phptype' => 'string',
      'null' => false,
    ),
    'value' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '255',
      'phptype' => 'string',
      'null' => true,
    ),
    'code' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '50',
      'phptype' => 'string',
      'null' => false,
    ),
  ),
  'indexes' => 
  array (
    'order_value' => 
    array (
      'alias' => 'order_value',
      'primary' => false,
      'unique' => true,
      'type' => 'BTREE',
      'columns' => 
      array (
        'order_id' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
        'order_property_id' => 
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
    'Order' => 
    array (
      'class' => 'msOrder',
      'local' => 'order_id',
      'foreign' => 'id',
      'owner' => 'foreign',
      'cardinality' => 'one',
    ),
    'OrderProperty' => 
    array (
      'class' => 'msOrderProperties',
      'local' => 'order_property_id',
      'foreign' => 'id',
      'owner' => 'foreign',
      'cardinality' => 'one',
    ),
  ),
);
