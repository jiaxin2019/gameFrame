import HttpService from '../network/HttpService';
import { ListenerManager } from '../manager/ListenerManager';
import { handler } from '../Util';

export default class BaseController {

	//model 监听事件使用
	private _dict: any;

	public constructor() {
		this._dict = {};
	}

	/**
	 * 添加消息监听
	 * @param key 消息的唯一标识
	 * @param listener 侦听函数
	 * @param listenerObj 侦听函数所属的对象
	*/
	public addEventListen(key: string, listener: Function, listenerObj: any): void {
		if (listenerObj.setEventModel != null) {
			listenerObj.setEventModel.apply(listenerObj, [this]);
		}

		let arr: Array<any> = this._dict[key];
		if (arr == null) {
			arr = [];
			this._dict[key] = arr;
		}

		//检测是否已经存在
		let i: number = 0;
		let len: number = arr.length;
		for (i; i < len; i++) {
			if (arr[i][0] == listener && arr[i][1] == listenerObj) {
				return;
			}
		}
		arr.push([listener, listenerObj]);
	}

	/**
	 * 移除消息监听
	 * @param key 消息的唯一标识
	 * @param listener 侦听函数
	 * @param listenerObj 侦听函数所属的对象
	*/
	public removeEventListener(key: string, listener: Function, listenerObj: any): void {
		if (!this._dict[key]) {
			return;
		}
		let arr: Array<any> = this._dict[key];
		let len = arr.length;
		for (let i = 0; i < len; i++) {
			if (arr[i][0] == listener && arr[i][1] == listenerObj) {
				arr.splice(i, 1);
				return;
			}
		}
		if (arr.length <= 0) {
			this._dict[key] = null;
			delete this._dict[key];
		}
	}

	/**
	 * 移除当前对象所有消息监听
	 * @param listenerObj 侦听函数所属的对象
	*/
	public removeAll(listenerObj: any): void {
		let keys = Object.keys(this._dict);
		let len = keys.length;
		for (let i = 0; i < len; i++) {
			let key = keys[i];
			let eventArr: [any] = this._dict[key];
			for (let j = 0; j < eventArr.length; j++) {
				if (eventArr[j][1] == listenerObj) {
					eventArr.splice(i, 1);
					return;
				}
			}

			if (eventArr.length <= 0) {
				this._dict[key] = null;
				delete this._dict[key];
			}
		}

	}

	/**
	 * 触发消息监听
	 * @param key 消息的唯一标识
	 * @param param 消息参数
	*/
	public dispatch(key: string, ...param: any[]): void {
		if (this._dict[key] == null) {
			return;
		}

		let liseners: Array<any> = this._dict[key];
		let lisener: Array<any> = null!;
		for (let i = 0; i < liseners.length; i++) {
			lisener = liseners[i];
			lisener[0].apply(lisener[1], param);
		}
	}

	/**
	 * 发出其他模块信息
	 * @param controllerKey 模块标识
	 * @param key 位置标识
	 * @param param 所需参数
	*/
	public applyControllerFunc(controllerKey: number, key: string, ...param: any[]): any {
		// return App.CtrlMgr.applyFunc.apply(App.CtrlMgr, arguments);
	}

	/**
	 * 移除从http服务器返回的updata消息
	 * @param key 消息标识 
	 * @param callbackFunc 
	 * @param callbackObj
	 * 
	 * */
	public removeServerHttpUpdateMsg(key: any, callbackFunc: Function, callbackObj: any): void {
		let manager = ListenerManager.ins() as any;
		manager.remove(key + "_HttpUpdate", callbackFunc, callbackObj);
	}

	/**
	 * 注册从http服务器返回Update的消息
	 * @param key 消息标识 
	 * @param callbackFunc 
	 * @param callbackObj
	 * 
	 * */
	public addServerHttpUpdateMsg(key: any, callbackFunc: Function, callbackObj: any): void {
		ListenerManager.ins().add(key + "_HttpUpdate", callbackFunc, callbackObj);
	}

	/**
	 * 注册从http服务器返回Update的消息，仅一次，执行完成后移除
	 * @param key 消息标识 
	 * @param callbackFunc 
	 * @param callbackObj
	 * 
	 * */
	public addServerHttpUpdateMsgOnce(key: any, callbackFunc: Function, callbackObj: any, resultParam: any): void {
		let callback: Function = (param: any): void => {
			this.removeServerHttpUpdateMsg(key, callback, this);
			param.param = resultParam;
			callbackFunc.apply(callbackObj, [param]);
		}
		this.addServerHttpUpdateMsg(key, callbackFunc, callbackObj);
	}


	/**发送消息到http服务器
	 * @param url 路径：http://mobile.gomeuat.com.cn/wap/member/activity/goldCoinActivity/userGoldCoinsInfo.jsp
	 * @param params 参数：对象形式的：{ data: {} }
	 * @param headers 头部信息 对象形式
	 * @param callback 请求返回的回调
	 * @param host 
	 * @param callParam : 回调时候自己传递的参数信息
	*/
	public sendHttpPost(url: string, params = { data: {} }, headers = {}, callback: Function = null!, host: any = null, callParam = null): void {
		let hand: handler = new handler()
		hand.init(callback, host, callParam);
		HttpService.ins.doPost(url, headers, params, hand);
	}

	/**发送消息到http服务器
	 * @param url 路径：http://mobile.gomeuat.com.cn/wap/member/activity/goldCoinActivity/userGoldCoinsInfo.jsp
	* @param params 参数：对象形式的：{ data: {} }
	* @param headers 头部信息 对象形式
	* @param callback 请求返回的回调
	* @param host 
	* @param callParam : 回调时候自己传递的参数信息
	*/
	public sendHttpGet(url: string, callback: Function = null!, params = { data: {} }, headers = {}, host: any = null, callParam = null, judgeFail = false): void {
		let hand: handler = new handler()
		hand.init(callback, host, callParam);
		HttpService.ins.doGet(url, headers, params, hand, judgeFail);
	}
	/**发送消息到http服务器
	 * @param type 消息标识 例如：User.login
	 * @param paramObj 消息参数 例如： var paramObj:any = {"uName":uName,"uPass":uPass};
	*/
	// public sendHttpMsg(type: string, paramObj: any = null, callbackFunc: Function = null!, callbackObj: any = null!, param = null): void {
	// 	if (callbackFunc != null) {
	// 		this.addServerHttpUpdateMsgOnce(type, callbackFunc, callbackObj, param);
	// 	}
	// 	var _callback: ($isSucc: boolean, _http: Http, $data: any) => void = null!;

	// 	HttpService.ins().send(type, paramObj, _callback, callbackObj);
	// }
}