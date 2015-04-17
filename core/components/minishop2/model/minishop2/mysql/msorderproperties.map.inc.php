<?php
$xpdo_meta_map['msOrderProperties']= array (
  'package' => 'minishop2',
  'version' => '1.1',
  'table' => 'ms2_order_properties',
  'extends' => 'xPDOSimpleObject',
  'fields' => 
  array (
    'name' => NULL,
    'person_type_id' => NULL,
    'type' => NULL,
    'required' => 0,
    'active' => 1,
    'default_value' => NULL,
    'sort' => 100,
    'group_id' => 0,
    'description' => NULL,
    'code' => NULL,
    'multiple' => 0,
  ),
  'fieldMeta' => 
  array (
    'name' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '255',
      'phptype' => 'string',
      'null' => false,
    ),
    'person_type_id' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => false,
    ),
    'type' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '255',
      'phptype' => 'string',
      'null' => false,
    ),
    'required' => 
    array (
      'dbtype' => 'tinyint',
      'precision' => '1',
      'attributes' => 'unsigned',
      'phptype' => 'boolean',
      'null' => true,
      'default' => 0,
    ),
    'active' => 
    array (
      'dbtype' => 'tinyint',
      'precision' => '1',
      'attributes' => 'unsigned',
      'phptype' => 'boolean',
      'null' => true,
      'default' => 1,
    ),
    'default_value' => 
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
    'group_id' => 
    array (
      'dbtype' => 'int',
      'precision' => '11',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => true,
      'default' => 0,
    ),
    'description' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '255',
      'phptype' => 'string',
      'null' => false,
    ),
    'code' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '50',
      'phptype' => 'string',
      'null' => false,
    ),
    'multiple' => 
    array (
      'dbtype' => 'tinyint',
      'precision' => '1',
      'attributes' => 'unsigned',
      'phptype' => 'boolean',
      'null' => true,
      'default' => 0,
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
    'required' => 
    array (
      'alias' => 'required',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' => 
      array (
        'required' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
    'active' => 
    array (
      'alias' => 'active',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' => 
      array (
        'active' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
    'group_id' => 
    array (
      'alias' => 'group_id',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' => 
      array (
        'group_id' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
  ),
  'composites' => 
  array (
    'Variants' => 
    array (
      'class' => 'msOrderPropertiesVariants',
      'local' => 'id',
      'foreign' => 'order_property_id',
      'owner' => 'local',
      'cardinality' => 'many',
    ),
    'Deliveries' => 
    array (
      'class' => 'msOrderPropertiesDeliveries',
      'local' => 'id',
      'foreign' => 'property_id',
      'owner' => 'local',
      'cardinality' => 'many',
    ),
    'Payments' => 
    array (
      'class' => 'msOrderPropertiesPayments',
      'local' => 'id',
      'foreign' => 'property_id',
      'owner' => 'local',
      'cardinality' => 'many',
    ),
  ),
  'aggregates' => 
  array (
    'Group' => 
    array (
      'class' => 'msOrderPropertiesGroups',
      'local' => 'group_id',
      'foreign' => 'id',
      'owner' => 'foreign',
      'cardinality' => 'one',
    ),
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
