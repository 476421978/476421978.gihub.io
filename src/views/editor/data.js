// excel 文件格式
export const upLoadDataLimit = [
  {
    header: '商品分类',
    title: ['分类排序', '分类名称', '分类描述']
  },
  {
    header: '商品列表',
    title: [
      '商品排序',
      '商品名称',
      '商品份量/口味/制作方法',
      '商品标签',
      '主料',
      '商品描述',
      '图片地址',
      '分类排序',
      '最低购买数量',
      '是否必要商品',
      '商品状态',
      '销售时间',
      '开始时间1',
      '结束时间1',
      '开始时间2',
      '结束时间2',
      '开始时间3',
      '结束时间3'
    ]
  },
  {
    header: '商品规格',
    title: ['商品排序', '规格名称', '价格(元)', '餐盒费(元)', '库存', '开启次日置满']
  },
  {
    header: '商品属性',
    title: ['商品排序', '属性排序', '属性名称']
  },
  {
    header: '商品子属性',
    title: ['商品排序', '属性排序', '子属性排序', '子属性名称']
  }
]

// 测试样式改变
export const classFiledNames = [
  'agent',
  'realName',
  'mobile',
  'cityName',
  'payPrice',
  'incomePrice',
  'taxes',
  'couponPrice',
  'mileageFee',
  'insuranceExpenses',
  'refundPrice',
  'invitationAmount',
  'orderNum'
]

export const columnNames = [
  '所属公司',
  '司机姓名',
  '司机电话',
  '运营城市',
  '乘客付费',
  '司机收入',
  '司机税费',
  '优惠券抵扣',
  '信息费',
  '保险金额',
  '退款金额',
  '营销收入',
  '完成单量'
]

export const list = [
  {
    agent: '番禺测试公司',
    realName: '哈哈',
    mobile: '15111111111',
    cityName: '广州市',
    payPrice: 16,
    incomePrice: 11.76,
    taxes: 0.24,
    couponPrice: 0,
    mileageFee: 2,
    insuranceExpenses: 2,
    refundPrice: 0,
    invitationAmount: 0,
    serviceType: null,
    orderNum: 0,
    startTime: null,
    endTime: null
  },
  {
    agent: '代理人',
    realName: '测评',
    mobile: '15111111111',
    cityName: '深圳市',
    payPrice: 25.2,
    incomePrice: 29.7,
    taxes: 0.3,
    couponPrice: 21.6,
    mileageFee: 3,
    insuranceExpenses: 3,
    refundPrice: 0,
    invitationAmount: 4,
    serviceType: null,
    orderNum: 5,
    startTime: null,
    endTime: null
  },
  {
    agent: '代理人',
    realName: 'xxx',
    mobile: '15111111111',
    cityName: '佛山市',
    payPrice: 18.59,
    incomePrice: 16.42,
    taxes: 0.17,
    couponPrice: 0,
    mileageFee: 1,
    insuranceExpenses: 1,
    refundPrice: 0,
    invitationAmount: 0,
    serviceType: null,
    orderNum: 2,
    startTime: null,
    endTime: null
  }
]
