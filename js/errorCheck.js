/**
 * 错误报告页面
 */

function HasError (data) {
    switch (data.status) {
        case -1:alert('系统异常，请联系管理员\n错误码:-1');break;
        case 1:alert('不在活动时间，请下次再来~\n错误码:1');break;
        case 2:alert('账户异常，请更换浏览器或清空cookies\n错误码:2');break;
        case 3:alert('回答超时，请重新回答\n错误码:3');break;
        case 4:alert('很抱歉，您没有抽奖资格！\n错误码:4');break;
        case 5:alert('非常抱歉，奖品已经抽完了……\n错误码:5');break;
        case 6:alert('糟糕，您的答案有点问题，建议更换浏览器或清空cookies\n错误码:6');break;
        case 0: return false;

        default:alert('未知错误，请联系管理员\n错误码:' + data.status);
    }
    return true;
 }