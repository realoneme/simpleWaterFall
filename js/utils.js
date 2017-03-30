/*
 * utils[v1.0]：常用方法库，包含DOM和数组对象的操作
 * - convertArray
 * */
var utils = (function () {
    /*
     * Convert to an array
     * @parameters:
     * likeAry[object]:array-like
     * @return:
     * ary[array]:An array which is converted completed
     * BY Rebecca Chan on 2017-3-25 12:52:25
     * */
    function convertArray(likeAry) {
        //如果类数组是一个dom集合，在ie6-8低版本浏览器中，不支持这种办法：[].slice.call(likeAry)=>对不不支持的我们自己写循环处理
        var ary = [];
        try {
            ary = Array.prototype.slice.call(likeAry, 0);
        } catch (e) {//e.message存储的是错误信息
            for (var i = 0, len = likeAry.length; i < len; i++) {
                ary[ary.length] = likeAry[i];
            }
        } finally {
            //不管是否报错，最后都会执行这里的代码，一般不用
        }
        return ary;
    }

    /*
     * toJSON:把JSON格式的字符串转换成JSON,兼容IE6、7
     * @parameters:JSON-alike string
     * @return: object[object]
     * BY Rebecca Chen on 2017-3-25 17:07:56
     * */
    function toJSON(str) {
        return 'JSON' in window ? JSON.parse(str) : eval('(' + str + ')');
    }

    /**
     * myTrim:delete all the spaces in front of the string or in the end of the string.
     * @returns {String.myTrim}
     * BY Rebecca Chan on 2017-3-28 19:26:36
     */

    function myTrim() {
        return String.prototype.myTrim = function myTrim() {
            var reg = /^\s+|\s+$/;
            return this.replace(reg, '');
        }
    }

    /**
     * winAttrSet:Get or set the attributes of the HTML DOM like HTML or body
     * @param attr To get the attribute if there just one arg.
     * @param val  To set the attribute if there is a val.
     * @returns {val}
     */
    function winAttrSet(attr, val) {
        if (typeof val === 'undefined') {
            return document.documentElement[attr] || document.body[attr];
        }
        document.documentElement[attr] = val;
        document.body[attr] = val;
    }

    /**
     * offset:Get the offset to the left and the top of the window edge
     * @param ele
     * @returns {{left: (Number|number), top: (number|Number)}}
     */
    function offset(ele) {
        var par = ele.offsetParent;
        var l = ele.offsetLeft;
        var t = ele.offsetTop;
        while (par && par.nodeName !== 'BODY') {
            par = par.offsetParent;
            l += par.clientLeft + par.offsetLeft;
            t += par.clientTop + par.offsetTop;
        }
        return {
            left: l,
            top: t
        }
    }

    /**
     * setCSS. Set css style to the element
     * @param ele
     * @param attr
     * @param val
     */
    function setCSS(ele, attr, val) {
        if (attr === 'opacity') { // 透明度处理
            ele.style['opacity'] = val; // 其他浏览器
            ele.style['filter'] = 'alpha(opacity=' + val * 100 + ')'; // ie 低版本
            return;
        }
        if(attr === 'float'){
            ele.style.cssFloat = val; // 老版本 ff
            ele.style.styleFloat = val; // ie 低版本
            return;
        }
        // 如果是这些属性 为确保 传递进来的值 有单位
        var reg = /^width|height|top|bottom|left|right|((margin|pading)(Top|Left|Bottom|Right)?)$/;
        if(reg.test(attr)){
            if(!isNaN(val)){
                val += 'px';
            }
        }
        ele.style[attr] = val;
    }

    /**
     * getCss 获取元素样式
     * @param ele (指定元素)
     * @param attr (样式属性)
     */
    function getCSS(ele, attr) {
//        window.getComputedStyle
        var val;
        if("getComputedStyle" in window){ // 如果window上有这个属性我们就用
            val = window.getComputedStyle(ele, null)[attr];
        } else { //ie Low currentStyle
            //  oDiv.currentStyle.filter  "alpha(opacity=80)"
            if(attr === 'opacity'){ // ie8 low
                val =  ele.currentStyle.filter; // "alpha(opacity=80)"
                var reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
                // 判断ie下有没有设置透明度 如果没有 默认返回1
                val = reg.test(val)? (reg.exec(val)[1])/100 : 1; // ["alpha(opacity=80)", "80"]
            } else {
                val = ele.currentStyle[attr];
            }

        }
//           100px -100px -1.23px   12rem  1em  block
        // 把带单位的去掉 把数字提取出来 即使是字符串数字 我也要提取成数字在返回 预防后期累加使用
        var regs = /^-?\d+(\.\d+)?(px|pt|rem|em)?$/;
        return regs.test(val)? parseFloat(val) : val;
    }

    return {
        convertArray: convertArray, //把方法返回出来
        toJSON: toJSON,
        myTrim: myTrim,
        winAttrSet: winAttrSet,
        offset: offset,
        setCSS: setCSS,
        getCSS:getCSS
    }
})();

