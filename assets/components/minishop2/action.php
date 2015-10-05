<?php

if (empty($_REQUEST['action']) && empty($_REQUEST['ms2_action'])) {
	die('Access denied');
}

if (!empty($_REQUEST['action'])) {$_REQUEST['ms2_action'] = $_REQUEST['action'];}

require_once dirname(dirname(dirname(__DIR__))).'/config.core.php';
require_once MODX_CORE_PATH.'config/'.MODX_CONFIG_KEY.'.inc.php';
require MODX_BASE_PATH.'index.php';