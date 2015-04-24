<?php

class msProductAutocompleteProcessor extends modObjectProcessor {


	/** {@inheritDoc} */
	public function process() {
		$name = trim($this->getProperty('name'));
		$query = trim($this->getProperty('query'));

		if (!$name) {
			return $this->failure('ms2_product_autocomplete_err_noname');
		}

		$res = array();
		if (!empty($query)) {
            $metadata = array_merge($this->modx->getFieldMeta('msProduct'), $this->modx->getFieldMeta('msProductData'));
            $isOption = (isset($metadata[$name]) && in_array($metadata[$name]['phptype'], array('json','array'))) || !isset($metadata[$name]);

			$c = $this->modx->newQuery('msProduct', array('class_key' => 'msProduct'));
			$c->leftJoin('msProductData', 'Data', 'Data.product_id = msProduct.id');

            if ($isOption) {
                $c->leftJoin('msProductOption', 'ProductOption', 'Data.id = ProductOption.product_id');
                $c->select('ProductOption.value AS ' . $name);
                $c->sortby('ProductOption.value','ASC');
                $c->groupby('ProductOption.value');
                $c->where("`ProductOption`.`key`='{$name}' AND `ProductOption`.`value` LIKE '%{$query}%'");
            } else {
                $c->select($name);
                $c->where("$name LIKE '%{$query}%'");
                $c->sortby($name,'ASC');
                $c->groupby($name);
            }

            $c->prepare();
            $this->modx->log(1, $c->toSQL());
			$found = 0;
			if ($c->prepare() && $c->stmt->execute()) {
				$res = $c->stmt->fetchAll(PDO::FETCH_ASSOC);
				foreach ($res as $v) {
					if ($v[$name] == $query) {$found = 1;}
				}
			}
			else {$res = array();}

			if (!$found) {
				$res = array_merge_recursive(array(array($name => $query)), $res);
			}
		}

		return $this->outputArray($res);
	}

}

return 'msProductAutocompleteProcessor';