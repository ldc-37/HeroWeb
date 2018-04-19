let PrizeList = new Object ();
        
$(function () {
    $('.prizePanel').click(function () {
        $('#prizeList').slideToggle('slow');
    })
    
    GetPrize ();
    ShowPrize ();

})

function GetPrize () {
    $.ajax ({
        type: "POST",
        url: "https://api.hack.rtxux.xyz/prize/list",
        data: SendUserInfo (),
        contentType: "application/json",
        dataType: "json",
        async: false,
        success: function (data) { // NO status!
            PrizeList = data;
        },
        error: function (xhr,status,error) {alert(status + '\n' + error);}
    })
}

function ShowPrize () {
    for (let i = 0;i < PrizeList.prize.length;++i) {
        let $li = $('<li>');
        $li.text(`序号：${PrizeList.prize[i].id} 数量：${PrizeList.prize[i].amount} 中奖率：${PrizeList.prize[i].probability}% 奖品描述：${PrizeList.prize[i].description}`);
        $('#prizeList').append($li);
        if (i < 4) {
            $('.ibox')[i].innerText = PrizeList.prize[i].description;
        }
        else {
            $('.ibox')[i+1].innerText = PrizeList.prize[i].description;
        }
    }
}

function GetLottery () {
    $('.lottery-result').fadeOut('slow');
    $.ajax ({
        type: "POST",
        url: "https://api.hack.rtxux.xyz/prize/get",
        data: SendUserInfo (),
        contentType: "application/json",
        dataType: "json",
        async: false,
        success: function (data) {
            let prize = data.description;
            if (HasError (data)) {
                window.open('index.html','_self');
            }
            else {
                let a = new Array(0,1,2,5,8,7,6,3); //4:button
                let i = 0;
                let cycle = setInterval(() => {
                    if (i >= 16) {
                        clearInterval (cycle);
                        let keyCycle = setInterval(function () {
                            ClearStyle();
                            if ($('.ibox')[a[i%8]].innerText == prize) {
                                $('.ibox')[a[i%8]].className += ' light';
                                clearInterval(keyCycle);
                                // $('.lottery-result').removeClass('hide');
                                $('.lottery-result').fadeIn('slow');
                                $('#lottery-resultText').text(`恭喜您抽中 "${prize}" ！`);
                            }
                            else{
                                $('.ibox')[a[i%8]].className += ' light';
                                i++;
                            }
                        },100)
                    }
                    else {
                        ClearStyle ();
                        $('.ibox')[a[i%8]].className += ' light';
                        i++;
                    }
                },100);
            }
        },
        error: function (xhr,status,error) {alert(status + '\n' + error);}
    })
}

function ClearStyle () {
    for (let i = 0;i < $('.ibox').length;++i) {
        $('.ibox')[i].className = 'ibox';
    }
}

function SendUserInfo () {
    const uid = getCookie ('uid');
    const token = getCookie ('token');
    const info = '{"uid":' + uid + ',"token":"' + token + '"}';

    return info; 
}