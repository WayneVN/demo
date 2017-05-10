import SubStore from '../stores/SubStore';
import SubActions from '../actions/SubActions';
import AlertActions from '../actions/AlertActions';
const TallyModal = require('../model/tallyModal');

export default class AutoRefresh {
    constructor(url,data) {
        this.url = url;
        this.data = data;
        this.currentUrl = window.location.href.split('#');//当前所处页面url
        this.clearTime = 1;//定时器
        clearInterval(this.clearTime);
        this.init();
    }
    init() {
        if (this.currentUrl.length == 2 &&
            this.url.split('?')[0] == '/tally-api/record-info'
            ) {
                let userId = this.url.split('?')[1].split('=');
                switch (this.currentUrl[1].split('/').pop()) {
                    case 'tally':
                    case 'daily':
                    case 'sum':
                    case 'property':
                        this.isDone(userId);
                    break;
                }
        }
    }
    isDone(list) {
        let {
            data,
            clearTime,
        } = this;
        if (data.record == [] || data.record.status != 1 && data.record.status != 12 && data.record.status != 22 ) {
            AlertActions.open('warning','分析中','分析完成后将自动刷新。');
            clearTime = setInterval(() => {
                TallyModal.get(this.url,result=>{
                    if (result.record.status == 1 || result.record.status == 12 || result.record.status == 22 ) {
                        clearInterval(clearTime);
                        window.location.reload();
                    }
                });
            }, 2000);
        } else {
            AlertActions.open('clear','','');
        }
    }
}
