export default class DateManager {
	private static _ins: DateManager = null!;
	/**
	 * 获取一个单例
	 * @return {any}
	 */
	static get ins(): DateManager {
		DateManager._ins || (DateManager._ins = new DateManager());
		return DateManager._ins;
	}
	/*一秒的 毫秒数*/
	public static MS_PER_SECOND = 1000;
	/*一分钟 的毫秒数*/
	public static MS_PER_MINUTE = 60 * 1000;
	/*一小时钟 的毫秒数*/
	public static MS_PER_HOUR = 60 * 60 * 1000;
	/*一天 的毫秒数*/
	public static MS_PER_DAY = 24 * 60 * 60 * 1000;

	public static _date = new Date;
	public static timeArr = [1, DateManager.MS_PER_SECOND, DateManager.MS_PER_MINUTE, DateManager.MS_PER_HOUR, DateManager.MS_PER_DAY];

	public constructor() {
	}

	/**
	 * 根据秒数格式化字符串
	 * @param second 秒数
	 * @param type 1:00:00
	*/
	public getFormatBySecond(second: number, type: number = 1): string {
		var o = "";
		switch (type) {
			case 1:
				o = this.getFormatBySecond1(second);
				break;
			case 2:
				o = this.getFormatBySecond2(second);
				break;
			case 3:
				o = this.getFormatBySecond3(second);
				break;
			case 4:
				o = this.getFormatBySecond4(second);
				break;
			case 5:
				o = this.getFormatBySecond5(second);
				break;
			case 6:
				o = this.getFormatBySecond6(second);
				break;
			case 7:
				o = this.getFormatBySecond7(second);
				break;
			case 8:
				o = this.getFormatBySecond8(second);
				break;
			case 9:
				o = this.getFormatBySecond9(second);
				break;
			case 10:
				o = this.getFormatBySecond10(second);
				break;
			case 11:
				o = this.getFormatBySecond11(second);
				break;
			case 12:
				o = this.getFormatBySecond12(second);
				break;
			case 13:
				o = this.getFormatBySecond13(second);
				break;
			case 15:
				o = this.getFormatBySecond15(second);
				break;
			case 16:
				o = this.getFormatBySecond16(second);
				break;
			case 17:
				o = this.getFormatBySecond17(second);
				break;
			case 19:
				o = this.getFormatBySecond19(second);
				break;
			case 20:
				o = this.getFormatBySecond20(second);
				break;
			case 21:
				o = this.getFormatBySecond21(second)
		}
		return o
	}

	/**
	 * @param e：秒
	 * @return 00:00:00
	*/
	public getFormatBySecond1(e: number = 0) {
		var t = "";
		let hours = Math.floor(e / 3600);
		if (0 == hours) {
			t = "00";
		} else if (10 > hours) {
			"0" + hours;
		} else {
			"" + hours;
		}
		var r, i;
		let n = Math.floor((e - 3600 * hours) / 60);//分
		let a = Math.floor((e - 3600 * hours) % 60);//秒

		if (0 == n) {
			r = "00"
		} else if (10 > n) {
			r = "0" + n;
		} else {
			"" + n;
		}

		if (0 == a) {
			i = "00"
		} else if (10 > a) {
			i = "0" + a;
		} else {
			i = "" + a;
		}
		return t + ":" + r + ":" + i;
	}

	public getFormatBySecond13(e: number = 0) {
		var t, o, r, i = Math.floor(e / 3600), n = Math.floor((e - 3600 * i) / 60), a = Math.floor((e - 3600 * i) % 60);
		return o = 0 == n ? "00" : 10 > n ? "0" + n : "" + n,
			r = 0 == a ? "00" : 10 > a ? "0" + a : "" + a,
			0 == i ? o + ":" + r : (t = 10 > i ? "0" + i : "" + i,
				t + ":" + o)
	}

