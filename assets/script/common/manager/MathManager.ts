export default class MathManager {

    /**随机生成数组
     * @param len 要生成数组的长度
     * */
    static creatRandomArr(len: number, end: number = 3): number[] {
        let arr = [];
        while (arr.length < len) {
            // parseInt取正，小数点后面的数字全部抹掉
            // Math.random() 0-1的随机数
            let randomNum = Math.random() * (end - 1);
            let num = Math.floor(randomNum) + 1;
            if (arr.indexOf(num) == -1) {
                // this.arr.indexOf(num)若等于-1则证明arr这个数组里没有num这个随机数，因此可以放进这个数组里
                arr.push(num)
            }
        }
        arr.sort(() => { return Math.random() - .5 });
        return arr;
    }
}