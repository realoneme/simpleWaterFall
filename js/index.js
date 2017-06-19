//点击回到顶部
function toTop() {
    var topBtn = document.getElementById('toTop');
//        当前窗口一屏的高度
    var curScreenHeight = utils.winAttrSet('clientHeight');

    window.addEventListener("scroll", function () {
        var scrollT = utils.winAttrSet('scrollTop');
        if (scrollT > curScreenHeight) {
            utils.setCSS(topBtn, 'display', 'block');
        } else {
            utils.setCSS(topBtn, 'display', 'none');
        }
    });
    var timer;
    topBtn.onclick = function () {
        var scrollT = utils.winAttrSet('scrollTop');
        timer = window.setInterval(function () {
            if (scrollT <= 0) {
                clearInterval(timer)
            }
            scrollT -= 500;
            utils.winAttrSet('scrollTop', scrollT);

        }, 1);

    };
    window.onmousewheel = function () {
        clearInterval(timer);
    }
}

//    固定头部
function fixhead() {
    var header = document.getElementById('header');
    var headerfix = document.getElementById('headerfix');
    var headHeight = parseInt(getCSS(header, 'height'));

    function getCSS(ele, attr) {
        var vale = "getComputedStyle" in window ? window.getComputedStyle(ele, null)[attr] : ele.currentStyle[attr];
        return vale;
    }

    window.onscroll = function () {
        var scrollT = utils.winAttrSet('scrollTop');
        if (scrollT > headHeight) {
            utils.setCSS(headerfix, 'display', 'block');
        } else {
            utils.setCSS(headerfix, 'display', 'none');
        }
    }
}

////设置一些全局变量
var Imgs;
Imgs = document.getElementsByTagName('img');

//    发送请求得到数据
function getInfos() {
    var xhr = new XMLHttpRequest();
    var picsdata;
    var url = './datas/pics.json?=' + Math.random();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status >= 200 && xhr.readyState < 300) {
            picsdata = utils.toJSON(xhr.responseText);
            picsdata && picsdata.length ? bindDOM(picsdata) : null;
            return picsdata;
        }
    };
    xhr.open('get', url,false);
    xhr.send(null);
}


//    绑定数据
function bindDOM(data) {
    var oUl = document.getElementsByClassName('img-content');
    var oUlArr = utils.convertArray(oUl);
    var frg = document.createDocumentFragment();
    for (var i = 0; i < 50; i++) {
        var ind = Math.round(Math.random()*7);
        var curData=data[ind];
        var oLi = document.createElement('li');
        oLi.className = 'img-box';
        htmlContent = [
            '<a href="" class="iconflag"></a>',
            '<img src="images/loading.gif" data-img="' + curData['pic'] + '" alt="" class="imgs">',
            '<p class="title">' + curData['title'] + '</p>'
        ].join('');
        oLi.innerHTML = htmlContent;
        frg.appendChild(oLi);
        //找到最短的ul添加li
        //取到ul的高度,并比较大小
//            offsetHeight->找到这个div包括边框的高度
//            需要在data数据每次循环中取添加。
//            每次添加一个li，根据ul的长短选择li添加的位置。
        oUlArr.sort(function (a, b) {
            return a.offsetHeight - b.offsetHeight;
        });
//            因为排序之后oUlArr[0]肯定是最短的，所以将DOM加到这个ul里
        oUlArr[0].appendChild(frg);
    }

    frg = null;

}


//    当图片显示在可视区域的时候，把data-img里的真实地址替换到img的src属性里

function lazyLoad() {
    for(var k = 0;k<Imgs.length;k++){
        checkImg(Imgs[k])
    }

}

function checkImg(img) {
//            找到图片离顶部的高度
//        这个图片离顶部的高度+图片高度<=屏幕可视区域高度+已经滚上去的部分(win.scrollTop) //已经滚上去的部分如果为0，那么说明文档没有被滚动，
// 被滚上去的部分是窗口的scrollTop 屏幕可视区域高度+已经滚上去的部分->该文档已经被用户看过了的部分（从头到现在所在位置）
// 比较之后-> 开始加载图片
    var curHeight = img.offsetTop + img.offsetHeight;
    var curScreen = utils.winAttrSet('clientHeight')+utils.winAttrSet('scrollTop');
    if (curHeight <= curScreen) {
        //取得属性必须用getAttribute来进行
        var imgSrc = img.getAttribute('data-img');

        var tempImg = new Image;
        tempImg.src = imgSrc;
        tempImg.onload=function () {
            img.src = imgSrc;
            imgFadeIn(img);
        }
        tempImg.onerror=function () {
            img.src = './images/404.jpg';
            imgFadeIn(img);
        }

    }
}
window.addEventListener('scroll',function () {
    for (var k = 0; k < Imgs.length; k++) {
        lazyLoad(Imgs[k]);
    }

});
lazyLoad();

function imgFadeIn(img) {
    var timer = setInterval(function () {
        var op = utils.getCSS(img, 'opacity');
        if (op >= 1) {
            clearInterval(timer);
        }
        op += 2;
        utils.setCSS(img, 'opacity', op);
    }, 100)
}
toTop();
fixhead();
getInfos();
lazyLoad(Imgs);