	/**
	 * @param e：秒
	 * @return yy-mm-dd 00:00:00
	*/
	public getFormatBySecond2(e: number = 0) {
		var t, o, r, i = new Date(1e3 * e);
		let n = i.getFullYear();//年
		let a = i.getMonth() + 1;//月
		let s = i.getDate();//日
		let p = i.getHours();//时
		let l = i.getMinutes();//分
		let d = i.getSeconds();//秒
		t = 0 == p ? "00" :
			10 > p ? "0" + p : "" + p,
			o = 0 == l ? "00" :
				10 > l ? "0" + l : "" + l,
			r = 0 == d ? "00" :
				10 > d ? "0" + d : "" + d;
		return n + "-" + a + "-" + s + " " + t + ":" + o + ":" + r;
	}

	/**
	 * @param e：秒
	 * @return 00:00
	*/
	public getFormatBySecond15(e: number = 0) {
		var t, o, r = Math.floor(e / 3600),
			i = Math.floor(e / 60),//分
			n = Math.floor((e - 3600 * r) % 60);//秒
		t = 0 == i ? "00" : 10 > i ? "0" + i : "" + i,
			o = 0 == n ? "00" : 10 > n ? "0" + n : "" + n;
		return t + ":" + o;
	}

	public getFormatBySecond3(e: number = 0) {
		var t, o, r = Math.floor(e / 3600), i = Math.floor((e - 3600 * r) / 60), n = Math.floor((e - 3600 * r) % 60);
		return t = 0 == i ? "00" : 10 > i ? "0" + i : "" + i,
			o = 0 == n ? "00" : 10 > n ? "0" + n : "" + n,
			t + ":" + o
	}

	/**
	 * @param e：秒
	 * @return x天前，x小时前，x分前
	*/
	public getFormatBySecond4(e: number = 0) {
		var t = Math.floor(e / 3600);
		return t > 0 ?
			t > 24 ? Math.floor(t / 24) + "天前" : t + "小时前"
			: Math.floor(e / 60) + "分钟前";
	}

	public getFormatBySecond17(e: number = 0): any {
		var t = 86400
			, o = 3600
			, r = 60
			, i = Math.floor(e / t)
			, n = Math.floor(e % t / o)
			, a = Math.floor((e - n * o) / r)
			, s = Math.floor((e - n * o) % r)
			, p = ""
			, l = ""
			, d = ""
			, c = "";
		return e > 0 ? i > 0 ? p = i + "天" : n > 0 ? l = n + "小时" : void (a > 0 ? d = a + "分" : s > 0 && (c = s + "秒")) : ""
	}

	public getFormatBySecond19(e: number = 0) {
		var t = Math.floor(e / 3600);
		if (t > 24) {
			var o = Math.floor(t / 24)
				, r = e - 86400 * o
				, i = this.getFormatBySecond1(r);
			return o + "天" + i
		}
		return this.getFormatBySecond1(e)
	}

	public getFormatBySecond5(e: number = 0) {
		var t = 86400
			, o = 3600
			, r = 60
			, i = Math.floor(e / t)
			, n = Math.floor(e % t / o)
			, a = Math.floor((e - n * o) / r)
			, s = Math.floor((e - n * o) % r)
			, p = ""
			, l = ""
			, d = ""
			, c = "";
		return e > 0 ? 0 == i ? (p = "",
			0 == n ? (l = "",
				0 == a ? (d = "",
					c = 0 == s ? "" : 10 > s ? "0" + s + "秒" : "" + s + "秒") : (d = "" + a + "分",
						c = 0 == s ? "" : 10 > s ? "0" + s + "秒" : "" + s + "秒",
						d + c)) : (l = n + "小时",
							0 == a ? (d = "",
								c = 0 == s ? "" : 10 > s ? "0" + s + "秒" : "" + s + "秒",
								l + c) : (d = 10 > a ? "0" + a + "分" : "" + a + "分",
									l + d))) : (p = i + "天",
										l = 0 == n ? "" : 10 > n ? "0" + n + "小时" : "" + n + "小时",
										p + l) : ""
	}

