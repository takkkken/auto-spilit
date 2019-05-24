$(function(){

  // セーブボタンが押されたら、
  $("#save").click(function () {

    $datas = new Array();
    $(".pj_code").each(function(i, o){
      $datas[i] = {
        "key" : $(o).val() , 
        "val" : $(".pj_value").eq(i).val() 
      };
    });

    // バックグラウンドセッションに書き込み
    chrome.runtime.sendMessage(
    {
        status: "save_options",
        datas: $datas,
        start_date: $("#start_date").val(),
        end_date: $("#end_date").val(),
        day_fix: $("#day_fix").prop("checked"),
        auto_proj: $("#auto_proj").prop("checked"),
        auto_time: $("#auto_time").prop("checked"),
    }, function(response) {
        //alert(response);
    });
  });

  // バックグラウンド経由でLocalStorage上に設定したoptions情報をとってくる
  chrome.runtime.sendMessage({status: "load_options"}, function(response) {
    //pjcodes取得
    var $options = $.parseJSON(response.val);

    //初回データなし時は何もしないで抜ける
    if($options==null){
      return false;
    }

    // PJコードと時間を設定する
    $.each($options.datas,function(i, o){
      console.log(i + ':' + o.key + ':' + o.val);
      $('.pj_code').eq(i).val(o.key);
      $('.pj_value').eq(i).val(o.val);
    }); 
    // 開始・終業時刻と確定チェックを設定する
    $("#start_date").val($options.start_date);
    $("#end_date").val($options.end_date);
    if($options.day_fix==true){
      $('#day_fix').prop("checked",true);
    }else{
      $('#day_fix').prop("checked",false);
    }
    if($options.auto_proj==true){
      $('#auto_proj').prop("checked",true);
    }else{
      $('#auto_proj').prop("checked",false);
    }
    if($options.auto_time==true){
      $('#auto_time').prop("checked",true);
    }else{
      $('#auto_time').prop("checked",false);
    }

  });


  
});