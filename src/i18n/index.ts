/**
 * i18n – simple language switcher.
 * Only two languages: Vietnamese (VI) and Chinese (ZH).
 */
export type Lang = 'VI' | 'ZH';

// ─── Translation map ────────────────────────────────────────────────────────

type LangMap = Record<string, string>;

const VI: LangMap = {
    // Auth / Login
    'auth.title': 'QUẢN LÝ MUA HÀNG',
    'auth.subtitle': 'Hệ thống Quản lý Mua hàng',
    'auth.user': 'USER',
    'auth.password': 'PASSWORD',
    'auth.language': 'LOGON LANGUAGE',
    'auth.userHint': 'Nhập tài khoản SAP',
    'auth.passwordHint': 'Nhập mật khẩu',
    'auth.languageHint': 'VI / ZH',
    'auth.submit': 'ĐĂNG NHẬP SAP',
    'auth.submitting': 'Đang xử lý…',
    'auth.success': 'Đăng nhập thành công',
    'auth.fail': 'Đăng nhập thất bại. Vui lòng thử lại.',
    'auth.missing': 'Vui lòng điền đầy đủ thông tin',
    'auth.invalidLang': 'Ngôn ngữ không hợp lệ',
    'auth.invalidLangHint': 'VI / ZH',
    'auth.userRequired': 'Vui lòng nhập USER',
    'auth.passwordRequired': 'Vui lòng nhập mật khẩu',
    'auth.wrongUser': 'Tài khoản không đúng',
    'auth.wrongPass': 'Mật khẩu không đúng',

    // Header
    'header.title': 'Quản lý mua hàng',
    'header.subtitle': 'Xưởng bánh gạo',
    'header.import': 'NHẬP',
    'header.logout': 'Đăng xuất',

    // TabNav
    'tab.system': 'Hệ thống',
    'tab.systemShort': 'HT',
    'tab.intime': 'Đúng hạn',
    'tab.intimeShort': 'ĐH',
    'tab.overdue': 'Trễ hạn',
    'tab.overdueShort': 'TH',
    'tab.factory': 'Nhà máy',
    'tab.factoryShort': 'NM',

    // Quick Search
    'quickSearch.placeholder': 'Tìm văn bản ngắn…',
    'quickSearch.clear': 'Xóa tìm kiếm',

    // Filters
    'filter.allCount': 'Tất cả',
    'filter.selected': 'Đã chọn',
    'filter.selectedOf': 'Đã chọn {{selected}}/{{total}}',
    'filter.noOptions': 'Không có tùy chọn',
    'filter.noResults': 'Không có kết quả phù hợp',
    'filter.selectAll': 'Chọn tất cả',
    'filter.confirm': 'Xác nhận',
    'filter.close': 'Đóng',
    'filter.clear': 'Xóa lọc',
    'filter.clearAll': 'Xóa tất cả lọc',
    'filter.requester': 'Ng.yêu cầu:',
    'filter.status': 'T.tr xử lý:',
    'filter.search': 'Tìm nhanh…',
    'filter.persons': '{{count}} người',
    'filter.person': '{{count}} người',

    // Date filter
    'date.from': 'Từ',
    'date.to': 'Đến',
    'date.label': 'Ngày YC:',
    'date.clear': 'Xóa bộ lọc ngày',

    // Empty / No results
    'empty.title': 'Chưa có dữ liệu',
    'empty.hint': 'Nhấn nút NHẬP FILE hoặc kéo thả file Excel (.xlsx, .xls, .csv) vào vùng này.',
    'empty.button': 'Chọn file Excel',
    'empty.note': '💡 Hệ thống sẽ tự động lọc các dòng có TAG-NAME = VN005922.',
    'noresults.filtered': 'Không có dòng nào khớp bộ lọc Ng.yêu cầu ({{count}} người) trong tab này',
    'noresults.tab': 'Không có dữ liệu cho tab này',

    // File import
    'import.extError': 'Chỉ hỗ trợ file .xlsx, .xls, .csv',
    'import.tagMissing': 'Không tìm thấy cột TAG-NAME',
    'import.noRows': 'Không có dòng nào có TAG-NAME = VN005922',
    'import.success': '✓ Đã tải {{count}} dòng (TAG-NAME = VN005922)',
    'import.error': 'Lỗi đọc file: {{msg}}',

    // Misc
    'app.loading': 'Đang tải…',
    'app.logoutSuccess': 'Đã đăng xuất',
};

