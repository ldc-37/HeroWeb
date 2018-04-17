'use strict'
$(function () {
    const options = document.getElementsByClassName('option');
    for(let i = 0;i < options.length;++i) {
        options[i].addEventListener('click', function () {
            ClearStyle();
            options[i].className += ' option-selected';
        })
    }

    let t = 60;
    let timer = setInterval(() => {
        $('#t-num').text(--t);
        $('.time').css('border','2px solid black');
        $('.container').css('border','3px solid black');
        if (t <= 30 && t % 2 == 0) {
            $('.time').css('border','2px solid red');
            $('.container').css('border','3px solid red');
        }
        if (t <= 10) {
            $('.time').css('background-color','red');
        }
        if (t == 0) {
            alert('回答超时！');
            window.open('index.html','_self');
        }
    },1000);


    $('#btn-pre').click(function () {
        ShowPreQuestion ();
        ClearStyle ();
        ShowSelected ();
        AnsArr.splice(-1,1);
    });
    $('#btn-next').click(function () {
        if (SaveOption () == false) {
            return false;
        }
        ShowQuestion ();
        ClearStyle ();
    });
    $('#btn-submit').click(function () {
        if (SaveOption () == false) {
            return false;
        }
        Submit ();
        clearInterval(timer);
    });

    Login ();
    Init ();
    GetQuestions ();
    ShowQuestion ();

})

const baseURL = 'https://api.hack.rtxux.xyz/';

let Qnum = 0
let Qlist = new Array ();
let OptList = new Array ();
let Alist = new Object ();
let AnsArr = new Array ();

let result = new Object ();


function Login () {
    if (getCookie ('uid') == '') {
        $.ajax ({
            type: "GET",
            url: baseURL + "auth/login",
            dataType: "json",
            async: false,
            success: function (data) {
                if (HasError (data)) {
                    window.open('index.html','_self');
                }
                else {
                    setCookie('uid',data.uid);
                    setCookie('token',data.token);
                }
            },
            error: function (xhr,error) {alert('网络错误:' + xhr.status + '\n' + error);}
        })
    }
}

function Init () {
    const uid = getCookie ('uid');
    const token = getCookie ('token');
    Alist.uid = parseInt(uid);
    Alist.token = token;
}

function GetQuestions () {
    $.ajax ({
        type: "POST",
        url: baseURL + "get_question",
        data: SendUserInfo (),
        contentType: "application/json",
        dataType: "json",
        async: false,
        success: function (data) {
            if (HasError (data)) {
                window.open('index.html','_self');
            }
            else {
                for (let i = 0;i < 6;++i) {
                    Qlist[i] = new Object ();
                    OptList[i] = new Array ();
                    Qlist[i].qid = data.question[i].qid;
                    Qlist[i].question = data.question[i].description;
                    for (let j = 0;j < data.question[i].answers.length;++j) {
                        OptList[i][j] = new Object ();
                        OptList[i][j].aid = data.question[i].answers[j].aid;
                        OptList[i][j].description = data.question[i].answers[j].description;
                    }
                }
            }
        },
        error: function (xhr,status,error) {alert(xhr + '\n' + status + '\n' + error);}
    })
}

function ShowPreQuestion () {
    if (--Qnum == 1) {
        $('#btn-pre').addClass('hide');
    }
    if (Qnum == 5) {
        $('#btn-next').removeClass('hide');
        $('#btn-submit').addClass('hide');
    }
    $('#q-num').text(Qnum);
    let question = Qlist[Qnum-1].question;
    $('.question').append('<p>').text(question);
    $('#optA').text(OptList[Qnum-1][0].description);
    $('#optA').attr("data-aid",OptList[Qnum-1][0].aid);
    $('#optB').text(OptList[Qnum-1][1].description);
    $('#optB').attr("data-aid",OptList[Qnum-1][1].aid);
    $('#optC').text(OptList[Qnum-1][2].description);
    $('#optC').attr("data-aid",OptList[Qnum-1][2].aid);
    $('#optD').text(OptList[Qnum-1][3].description);
    $('#optD').attr("data-aid",OptList[Qnum-1][3].aid);
}

function ShowQuestion () {
    if (++Qnum == 6) {
        $('#btn-next').addClass('hide');
        $('#btn-submit').removeClass('hide');
    }
    if (Qnum == 1) {
        $('#btn-pre').addClass('hide');
    }
    $('#q-num').text(Qnum);
    let question = Qlist[Qnum-1].question;
    $('.question').append('<p>').text(question);
    $('#optA').text(OptList[Qnum-1][0].description);
    $('#optA').attr("data-aid",OptList[Qnum-1][0].aid);
    $('#optB').text(OptList[Qnum-1][1].description);
    $('#optB').attr("data-aid",OptList[Qnum-1][1].aid);
    $('#optC').text(OptList[Qnum-1][2].description);
    $('#optC').attr("data-aid",OptList[Qnum-1][2].aid);
    $('#optD').text(OptList[Qnum-1][3].description);
    $('#optD').attr("data-aid",OptList[Qnum-1][3].aid);
}

function ShowSelected () {
    let aid = AnsArr[Qnum-1].answer_id;
    for (let i = 0;i < 4;++i) {
        let lopt = $('.option')[i];
        if (lopt.childNodes[3].dataset.aid == aid) {
            lopt.className += ' option-selected';
            break;
        }
    }
}

function SaveOption () {
    let option = $('.option-selected span')[0];
    if (option == undefined) {
        $('#tips').text('⚠请选择选项');
        return false;
    }
    let aid = parseInt(option.dataset.aid);
    let qid = Qlist[Qnum-1].qid;
    AnsArr.push({"question_id": qid,"answer_id": aid});
}

function Submit () {
    Alist.answers = AnsArr;
    let str = JSON.stringify(Alist);
    $.ajax({
        type: "POST",
        url: baseURL + "post_answer",
        data: str,
        contentType: "application/json",
        dataType: "json",
        async: false,
        success: function (data) {
            if (HasError (data)) {
                window.open('index.html','_self');
            }
            else {
                alert('提交成功！');
                ShowResult(data);
            }
        },
        error: function (xhr,status,error) {alert(xhr + '\n' + status + '\n' + error);}
    })
}

function ShowResult (data) {
    let right = data.correct.length;
    $('.container').hide();
    $('.result').removeClass('hide');
    if (right < 6) {
        $('#resultText').text('您一共答对了' + right + '题，只有全对才能获得抽奖机会哦！');
        $('#btn-retry').click(function () {
            location.reload();
        })
        $('#btn-retry').removeClass('hide');
    }
    else {
        $('#resultText').text('恭喜您全部答对，请点击下面的按钮进入抽奖页面！');
        $('#btn-lottery').click(function () {
            window.open('lottery.html','_self');
        })
        $('#btn-lottery').removeClass('hide');
    }

}


function SendUserInfo () {
    const uid = getCookie ('uid');
    const token = getCookie ('token');
    const info = '{"uid":' + uid + ',"token":"' + token + '"}';

    return info; 
}

function ClearStyle () {
    $('#tips').text('');
    const options = document.getElementsByClassName('option');
    for (let i = 0;i < options.length;++i) {
        options[i].className = 'option';
    }
    if (Qnum != 1) {
        document.getElementById('btn-pre').className = 'btn-pre';
    }
}