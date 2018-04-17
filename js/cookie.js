/**
 * Thanks for the author of https://blog.csdn.net/renfufei/article/details/50478856
 */

// 设置cookie值(key,value,过期天数,域名)
function setCookie(cookieName, cookieValue, expiredays, domain){
    // 0 比较特殊
    if(0 === cookieValue){
        cookieValue = 0;
    } else if(!cookieValue){
        cookieValue = "";
    }
    // 编码
    cookieValue = encodeURIComponent(cookieValue);
    //获取cookie字符串
    var cookieStr= cookieName + "=" + cookieValue;

    // 过期时间
    if(expiredays && !isNaN(expiredays)){
        var exdate=new Date();
        exdate.setDate(exdate.getDate()+expiredays);
        cookieStr += "; expires="+exdate.toGMTString();
    }
    // 域名
    //domain = domain || document.domain;
    if(domain){
        cookieStr += "; path=" + "/";
        cookieStr += "; domain="+domain;
    }

    // 保存本地 cookie
    document.cookie = cookieStr;

    // 返回设置后的值
    return cookieValue;
};

// 获取cookie值(key)
function getCookie(cookieName){
    //获取cookie字符串
    var strCookie=document.cookie;
    //将多cookie切割为多个名/值对
    var arrCookie=strCookie.split("; ");
    var cookieValue = null;
    //遍历cookie数组,处理每个cookie对
    for(var i=0;i<arrCookie.length;i++){
        var arr=arrCookie[i].split("=");
        //找到cookie,并返回它的值
        if(cookieName==arr[0]){
            cookieValue=(arr[1]);
            break;
        }
    }
    //
    if(!cookieValue){
        cookieValue = "";
    }
    cookieValue = decodeURIComponent(cookieValue);
    //
    return cookieValue;
};