	public getFormatBySecond6(e: number = 0) {
		var t = new Date(1e3 * e)
			, o = t.getMonth() + 1
			, r = t.getDate()
			, i = t.getHours()
			, n = t.getMinutes();
		return o.toString().replace(/^(\d)$/, "0$1") + "-" + r.toString().replace(/^(\d)$/, "0$1") + " " + i.toString().replace(/^(\d)$/, "0$1") + ":" + n.toString().replace(/^(\d)$/, "0$1")
	}

	public getFormatBySecond7(e: number = 0) {
		var t = 86400
			, o = "";
		return e > t ? (o += Math.floor(e / t) + "天",
			o += Math.floor(e % t / 3600) + "小时") : this.getFormatBySecond1(e)
	}

	public getFormatBySecond20(e: number = 0) {
		var t = 86400
			, o = "";
		return o += Math.floor(e / t) + "天",
			o += Math.floor(e % t / 3600) + "小时"
	}

	public getFormatBySecond8(e: number = 0): any {
		var t = Math.floor(e / 86400)
			, o = Math.floor((e - 3600 * t * 24) / 3600)
			, r = Math.floor((e - 3600 * o - 3600 * t * 24) / 60)
			, i = Math.floor((e - 3600 * o - 3600 * t * 24) % 60);
		return {
			day: t,
			hours: o,
			minute: r,
			second: i
		}
	}

	public getFormatBySecond18(e: number = 0) {
		var t = this.getFormatBySecond8(e);
		return t.day + "天" + t.hours + "时" + t.minute + "分" + t.second + "秒"
	}

	public getFormatBySecond9(e: number = 0) {
		var t = new Date(1e3 * e)
			, o = t.getFullYear()
			, r = t.getMonth() + 1
			, i = t.getDate();
		return o + "." + r + "." + i
	}

	public getFormatBySecond10(e: number = 0) {
		var t = Math.floor(e / 3600);
		return t > 0 ? t > 24 ? Math.floor(t / 24) + "天" : t + "小时" : Math.floor(e / 60) + "分钟"
	}

	public getFormatBySecond11(e: number = 0) {
		var t = Math.floor(e / 3600);
		return t > 24 ? Math.floor(t / 24) + "天" : this.getFormatBySecond1(e)
	}

	public getFormatBySecond12(e: number = 0) {
		var t = 86400
			, o = "";
		if (e > t) {
			o += Math.floor(e / t) + "天";
			var r = Math.round(e % t / 3600);
			return r > 0 && (o += Math.round(e % t / 3600) + "小时"),
				o
		}
		return this.getFormatBySecond1(e)
	}

	public getFormatBySecond14(e: number = 0) {
		return e > 86400 ? this.getFormatBySecond(e, 7) : this.getFormatBySecond(e, 1)
	}

	public getFormatBySecond16(e: number = 0) {
		var t = 86400
			, o = "";
		return e > t ? (o += Math.floor(e / t) + "天",
			o += Math.round(e % t / 3600) + "小时") : (o += Math.floor(e / 3600) + "小时",
				o += Math.floor(e / 60) + "分")
	}

	/**
	 * @param e：时间戳 毫秒
	 * @param type 类型
	*/
	public getFormatByTimeStamp(e: number = 0, type: number = 1): any {
		var o = "";
		switch (type) {
			case 1:
				o = this.getFormatByTimeStamp1(e);
				break;
			case 2:
				o = this.getFormatByTimeStamp2(e);
				break;
			case 3:
				o = this.getFormatByTimeStamp3(e);
				break;
			case 4:
				o = this.getFormatByTimeStamp4(e)
		}
		return o
	}