const ZH: LangMap = {
    // Auth / Login
    'auth.title': '采购管理',
    'auth.subtitle': '采购管理系统',
    'auth.user': '用户',
    'auth.password': '密码',
    'auth.language': '登录语言',
    'auth.userHint': '输入SAP账户',
    'auth.passwordHint': '输入密码',
    'auth.languageHint': 'EN / VI / ZH',
    'auth.submit': 'SAP登录',
    'auth.submitting': '处理中…',
    'auth.success': '登录成功',
    'auth.fail': '登录失败，请重试。',
    'auth.missing': '请填写完整信息',
    'auth.invalidLang': '语言无效',
    'auth.invalidLangHint': 'EN / VI / ZH',
    'auth.userRequired': '请输入用户',
    'auth.passwordRequired': '请输入密码',
    'auth.wrongUser': '账户不正确',
    'auth.wrongPass': '密码不正确',

    // Header
    'header.title': '采购管理',
    'header.subtitle': '饼干工厂',
    'header.import': '导入',
    'header.logout': '退出登录',

    // TabNav
    'tab.system': '系统',
    'tab.systemShort': '系统',
    'tab.intime': '按时',
    'tab.intimeShort': '按时',
    'tab.overdue': '逾期',
    'tab.overdueShort': '逾期',
    'tab.factory': '工厂',
    'tab.factoryShort': '工厂',

    // Quick Search
    'quickSearch.placeholder': '搜索短文本…',
    'quickSearch.clear': '清除搜索',

    // Filters
    'filter.allCount': '全部',
    'filter.selected': '已选',
    'filter.selectedOf': '已选 {{selected}}/{{total}}',
    'filter.noOptions': '无选项',
    'filter.noResults': '无匹配结果',
    'filter.selectAll': '全选',
    'filter.confirm': '确认',
    'filter.close': '关闭',
    'filter.clear': '清除筛选',
    'filter.clearAll': '清除所有筛选',
    'filter.requester': '申请人：',
    'filter.status': '处理状态：',
    'filter.search': '快速搜索…',
    'filter.persons': '{{count}}人',
    'filter.person': '{{count}}人',

    // Date filter
    'date.from': '从',
    'date.to': '至',
    'date.label': '申请日期：',
    'date.clear': '清除日期筛选',

    // Empty / No results
    'empty.title': '暂无数据',
    'empty.hint': '点击"导入文件"按钮或拖放Excel文件（.xlsx、.xls、.csv）到此处。',
    'empty.button': '选择Excel文件',
    'empty.note': '💡 系统将自动筛选TAG-NAME = VN005922的数据行。',
    'noresults.filtered': '此标签页中无符合申请人筛选条件的行（{{count}}人）',
    'noresults.tab': '此标签页无数据',

    // File import
    'import.extError': '仅支持.xlsx、.xls、.csv文件',
    'import.tagMissing': '未找到TAG-NAME列',
    'import.noRows': '无TAG-NAME = VN005922的数据行',
    'import.success': '✓ 已加载{{count}}行（TAG-NAME = VN005922）',
    'import.error': '文件读取错误：{{msg}}',

    // Misc
    'app.loading': '加载中…',
    'app.logoutSuccess': '已退出登录',
};

// ─── Translation function ──────────────────────────────────────────────────

export function t(key: string, lang: Lang, params?: Record<string, string | number>): string {
    const map = lang === 'ZH' ? ZH : VI;
    let text = map[key] ?? key;
    if (params) {
        for (const [k, v] of Object.entries(params)) {
            text = text.replace(`{{${k}}}`, String(v));
        }
    }
    return text;
}
