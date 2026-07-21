export default {
  // Empty state
  'empty.title': '暂无数据',
  'empty.hint': '请导入 Excel 文件以开始',
  'empty.button': '导入文件',
  'empty.note': '💡 导入文件以查看各车间数据。',

  // Import
  'import.noRows': '文件中无数据行',
  'import.success': '✓ 已加载{{count}}行',
  'import.extError': '不支持的文件格式（仅 .xlsx、.xls、.csv）',
  'import.tagMissing': '未找到 TAG-NAME 列',
  'import.error': '读取文件错误：{{msg}}',

  // Header
  'header.title': '采购管理',
  'header.subtitle': '米果厂',
  'header.import': '导入文件',
  'header.logout': '登出',

  // Actions
  'action.settings': '设置',
  'action.admin': '管理',
  'action.profile': '个人资料',

  // Sidebar
  'sidebar.home': '主页',
  'sidebar.system_orders': '系统订单',
  'sidebar.material_code': '物料代码',
  'sidebar.purchase_request': '采购申请',
  'sidebar.new_features': '新功能',
  'sidebar.processed_orders': '处理中的采购单',
  'sidebar.notifications': '通知',

  // Tabs
  'tab.system': '系统',
  'tab.ariaLabel': '数据筛选',

  // QuickSearch
  'quickSearch.placeholder': '快速搜索（短文本）…',
  'quickSearch.clear': '清除搜索',

  // Filters
  'filter.requester': '申请人',
  'filter.status': '处理状态',
  'filter.allCount': '全部',
  'filter.selected': '已选',
  'filter.selectedOf': '已选 {{selected}}/{{total}}',
  'filter.persons': '{{count}} 人',
  'filter.search': '搜索…',
  'filter.searchAria': '快速搜索申请人',
  'filter.selectAll': '全选',
  'filter.confirm': '确认',
  'filter.close': '关闭',
  'filter.clear': '清除筛选',
  'filter.clearSearch': '清除搜索',
  'filter.clearAll': '清除全部筛选',
  'filter.noResults': '无结果',
  'filter.noOptions': '无可选项',

  // Date range
  'date.label': '申请日期',
  'date.from': '从',
  'date.to': '至',
  'date.clear': '清除日期筛选',

  // No results
  'noresults.tab': '请选择车间以显示数据',
  'noresults.filtered': '已筛选 {{count}} 位申请人 — 无结果',

  // App
  'app.logoutSuccess': '已退出',

  // Details
  'detail.title': '需求详情',
  'detail.imageArea': '物资图片区域',
  'detail.noCode': '暂无物资代码',
  'detail.uploading': '上传中...',
  'detail.changeImage': '更改图片',
  'detail.uploadImage': '上传图片',
  'detail.close': '关闭',
  'detail.button': '详情',
  'detail.id': '需求',
  'detail.material': '物资',
  'detail.qty': '数量',
  'detail.requester': '需求人',
  'detail.date': '需求日期',
  'detail.workshop': '车间',
  'detail.unnamed': '未命名物资',
  'detail.uploadError': '上传图片时发生错误，请重试。',
  'detail.errorTitle': '上传图片错误:',
  'detail.noData': '暂无数据显示。',

  // FilterBar
  'filter.use': '使用筛选',

  // Columns
  'col.Yc.m.hàng': '采购申请',
  'col.Vật tư': '物料',
  'col.Văn bản ngắn': '短文本',
  'col.Ng.yêu cầu': '申请人',
  'col.Số lượng': '数量',
  'col.Ngày YC': '申请日期',
  'col.T.trg xử lý': '处理状态',

  // Workshop Filter
  'filter.workshop': '车间',
  'filter.workshops': '{{count}} 车间',

  // Workshop Panel
  'workshop.panelTitle': '车间设置',
  'workshop.listTitle': '车间列表',
  'workshop.addNew': '新增车间',
  'workshop.namePlaceholder': '车间名称...',
  'workshop.tagsPlaceholder': 'TAG-NAME（逗号分隔）...',
  'workshop.noTags': '暂无 TAG-NAME',
  'workshop.orphanedTitle': '未分配 TAG-NAME',
  'workshop.selectWorkshop': '选择车间',
  'workshop.assign': '分配',

  // Home Page
  'home.hero.title': '采购管理',
  'home.hero.subtitle': '新时代',
  'home.hero.description': '自动化核对，智能分配并消除人工操作。您供应链流程的全景图。',
  'home.hero.cta': '开始工作',
  
  'home.feature.sync.title': '订单自动核对',
  'home.feature.sync.desc': '智能算法自动检测已处理完成并从原始报告中消失的订单。无需手动检查即可管理订单状态。',
  'home.feature.sync.link': '查看已处理订单列表',
  
  'home.feature.import.title': '超速导入',
  'home.feature.import.desc': '拖放直接从 SAP 系统导出的 Excel 文件。应用程序瞬间自动提取、着色并重构数据。',
  
  'home.feature.allocation.title': '车间自动分配',
  'home.feature.allocation.desc': '智能识别物料代码。自动将订单分组到正确的车间，无需手动分类。',
  
  'home.feature.visual.title': '直观可视管理',
  'home.feature.visual.desc': '为每种物料附加实际照片。消除因 SAP 上文本描述不直观而导致采购错误商品的风险。',
  
  'home.feature.multi.title': '多设备与多语言',
  'home.feature.multi.desc': '在移动设备上流畅响应体验。支持越南语和中文双语，优化国际工作流程。',

  // Processed Orders
  'processed.subtitle': '已从系统文件中消失的订单列表（已处理完毕）。',
  'processed.back_home': '返回主页',
  'processed.loading': '数据加载中...',
  'processed.empty.title': '暂无消失的订单。',
  'processed.empty.subtitle': '当您导入新文件时，系统将自动核对并更新此列表。',
  'processed.col.disappear_time': '消失时间',
  'processed.col.status': '状态',
};
