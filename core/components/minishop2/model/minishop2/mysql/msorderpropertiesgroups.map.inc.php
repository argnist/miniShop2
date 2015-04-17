<?php
$xpdo_meta_map['msOrderPropertiesGroups']= array (
  'package' => 'minishop2',
  'version' => '1.1',
  'table' => 'ms2_order_properties_groups',
  'extends' => 'xPDOSimpleObject',
  'fields' => 
  array (
    'person_type_id' => NULL,
    'name' => NULL,
    'sort' => 100,
  ),
  'fieldMeta' => 
  array (
    'person_type_id' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => false,
    ),
    'name' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '255',
      'phptype' => 'string',
      'null' => false,
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
  ),
  'indexes' => 
  array (
    'person_type_id' => 
    array (
      'alias' => 'person_type_id',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' => 
      array (
        'person_type_id' => 
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
    'PersonType' => 
    array (
      'class' => 'msPersonType',
      'local' => 'person_type_id',
      'foreign' => 'id',
      'owner' => 'foreign',
      'cardinality' => 'one',
    ),
  ),
);
