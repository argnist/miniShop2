<?php
/**
 * Get a list of SKU
 *
 * @package minishop2
 * @subpackage processors
 */
class msSKUGetListProcessor extends modObjectGetListProcessor {
	public $classKey = 'msProductData';
	public $languageTopics = array('default','minishop2:product');
	public $defaultSortField = 'id';
	public $defaultSortDirection  = 'ASC';
//	public $parent = 0;
//
//
	/** {@inheritDoc} */
	public function initialize() {
		if (!$this->getProperty('limit')) {$this->setProperty('limit', 20);}

		return parent::initialize();
	}


	/** {@inheritDoc} */
	public function prepareQueryBeforeCount(xPDOQuery $c) {
        $productId = $this->getProperty('product', 0);
		$c->where(array('product_id' => $productId));
		return $c;
	}
//
//
//	/** {@inheritDoc} */
//	public function prepareQueryAfterCount(xPDOQuery $c) {
//		$c->groupby($this->classKey.'.id');
//		return $c;
//	}
//
//
//	/** {@inheritDoc} */
//	public function getData() {
//		$data = array();
//		$limit = intval($this->getProperty('limit'));
//		$start = intval($this->getProperty('start'));
//
//		/* query for chunks */
//		$c = $this->modx->newQuery($this->classKey);
//		$c = $this->prepareQueryBeforeCount($c);
//		$data['total'] = $this->modx->getCount($this->classKey,$c);
//		$c = $this->prepareQueryAfterCount($c);
//
//		$sortClassKey = $this->getSortClassKey();
//		$sortKey = $this->modx->getSelectColumns($sortClassKey,$this->getProperty('sortAlias',$sortClassKey),'',array($this->getProperty('sort')));
//		if (empty($sortKey)) $sortKey = $this->getProperty('sort');
//		$c->sortby($sortKey,$this->getProperty('dir'));
//		if ($limit > 0) {
//			$c->limit($limit,$start);
//		}
//
//		if ($c->prepare() && $c->stmt->execute()) {
//			$data['results'] = $c->stmt->fetchAll(PDO::FETCH_ASSOC);
//		}
//
//		return $data;
//	}
//
//
//	/** {@inheritDoc} */
//	public function iterate(array $data) {
//		$list = array();
//		$list = $this->beforeIteration($list);
//		$this->currentIndex = 0;
//		/** @var xPDOObject|modAccessibleObject $object */
//		foreach ($data['results'] as $array) {
//			$list[] = $this->prepareArray($array);
//			$this->currentIndex++;
//		}
//		$list = $this->afterIteration($list);
//		return $list;
//	}
//
//
//	/** {@inheritDoc} */
//	public function prepareArray(array $resourceArray) {
//		if ($this->getProperty('combo')) {
//			$resourceArray['parents'] = array();
//			$parents = $this->modx->getParentIds($resourceArray['id'], 2, array('context' => $resourceArray['context_key']));
//			if (empty($parents[count($parents) - 1])) {
//				unset($parents[count($parents) - 1]);
//			}
//			if (!empty($parents) && is_array($parents)) {
//				$q = $this->modx->newQuery('msCategory', array('id:IN' => $parents));
//				$q->select('id,pagetitle');
//				if ($q->prepare() && $q->stmt->execute()) {
//					while ($row = $q->stmt->fetch(PDO::FETCH_ASSOC)) {
//						$key = array_search($row['id'], $parents);
//						if ($key !== false) {
//							$parents[$key] = $row;
//						}
//					}
//				}
//				$resourceArray['parents'] = array_reverse($parents);
//			}
//		}
//		else {
//			if ($resourceArray['parent'] != $this->parent) {
//				$resourceArray['cls'] = 'multicategory';
//				$resourceArray['category_name'] = $resourceArray['category_pagetitle'];
//			}
//			else {
//				$resourceArray['cls'] = $resourceArray['category_name'] = '';
//			}
//
//			$resourceArray['price'] = round($resourceArray['price'],2);
//			$resourceArray['old_price'] = round($resourceArray['old_price'],2);
//			$resourceArray['weight'] = round($resourceArray['weight'],3);
//
//			$this->modx->getContext($resourceArray['context_key']);
//			$resourceArray['preview_url'] = $this->modx->makeUrl($resourceArray['id'],$resourceArray['context_key']);
//
//			$resourceArray['actions'] = array();
//
//			$resourceArray['actions'][] = array(
//				'className' => 'edit',
//				'text' => $this->modx->lexicon('ms2_product_edit'),
//			);
//
//			$resourceArray['actions'][] = array(
//				'className' => 'view',
//				'text' => $this->modx->lexicon('ms2_product_view'),
//			);
//			if (!empty($resourceArray['deleted'])) {
//				$resourceArray['actions'][] = array(
//					'className' => 'undelete green',
//					'text' => $this->modx->lexicon('ms2_product_undelete'),
//				);
//			} else {
//				$resourceArray['actions'][] = array(
//					'className' => 'delete',
//					'text' => $this->modx->lexicon('ms2_product_delete'),
//				);
//			}
//			if (!empty($resourceArray['published'])) {
//				$resourceArray['actions'][] = array(
//					'className' => 'unpublish',
//					'text' => $this->modx->lexicon('ms2_product_unpublish'),
//				);
//			} else {
//				$resourceArray['actions'][] = array(
//					'className' => 'publish orange',
//					'text' => $this->modx->lexicon('ms2_product_publish'),
//				);
//			}
//		}
//
//		return $resourceArray;
//	}

}

return 'msSKUGetListProcessor';