	/**
	 * @param e：时间戳 毫秒
	 * @return xx月xx日
	*/
	public getFormatByTimeStamp1(e: number = 0) {
		var t = new Date(1e3 * e)
			, o = t.getMonth() + 1
			, r = t.getDate();
		return this.fullDoubleNum(o) + "月" + this.fullDoubleNum(r) + "日"
	}

	/**
	 * @param e：时间戳 毫秒
	 * @return hh:mm:ss
	*/
	public getFormatByTimeStamp2(e: number = 0) {
		var t = new Date(1e3 * e)
			, o = t.getHours()
			, r = t.getMinutes()
			, i = t.getSeconds();
		return (10 > o ? "0" + o : o) + ":" + (10 > r ? "0" + r : r) + ":" + (10 > i ? "0" + i : i)
	}

	/**
	 * @param e：时间戳 毫秒
	 * @return xx月xx日 hh:mm
	*/
	public getFormatByTimeStamp3(e: number = 0) {
		var t = new Date(1e3 * e)
			, o = t.getMonth() + 1
			, r = t.getDate()
			, i = t.getHours()
			, n = t.getMinutes()
			, a = (t.getSeconds(),
				10 > i ? "0" + i : i)
			, s = 10 > n ? "0" + n : n;
		return this.fullDoubleNum(o) + "月" + this.fullDoubleNum(r) + "日" + a + ":" + s
	}

	/**
	 * @param e：时间戳 毫秒
	 * @return 年.月.日
	*/
	public getFormatByTimeStamp4(e: number = 0) {
		var t = new Date(1e3 * e)
			, o = t.getFullYear()
			, r = t.getMonth() + 1
			, i = t.getDate();
		return o + "." + r + "." + i
	}

	public getFormatBySecond21(e: number = 0) {
		var t = 86400
			, o = 3600
			, r = 60
			, i = 0
			, n = 0
			, a = 0
			, s = 0;
		return e >= t ? (i = Math.floor(e / t),
			n = Math.floor(e % t / o),
			i + "天" + n + "小时") : e >= o ? (n = Math.floor(e / o),
				a = Math.floor(e % o / r),
				n + "小时" + a + "分钟") : (a = Math.floor(e / r),
					s = Math.floor(e % r),
					a + "分钟" + s + "秒")
	}

	public fullDoubleNum(e: number = 0) {
		return 10 > e ? "0" + e : e.toString()
	}

	public static fillTimeToStr(e: number = 0, o: string, r: boolean) {
		void 0 === r && (r = !0);
		for (var i = DateManager.timeArr, n = i.length - 1; n >= 0; n--) {
			var a = "{" + n + "}"
				, s = o.indexOf(a);
			if (s >= 0) {
				var p = e / i[n] >> 0;
				e -= p * i[n];
				var l = p + "";
				r && l.length < 2 && 3 >= n && (l = 0 + l),
					o = o.replace(a, l)
			}
		}
		return o
	}

	/*获取当前剩余时间，返回秒数*/
	public static getDayLeftTimeMs(e: number = 0) {
		var t = this._date;
		t.setTime(e);
		var o = t.getHours()
			, r = t.getMinutes()
			, i = t.getSeconds()
			, n = this.MS_PER_DAY - this.MS_PER_HOUR * o - this.MS_PER_MINUTE * r - this.MS_PER_SECOND * i - t.getMilliseconds();
		return n
	}

	//获取今天时间
	// public static getTodaySomeTimeMs(e: number = 0, t, o) {
	// 	var r = 1e3 * App.ctrls.GameSceneCtrl.getModel().serverTime
	// 		, i = this._date;
	// 	return i.setTime(r),
	// 		i.setHours(e, t, o),
	// 		i.getTime()
	// }

	//服务器时间
	// public getLeastByTimeStamp(e: number = 0) {
	// 	var t = App.ctrls.GameSceneCtrl.getModel().serverTime;
	// 	return e - t
	// }

	public parseDate(e: number = 0) {
		return e >= 10 ? e : "0" + e
	}

}