``` 
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
```

``` 
watch('productSerialize').when('true',function(value){
    setValue('installMethod',{
  		'CBX3-O²':'CVX手车式真空接触器(P=150mm)',
        'CVX-O²':'CVX手车式真空接触器(P=150mm)'
    },value);
})
```