<?php

class msDatefieldType extends msOptionType {

    public function getField($field) {
        return "{xtype:'datefield'
            ,format: MODx.config.manager_date_format
            ,startDay: parseInt(MODx.config.manager_week_start)
        }";
    }
}

return 'msDatefieldType';