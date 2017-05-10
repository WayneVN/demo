const STATUS = {
    NEW: 0,
    DONE: 1,
    PROCESSING: 10,
    PROCESSED: 11,
    COMPUTING: 20,
    PARSEERROR:12,
    ERROR:22
};

const RECORD_STATUS = {};
// RECORD_STATUS[STATUS.NEW] = {name: '新上传', icon: 'fa-file'};
// RECORD_STATUS[STATUS.DONE] = {name: '完成', icon: 'fa-check-circle-o'};
// RECORD_STATUS[STATUS.PROCESSING] = {name: '处理中', icon: 'fa-cogs'};
// RECORD_STATUS[STATUS.PROCESSED] = {name: '等待计算', icon: 'fa-cogs'};
// RECORD_STATUS[STATUS.COMPUTING] = {name: '计算中', icon: 'fa-calculator'};
// RECORD_STATUS[STATUS.PARSEERROR] = {name: '解析失败', icon: 'fa-info-circle color-error'};
// RECORD_STATUS[STATUS.ERROR] = {name: '计算失败', icon: 'fa-info-circle color-error'};

RECORD_STATUS[STATUS.NEW] = {name: '计算中', icon: 'fa-calculator'};
RECORD_STATUS[STATUS.DONE] = {name: '完成', icon: 'fa-check-circle-o'};
RECORD_STATUS[STATUS.PROCESSING] = {name: '计算中', icon: 'fa-calculator'};
RECORD_STATUS[STATUS.PROCESSED] = {name: '计算中', icon: 'fa-calculator'};
RECORD_STATUS[STATUS.COMPUTING] = {name: '计算中', icon: 'fa-calculator'};
RECORD_STATUS[STATUS.PARSEERROR] = {name: '计算失败', icon: 'fa-info-circle color-error'};
RECORD_STATUS[STATUS.ERROR] = {name: '计算失败', icon: 'fa-info-circle color-error'};

module.exports = RECORD_STATUS;
