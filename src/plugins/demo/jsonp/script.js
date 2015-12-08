/**/
angular.callbacks._0({
    form: {
        schema: {
            type: 'object',
            properties: {
                'customer': {
                    title: '订货单位',
                    type: 'string'
                },
                'project': {
                    title: '项目名称',
                    type: 'string'
                },
                'orderNo': {
                    title: '客户订单号',
                    type: 'string'
                },
                'productSerialize': {
                    type: 'string',
                    title: '产品系列(1)',
                    required: true
                },
                'installMethod': {
                    type: 'string',
                    title: '安装方式(2)',
                    required: true
                },
                'ratedVoltage': {
                    type: 'string',
                    title: '额定电压(3)',
                    required: true
                },
                'standard': {
                    type: 'string',
                    title: '标准(4)',
                    required: true
                },
                'electricCurrent': {
                    title: '接触器额定电流(5)',
                    'default': '400A',
                    type: 'string',
                    required: true
                },
                'maxCurrent': {
                    title: '组合电器最大额定电流(6)',
                    type: 'string'
                },
                'exceptionCurrent': {
                    title: '额定短时耐受电流(7)',
                    'default': '4kA/4s',
                    type: 'string',
                    required: true
                },
                'keepMethod': {
                    title: '保持方式(8)',
                    type: 'string',
                    required: true
                },
                'HC': {
                    title: '合闸线圈(HC)(9)',
                    type: 'string',
                    required: true
                },
                'trippingCoilHC': {
                    title: '分闸线圈(TC)(电保持无此项)(10)',
                    type: 'string'
                },
                'secondConnector': {
                    title: '二次接线(11)',
                    type: 'string',
                    required: true
                },
                'reportLang': {
                    title: '铭牌报告语言(12)',
                    type: 'string',
                    required: true
                },
                'vehicleType': {
                    title: '底盘车类型(13)',
                    type: 'string'
                },
                'vehicleTypeCurrent': {
                    title: '底盘车操作电压(电动专用)(14)',
                    type: 'string'
                },
                'groundingMethod': {
                    title: '接地方式(15)',
                    type: 'string'
                },
                'breakType': {
                    title: '熔断器类型(16)',
                    type: 'string',
                    'default': 'DIN L=292mm'
                },
                'breakMaxCurrent': {
                    title: '熔断器最大额定电流(17)',
                    type: 'string'
                },
                'lockMode': {
                    title: '柜门联锁方式 (18)',
                    type: 'string'
                },
                'extraRequirements': {
                    title: '其他特殊要求',
                    type: 'string'
                },
                'quantity': {
                    title: '数量',
                    type: 'number'
                }
            }
        },
        form: [{
            type: "group",
            title: "基本配置",
            items: [
                {
                    type: "columns",
                    items: [
                        {
                            key: 'productSerialize',
                            titleMap: [
                                {name: 'CBX3-O²', value: 'CBX3-O²'},
                                {name: 'CVX-O²', value: 'CVX-O²'}
                            ],
                            type: 'radios-inline'
                        }, {
                            key: 'quantity',
                            type: 'number',
                            htmlClass: 'quantity'
                        }
                    ],
                    singleLine: true
                },
                {
                    key: 'installMethod',
                    singleLine: true,
                    titleMap: [
                        {name: 'CBX固定式真空接触器(P=150mm)', value: 'CBX固定式真空接触器(P=150mm)'},
                        {name: 'CVX手车式真空接触器(P=150mm)', value: 'CVX手车式真空接触器(P=150mm)'}
                    ],
                    type: 'radios-inline'
                },
                {
                    key: 'ratedVoltage',
                    singleLine: true,
                    titleMap: [
                        {name: '7.2kV', value: '7.2kV'},
                        {name: '12kV', value: '12kV'}
                    ],
                    type: 'radios-inline'
                },
                {
                    key: 'standard',
                    singleLine: true,
                    titleMap: [
                        {name: 'IEC 60470', value: 'IEC 60470'},
                        {name: 'GB/T 14808', value: 'GB/T 14808'}
                    ],
                    type: 'radios-inline'
                },
                {
                    key: 'electricCurrent',
                    singleLine: true,
                    titleMap: [
                        {name: '400A', value: '400A'}
                    ],
                    type: 'radios-inline'
                },
                {
                    key: 'maxCurrent',
                    singleLine: true,
                    titleMap: [
                        {name: '250A(7.2kV)', value: '250A(7.2kV)'},
                        {name: '160A(12kV)', value: '160A(12kV)'}
                    ],
                    type: 'radios-inline'
                },
                {
                    key: 'exceptionCurrent',
                    singleLine: true,
                    titleMap: [
                        {name: '4kA/4s', value: '4kA/4s'}
                    ],
                    type: 'radios-inline'
                },
                {
                    key: 'keepMethod',
                    singleLine: true,
                    titleMap: [
                        {name: '电保持(E)', value: '电保持(E)'},
                        {name: '机械保持(M)', value: '机械保持(M)'}
                    ],
                    type: 'radios-inline'
                },
                {
                    key: 'HC',
                    singleLine: true,
                    titleMap: [
                        {name: 'DC220V', value: 'DC220V'},
                        {name: 'DC110V', value: 'DC110V'},
                        {name: 'AC220V', value: 'AC220V'},
                        {name: 'AC110V', value: 'AC110V'},
                        {name: '其它', value: ' ', input: true}
                    ],
                    type: 'radios-inline'
                },
                {
                    key: 'trippingCoilHC',
                    singleLine: true,
                    titleMap: [
                        {name: 'DC220V', value: 'DC220V'},
                        {name: 'DC110V', value: 'DC110V'},
                        {name: 'AC220V', value: 'AC220V'},
                        {name: 'AC110V', value: 'AC110V'},
                        {name: '其它', value: ' ', input: true}
                    ],
                    type: 'radios-inline'
                },
                {
                    key: 'secondConnector',
                    singleLine: true,
                    titleMap: [
                        {name: '标准', value: '标准', optional: true},
                        {name: '非标准', value: '非标准', input: true}
                    ],
                    type: 'radios-inline'
                },
                {
                    key: 'reportLang',
                    singleLine: true,
                    titleMap: [
                        {name: '中文', value: '中文'},
                        {name: '英文', value: '英文'},
                        {name: '其它', value: ' ', input: true}
                    ],
                    type: 'radios-inline'
                }
            ]
        },
            {
                type: "group",
                title: "可选配置",
                items: [
                    {
                        key: 'vehicleType',
                        singleLine: true,
                        titleMap: [
                            {name: '手动推进', value: '手动推进'},
                            {name: '电动推进(需额外收费)', value: '电动推进(需额外收费)'}
                        ],
                        type: 'radios-inline'
                    },
                    {
                        key: 'vehicleTypeCurrent',
                        singleLine: true,
                        titleMap: [
                            {name: 'DC220V', value: 'DC220V'},
                            {name: 'DC110V', value: 'DC110V'},
                            {name: 'DC48V ', value: 'DC48V '},
                            {name: '其它', value: ' ', input: true}
                        ],
                        type: 'radios-inline'
                    },
                    {
                        key: 'groundingMethod',
                        singleLine: true,
                        titleMap: [
                            {name: '手车底部铜排接地', value: '手车底部铜排接地'},
                            {name: '手车两侧触头接地', value: '手车两侧触头接地'},
                            {name: '其它', value: ' ', input: true}
                        ],
                        type: 'radios-inline'
                    },
                    {
                        key: 'breakType',
                        singleLine: true,
                        titleMap: [
                            {name: 'DIN L=292mm', value: 'DIN L=292mm'}
                        ],
                        type: 'radios-inline'
                    },
                    {
                        key: 'breakMaxCurrent',
                        singleLine: true,
                        titleMap: [
                            {name: '315A(7.2 kV)', value: '315A(7.2 kV)'},
                            {name: '200A(12 kV)', value: '200A(12 kV)'},
                            {name: '其它', value: ' ', input: true}
                        ],
                        type: 'radios-inline'
                    },
                    {
                        key: 'lockMode',
                        singleLine: true,
                        titleMap: [
                            {name: '关门联锁', value: '关门联锁'},
                            {name: '非关门联锁', value: '非关门联锁'}
                        ],
                        type: 'radios-inline'
                    }]
            },
            {
                type: "group",
                title: "特殊配置",
                items: [
                    {
                        key: 'extraRequirements',
                        title: '其他特殊要求',
                        type: "textarea",
                        singleLine: true
                    }
                ]
            }
        ],
        model: {}
    },
    script: function () {
        var self = this,
            watch = this.watch,
            getValue = this.getValue,
            setValue = this.setValue,
            setStatus = this.setStatus;

        //1、(2)中“CBX固定式真空接触器(P=150mm)”在(1)中选择“CBX3-O2”时默认选此项。
        //(2)中“CVX手车式真空接触器(P=150mm)”在(1)中选择“CVX-O2”时默认选此项。
        watch('productSerialize').change(function (selectedValue) {
            setValue('installMethod', {
                'CBX3-O²': 'CBX固定式真空接触器(P=150mm)',
                'CVX-O²': 'CVX手车式真空接触器(P=150mm)'
            }, selectedValue);
            setStatus('installMethod', 'readonly', true);
        });

        //2、当(8)选择“电保持（E）”时，(10)项不可选；当(8)选择“机械保持（M）”时，(10)项为必选。
        watch('keepMethod').change(function (selectedValue) {
            if (selectedValue == '电保持(E)') {
                setValue('trippingCoilHC', null, '');
                setStatus('trippingCoilHC', 'readonly', true);
                setStatus('trippingCoilHC', 'required', false);
            } else if (selectedValue == '机械保持(E)') {
                setStatus('trippingCoilHC', 'readonly', false);
                setStatus('trippingCoilHC', 'required', true);
            } else {
                setStatus('trippingCoilHC', 'readonly', false);
            }
        });

        //3、当(4)选择“IEC 60470”时，(12)项默认选“英文”；(4)选择“GB/T 14808”时，(12)项默认选“中文”。
        watch('standard').change(function (selectedValue) {
            setValue('reportLang', {
                'IEC 60470': '英文',
                'GB/T 14808': '中文'
            }, selectedValue);
        });

        //4、(1)- (5)，(7)- (9)，(11)- (12)为必选项。(5) (7)默认选择唯一项。
        /*===============直接设置schema 的 required 与 default 值 ============================================*/

        //5、当(1)中选择“CVX-O2”时，(6)，(13)，(15)- (18)为必选项，(16)默认选择唯一项。
        //(14)在(13)项中选择“电动推进(需额外收费)”时为必选，在(13)项中选择“手动推进”时不可选。
        //当(1)中选择“CBX3-O2”时，(6)，(13)- (18)不可选。
        watch('productSerialize').change(function (selectedValue) {
            if (selectedValue == 'CVX-O²') {

                setStatus('maxCurrent', 'required', true);
                setStatus('vehicleType', 'required', true);
                setStatus('groundingMethod', 'required', true);
                setStatus('breakType', 'required', true);
                setStatus('breakMaxCurrent', 'required', true);
                setStatus('lockMode', 'required', true);

                setStatus('maxCurrent', 'readonly', false);
                setStatus('vehicleType', 'readonly', false);
                setStatus('groundingMethod', 'readonly', false);
                setStatus('breakType', 'readonly', false);
                setStatus('breakMaxCurrent', 'readonly', false);
                setStatus('lockMode', 'readonly', false);

            } else if (selectedValue == 'CBX3-O²') {

                setStatus('maxCurrent', 'required', false);
                setStatus('vehicleType', 'required', false);
                setStatus('groundingMethod', 'required', false);
                setStatus('breakType', 'required', false);
                setStatus('breakMaxCurrent', 'required', false);
                setStatus('lockMode', 'required', false);

                //(6)，(13)- (18)不可选
                setStatus('maxCurrent', 'readonly', true);
                setStatus('vehicleType', 'readonly', true);
                setStatus('groundingMethod', 'readonly', true);
                setStatus('breakType', 'readonly', true);
                setStatus('breakMaxCurrent', 'readonly', true);
                setStatus('lockMode', 'readonly', true);

                //(6)，(13)- (18) 清空值
                setValue('maxCurrent', null, null);
                setValue('vehicleType', null, null);
                setValue('groundingMethod', null, null);
                setValue('breakType', null, null);
                setValue('breakMaxCurrent', null, null);
                setValue('lockMode', null, null);
            }
        });

        //(14)在(13)项中选择“电动推进(需额外收费)”时为必选，在(13)项中选择“手动推进”时不可选。
        watch('vehicleType').change(function (selectedValue) {
            if (getValue('productSerialize') == 'CVX-O²' && selectedValue == "电动推进(需额外收费)") {
                setStatus('vehicleTypeCurrent', 'required', true);
                setStatus('vehicleTypeCurrent', 'readonly', false);
            } else if (getValue('productSerialize') == 'CVX-O²' && selectedValue == "手动推进") {
                setStatus('vehicleTypeCurrent', 'required', false);
                setValue('vehicleTypeCurrent', null, null);
                setStatus('vehicleTypeCurrent', 'readonly', true);
            }
        });

        //6、当(1)选择“CVX-O2”，(3)选择“7.2kV”时，(6)默认选“250A(7.2kV)”，(17)默认选“315A(7.2 kV)”。
        //当(1)选择“CVX-O2”，(3)选择“12kV”时，(6)默认选“160A(12kV)”，(17)默认选“200A(12 kV)”。
        watch('ratedVoltage').change(function (selectedValue) {

            if (getValue('productSerialize') == 'CVX-O²') {
                setValue('maxCurrent', {
                    '7.2kV': '250A(7.2kV)',
                    '12kV': '160A(12kV)'
                }, selectedValue);

                setValue('breakMaxCurrent', {
                    '7.2kV': '315A(7.2 kV)',
                    '12kV': '200A(12 kV)'
                }, selectedValue);
            }
        });
    }
});