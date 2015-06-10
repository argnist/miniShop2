<?php

class msSKUGenerateProcessorTest extends MODxProcessorTestCase {

    public $processor = 'mgr/product/sku/generate';

    public function setUp() {
        parent::setUp();

        $category = $this->createTestCategory('UnitTestCategory');
        $product = $this->createTestProduct('UnitTestProduct1', $category->get('id'));

    }

    public function testGenerateSKUs() {
        $product = $this->modx->getObject('msProduct', array('pagetitle' => 'UnitTestProduct1'));
        $response = $this->getResponse(array(
            'fields' =>
                '{"color":["зеленый","красный","синий"],"multiple_opt":["Вариант 2","Вариант 3","Вариант 1","Вариант 6"
                ,"Вариант 5"],"size":["XL","XXL","M"]}',
            'product_id' => $product->get('id'),
            'sku_name' => '{=pagetitle} {=color} {=multiple_opt} {=size}',
        ));
        $this->assertTrue($response['success']);
    }

}
