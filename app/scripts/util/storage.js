import $ from 'jquery';
import cookie from 'jquery.cookie';
import store from 'store';

export default class Storage {
    constructor() {
        this.isSupport = store.enabled;
    }
    setStore(key,val){
        if (this.isSupport) {
            this.setStore(key,val);
        } else {
            this.setCookie(key,val);
        }
    }
    getStore(key){
        if (this.isSupport) {
            return this.setStore(key);
        } else {
            return this.getCookie(key);
        }
    }
    removeStore(key){
        if (this.isSupport) {
            return this.removeStore(key);
        } else {
            return this.removeCookie(key);
        }
    }
    setCookie(key,val){
        $.cookie(key, val, { expires: 7, path: '/' });
    }
    setStore(key,val){
        store.set(key, val);
    }
    getCookie(key){
        return $.cookie(key);
    }
    getStore(key){
        return store.get(key);
    }
    removeStore(key){
        store.remove(key);
    }
    removeCookie(key){
        $.removeCookie(key,{path: '/'});
    }
}
