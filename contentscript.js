

var timer1 = null;
var idname = new Array(31);
var now = new Date();
var nowDate = now.getFullYear()+
    ( "0"+( now.getMonth()+1 ) ).slice(-2)+
    ( "0"+now.getDate() ).slice(-2);
var $options = null;
var g_cnt = 0;
var df = $.Deferred();  

// background経由でLocalStorage上に設定したoptions情報をとってくる
chrome.runtime.sendMessage({status: "load_options"}, function(response) {
    //options取得
    $options = $.parseJSON(response.val);
});

//backgroundからのメッセージ待受（アイコンクリックで発火）
chrome.runtime.onMessage.addListener(e => {

    //データなし時は何もしないで抜ける
    if($options==null){
        alert("設定がありません。コウモリアイコンを右クリックして「オプション」を設定して下さい。");
        return false;
    }

    if(window.confirm('今月の勤務の一括登録を行います。再実行時は上書きされます。日次確定済みの日はスキップします。★場合によっては３分位かかります　★実行中はPCの操作をお控え下さい。本当によろしいですか？')) {
    }else{
        $(".dval.vst.day_time0")[0].parentNode.querySelector('.vjob').click();
        
        makeArray = Array.prototype.slice;
        makeArray.call($("#empWorkTableBody").querySelectorAll(".name")).forEach(function(element) {
          console.log("aaa");
        });
        
        return false;
    }

    //Calendarの対象ID群（平日のみ）を取得
    $(".dval.vst[id]").each(function(i, o){
        idname[i+1] = $(o).attr('id');
        console.log("1>"+idname[i+1]);
    });

    //工数入力の自動入力＝ON
    if($options.auto_proj==true){
        //工数入力処理コール
        auto_proj_exec();
    }

    //勤務時間入力の自動入力＝ON
    if($options.auto_time==true){
        // タイマー開始（勤務時間入力処理をNミリ秒間隔でコール）
        timer1 = setInterval(auto_time_exec, 8000);
    }

    //工数入力処理
    function auto_proj_exec() {

        //平日でループ
        for (var cnt = 1; cnt < 999; cnt++) {

            console.log("2>"+cnt);
            console.log("2>"+idname[cnt]);
            if(cnt>0){

                console.log("2>"+nowDate);
                console.log("2>"+idname[cnt].slice(-10).replace(/-/g, ''));
                //今日まで処理したら抜ける
                if ( nowDate < idname[cnt].slice(-10).replace(/-/g, '') ) {
                    console.log("2>今日まで処理したら抜ける");
                    df.resolve();
                    return;
                }

                //工数入力ダイアログを開く
                $("#"+idname[cnt]).parent().find(".vjob").click();

                //設定したPJコードでループ
//                $.each($options.datas,function(i, o){
                for (var cnt2 = 0; cnt2 < 999; cnt2++) {
                    console.log("3>"+cnt2);
//                    console.log(i + ':' + o.key + ':' + o.val);
                    var pjCode = $options.datas[cnt2].key;
                    var pjTime = $options.datas[cnt2].val;
                    if(pjCode=="")
                        break;
                    //PJコードが複数マッチしたら
                    if($('.name:contains("'+pjCode+'")').length > 1){
                        alert("対象のPJコードが複数マッチしました。オプション設定でPJコードを、例えば「32601ユニット開発／その他準備作業」のようにフルで入力して下さい。");
                        return false;
                    }
                    //工数を入力
                    //  PJコードに対して工数（1:00等）をセット。※スライダーは動かないが値はセットされている
                    $('.name:contains("'+pjCode+'")').parent().parent().find(".inputime").val(pjTime);
//                }); 
                }
                //工数を登録
                $("#empWorkOk").click();
                
                //デバッグ用抜ける
                //return false;
            }
        }; 
    }
      
    //勤務時間入力処理（タイマーでループ）
    function auto_time_exec() {

        console.log("4 display>"+$("#dialogWorkBalance").css("display"));

        //工数ダイアログが表示されている間は抜ける。工数ダイアログが消えてから後続処理を実行
        if($("#dialogWorkBalance").css("display")=="block"){
            return false;
        }

        g_cnt++;
        console.log("4>"+g_cnt);
        console.log("4>"+idname[g_cnt]);
        if(g_cnt>0){

            //今日まで処理したら抜ける
            if ( nowDate < idname[g_cnt].slice(-10).replace(/-/g, '') ) {
                clearInterval(timer1);
                return false;
            }

            //出社時刻自動入力
            //  ダイアログ開いて時刻をセット
            $("#"+idname[g_cnt]).click();
            //  開始時間が空白時は何もしない
            if($options.start_date!=""){
                $('#startTime').val($options.start_date);
            }
            //  終了時間が空白時は何もしない
            if($options.end_date!=""){
                $('#endTime').val($options.end_date);
            }
            //  日次確定をチェックする
            if($options.day_fix==true){
                $("#timeInputDayFix").prop("checked",true);
            }

            //時刻を登録
            $("#dlgInpTimeOk").click();
            
            //デバッグ用抜ける
            //clearInterval(timer1);
            //return false;
        }
    }; 


});
