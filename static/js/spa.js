//グローバル変数
var items = [];
var tUrl = 'http://localhost:8086/';
var all = 'all';
var key = 'key';
var sflag = 0;
var savedata;

function today() {
  var d = new Date();
  var formatted = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  return formatted;
}

function searchBook(sendkey) {  
  $(function(){
      var targetUrl = tUrl+'searchBook';

      console.log(sendkey);

      var request = {
        'sendkey': sendkey
      };

      $.ajax({
        url: targetUrl,
        type: 'POST',
        contentType: 'application/JSON',
        dataType: 'JSON',
        data : JSON.stringify(request),
        scriptCharset: 'utf-8',
      }).done(function(data){ 
          console.log(data);
          $('#table').empty();
          for(var i in data) {
            $('#table').append('<tr><td>'+data[i].category_id+'</td><td>'+data[i].title+'</td><td>'+data[i].rental_status+'</td><td>'+data[i].rental_start_dt+'</td></tr>');
          }
        }).fail(function(data, XMLHttpRequest, textStatus) {
          console.log(data);
          $('#table').empty();
          $('#table').append('<tr><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">INFO</div></td><td><div style="font-style: italic;color: #FF3300;font-size:xx-large ;font-weight: 700;">FAILURE</div></td></tr>');
          sflag = 0;
          console.log("XMLHttpRequest : " + XMLHttpRequest.status);
          console.log("textStatus     : " + textStatus);
      });
  });
}


window.onload = function() {
  //today
  //var pastDate = null; 
  //other(all,pastDate);
  //getPastDay();
}

//searchBook
$(function(){ 
  $('#start').on('click',function(){
    if (sflag == 0) {
      sflag = 1;
      sendkey= $("#key").val();
      console.log('sendkey');
      searchBook(sendkey);

      $('#table').empty();
      $('#iimg').empty();
      $('#table').append('<tr><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">INFO</td><td><div style="font-style: italic;color: #0000FF;font-size:xx-large ;font-weight: 700;">RUNNING　<img src="./static/img/ico/load.gif" width="30" height="30" /></div></td></tr>');
    } else {
      $('#table').empty();
      $('#iimg').empty();
      $('#table').append('<tr><td><div style="font-style: italic;color: #000000;font-size:xx-large ;font-weight: 700;">INFO</td><td><div style="font-style: italic;color: #0000FF;font-size:xx-large ;font-weight: 700;">RUNNING NOW ( PLEASE WAIT A MINUTE )　<img src="./static/img/ico/load.gif" width="30" height="30" /></div></td></tr>');
    }  
  });
});



