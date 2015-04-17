<?php
$xpdo_meta_map['msOrderPropertiesVariants']= array (
  'package' => 'minishop2',
  'version' => '1.1',
  'table' => 'ms2_order_properties_variants',
  'extends' => 'xPDOSimpleObject',
  'fields' => 
  array (
    'order_property_id' => NULL,
    'name' => NULL,
    'value' => NULL,
    'sort' => 100,
    'description' => NULL,
  ),
  'fieldMeta' => 
  array (
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
    'sort' => 
    array (
      'dbtype' => 'int',
      'precision' => '11',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => false,
      'default' => 100,
    ),
    'description' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '255',
      'phptype' => 'string',
      'null' => false,
    ),
  ),
  'indexes' => 
  array (
    'order_property_id' => 
    array (
      'alias' => 'order_property_id',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' => 
      array (
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
