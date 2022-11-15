
export class StringManager {

    /**
     * @param num 需要转换的数字
     * @return 返回的结构：10，000
    */
    static chaNumToStr(num: number): string {
        //获取面值
        var str = num + "";
        //全部替换
        if (-1 != str.indexOf(",")) {
            str = str.replace(new RegExp(',', "g"), "");
        }
        var intSum = str.replace(/\B(?=(?:\d{3})+$)/g, ',');//取到整数部分
        //值重新填充到页面
        return intSum;
    }

    /**
    * @param num 需要转换的数字
    * @return 返回的结构：10，000.00
   */
    static chaNumAddToStr(num: number): string {
        //获取面值
        var str = num + "";
        //若是整数自动补全小数位
        if (-1 == str.indexOf(".")) {
            str = str + ".00"
        }
        //全部替换
        if (-1 != str.indexOf(",")) {
            str = str.replace(new RegExp(',', "g"), "")
        }
        var intSum = str.substring(0, str.indexOf(".")).replace(/\B(?=(?:\d{3})+$)/g, ',');//取到整数部分
        var dot = str.substring(str.length, str.indexOf("."))//取到小数部分搜索
        var ret = intSum + dot;
        //值重新填充到页面
        return ret;
    }

    /**
     * @param num 需要转换的数字
     * @param floatNum 显示小数点后几位，默认0位
     * @returns 100万
    */
    static chaToWan(num: string | number, floatNum = 0): string {
        if (+num > 10000) {
            return ((+num) / 10000).toFixed(floatNum) + "万";
        }
        else {
            return num + "";
        }
    }


    /**
     * @param num 需要转换的数字
     * @returns 100万
    */
    static chaToWan1(num: string | number): string {
        if (+num > 10000) {
            return ((+num) / 10000) + "万";
        }
        else {
            return num + "";
        }
    }

    /**字符串截取 包含对中文处理
     * @param str 要改变的字符串
     * @param n 要改变的字符串的长度
    */
    static Substr(str: string, n: number) {
        if (str.replace(/[\u4e00-\u9fa5]/g, "**").length <= n) {
            return str;
        }
        else {
            var len = 0;
            var tmpStr = "";
            for (var i = 0; i < str.length; i++) {//遍历字符串
                if (/[\u4e00-\u9fa5]/.test(str[i])) {//中文 长度为两字节
                    len += 2;
                }
                else {
                    len += 1;
                }
                if (len > n) {
                    break;
                }
                else {
                    tmpStr += str[i];
                }
            }
            return tmpStr + " ...";
        }
    };
}