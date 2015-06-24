<?php

class msProductGetAllOptionsProcessor extends modObjectProcessor {
	public $classKey = 'msProductOption';

    public function initialize() {
        $productId = $this->getProperty('product');
        if ($productId) {
            /** @var msProduct $product */
            $product = $this->modx->getObject('msProduct', $productId);
        } else {
            return $this->modx->lexicon('ms2_err_ns');
        }

        if ($product) {
            $this->object = $product->getOptionFields();
        } else {
            return $this->modx->lexicon('ms2_err_nf');
        }

        return true;
    }

	/** {@inheritDoc} */
	public function process() {

        $data = array();

        foreach ($this->object as $option) {
            if (isset($option['properties']['values'])) {
                foreach ($option['properties']['values'] as $key => $value) {
                    $data[] = array('value' => $value, 'option' => $option['key'], 'rank' => $key);
                }
            }
        }

        $metadata = $this->modx->getFieldMeta('msProductData');
        foreach ($metadata as $field => $meta) {
            if ($this->isOption($field, $meta)) {
                $values = $this->getValues($field);
                foreach ($values as $key => $value) {
                    $data[] = array('value' => $value['value'], 'option' => $field, 'rank' => $key);
                }
            }
        }

        return $this->outputArray($data);
	}

    public function isOption($field, $meta) {
        return in_array($meta['phptype'], array('json','array')) && ($field != 'tags');
    }

    public function getValues($key) {
        $c = $this->modx->newQuery('msProductOption');
        $c->sortby('value','ASC');
        $c->select('value');
        $c->groupby('value');
        $c->where(array('key' => $key));
        if ($c->prepare() && $c->stmt->execute()) {
            $res = $c->stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        else {
            $res = array();
        }

        return $res;
    }

}

return 'msProductGetAllOptionsProcessor';