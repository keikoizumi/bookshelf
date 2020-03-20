//グローバル変数
var items = [];
var tUrl = 'http://localhost:8087/';
var all = 'all';
var key = 'key';
var sflag = 0;

//メッセージ
var NO_DATA = '<tr><td><div style="color: #000000;font-size:x-large ;font-weight: 700;">INFO</div></td><td><div style="color: #000000;font-size:x-large ;font-weight: 700;">NO DATA</div></td></tr>';
var FAILURE = '<tr><td><div style="color: #000000;font-size:x-large ;font-weight: 700;">INFO</div></td><td><div style="color: #FF3300;font-size:x-large ;font-weight: 700;">FAILURE</div></td></tr>';
var RUNNING = '<tr><td><div style="color: #000000;font-size:x-large ;font-weight: 700;">INFO</td><td><div color: #0000FF;font-size:x-large ;font-weight: 700;">RUNNING　<img src="./static/img/ico/load.gif" width="30" height="30" /></div></td></tr>';
var RUNNING_NOW = '<tr><td><div style="color: #000000;font-size:x-large ;font-weight: 700;">INFO</td><td><div color: #0000FF;font-size:x-large ;font-weight: 700;">RUNNING NOW ( PLEASE WAIT A MINUTE )　<img src="./static/img/ico/load.gif" width="30" height="30" /></div></td></tr>'; 　

function today() {
  var d = new Date();
  var formatted = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  return formatted;
}

window.onload = function() {
  //allBooks() 
}

function allBooks() {  
  $(function(){
      var targetUrl = tUrl+'allBooks';
      request = 'all'
      console.log(request);
      $.ajax({
        url: targetUrl,
        type: 'POST',
        contentType: 'application/JSON',
        dataType: 'JSON',
        data : JSON.stringify(request),
        scriptCharset: 'utf-8',
      }).done(function(data){ 
        console.log(data);
        console.log(data.length);
        sflag = 0;
        $('#table').empty();
        if (data.length == 0) {
          $('#table').append(NO_DATA);
        } else {
          for(var i in data) {
            var status_img = "";

            if (data[i].rental_status == 0) {   
              status_img = '<span data-toggle="tooltip" data-placement="top" title="click here"><img class="rentalCheck cursorhand" value="'+data[i].id+'" src="./static/img/ico/rental_ok.jpeg" width="17" height="17" alt="rental ok" data-toggle="modal" data-target="#rentalregistration"></img></span>';
            } else {
              status_img = '<span data-toggle="tooltip" data-placement="top" title="click here"><img class="rentalInfocheck cursorhand" value="'+data[i].id+'" src="./static/img/ico/rental_ng.jpeg" width="17" height="17" alt="rental ng" data-toggle="modal" data-target="#rentalInfo"></img><small style="color: rgba(225, 10, 10, 0.844);">&nbsp;&nbsp;貸出中</small></span>';
            }

            if (data[i].url == "" || data[i].url == null) {
              link_img = '<div><img class="rentalInfocheck cursorhand" value="'+data[i].id+'" src="./static/img/ico/dead_link.jpeg" width="17" height="17" alt="dead link"></img>';
            } else {
              link_img = '<a href="'+data[i].url+'" target="_blank"><img class="rentalInfocheck cursorhand" value="'+data[i].id+'" src="./static/img/ico/link.jpeg" width="17" height="17" alt="link"></img></a>';
            }

            $('#table').append('<tr><td>'+data[i].area+'</td><td>'+data[i].title+'</td><td>'+status_img+'</td><td>'+link_img+'</td></tr>');
          }
        }
        }).fail(function(data, XMLHttpRequest, textStatus) {
          console.log(data);
          $('#table').empty();
          $('#table').append(FAILURE);
          sflag = 0;
          console.log("XMLHttpRequest : " + XMLHttpRequest.status);
          console.log("textStatus     : " + textStatus);
      });
  });
}

function searchBook(data) {  
  $(function(){
      var targetUrl = tUrl+'searchBook';
      console.log(data);
      var request = {
        'data': data
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
          console.log(data.length);
          sflag = 0;
          $('#table').empty();
          if (data.length == 0) {
            $('#table').append(NO_DATA);
          } else {
            for(var i in data) {
              var status_img = "";
              var link_img = "";

              if (data[i].rental_status == 0) {   
                status_img = '<span data-toggle="tooltip" data-placement="top" title="click here"><img class="rentalCheck cursorhand" value="'+data[i].id+'" src="./static/img/ico/rental_ok.jpeg" width="17" height="17" alt="rental ok" data-toggle="modal" data-target="#rentalregistration"></img></span>';
              } else {
                status_img = '<span data-toggle="tooltip" data-placement="top" title="click here"><img class="rentalInfocheck cursorhand" value="'+data[i].id+'" src="./static/img/ico/rental_ng.jpeg" width="17" height="17" alt="rental ng" data-toggle="modal" data-target="#rentalInfo"></img><small style="color: rgba(225, 10, 10, 0.844);">&nbsp;&nbsp;貸出中</small></span>';
              }
              if (data[i].url == "" || data[i].url == null) {
                link_img = '<div><img class="rentalInfocheck" value="'+data[i].id+'" src="./static/img/ico/dead_link.jpeg" width="17" height="17" alt="dead link"></img>';
              } else {
                link_img = '<a href="'+data[i].url+'" target="_blank"><img class="rentalInfocheck cursorhand" value="'+data[i].id+'" src="./static/img/ico/link.jpeg" width="17" height="17" alt="link"></img></a>';
              }

              $('#table').append('<tr><td>'+data[i].area+'</td><td>'+data[i].title+'</td><td>'+status_img+'</td><td>'+link_img+'</td></tr>');
            }
          }
        }).fail(function(data, XMLHttpRequest, textStatus) {
          console.log(data);
          $('#table').empty();
          $('#table').append(FAILURE);
          sflag = 0;
          console.log("XMLHttpRequest : " + XMLHttpRequest.status);
          console.log("textStatus     : " + textStatus);
      });
  });
}

//rentalInfo
function rentalInfo(data) {  
  $(function(){
      var targetUrl = tUrl+'rentalInfo';
      console.log(data);
      var request = {
        'data': data
      };
      console.log(data);
      $.ajax({
        url: targetUrl,
        type: 'POST',
        contentType: 'application/JSON',
        dataType: 'JSON',
        data : JSON.stringify(request),
        scriptCharset: 'utf-8',
      }).done(function(data){ 
          console.log(data);
          console.log(data.length);
          sflag = 0;
          $('#rental_user_name').empty();
          $('#rental_start_dt').empty();
          $('#rental_end_plan_dt').empty();
          if (data.length == 0) {
            $('#table').append(NO_DATA);
          } else {

            if (data[0].rental_user_name =="" || data[0].rental_user_name == null) {
              $('#rental_user_name').append("No Infomation");
            } else {
              $('#rental_user_name').append(data[0].rental_user_name);
            }

            if (data[0].rental_start_dt == "" || data[0].rental_start_dt == null) {
              $('#rental_start_dt').append("No Infomation");
            } else {
              $('#rental_start_dt').append(data[0].rental_start_dt);
            }

            if (data[0].rental_end_plan_dt == "" || data[0].rental_end_plan_dt == null) {
              $('#rental_end_plan_dt').append("No Infomation");
            } else {
              $('#rental_end_plan_dt').append(data[0].rental_end_plan_dt);
            }
            
          }
      
        }).fail(function(data, XMLHttpRequest, textStatus) {
          console.log(data);
          $('#table').empty();
          $('#table').append(FAILURE);
          sflag = 0;
          console.log("XMLHttpRequest : " + XMLHttpRequest.status);
          console.log("textStatus     : " + textStatus);
      });
  });
}

//rentalBook
function rentalBook(request) {  
  $(function(){
      var targetUrl = tUrl+'rentalBook';
      $.ajax({
        url: targetUrl,
        type: 'POST',
        contentType: 'application/JSON',
        dataType: 'JSON',
        data : JSON.stringify(request),
        scriptCharset: 'utf-8',
      }).done(function(data){ 
          console.log(data);
          allBooks()
          sflag = 0;
        }).fail(function(data, XMLHttpRequest, textStatus) {
          console.log(data);
          $('#table').empty();
          $('#table').append(FAILURE);
          sflag = 0;
          console.log("XMLHttpRequest : " + XMLHttpRequest.status);
          console.log("textStatus     : " + textStatus);
      });
  });
}

//returnBook
function returnBook(request) {  
  $(function(){
      var targetUrl = tUrl+'returnBook';
      $.ajax({
        url: targetUrl,
        type: 'POST',
        contentType: 'application/JSON',
        dataType: 'JSON',
        data : JSON.stringify(request),
        scriptCharset: 'utf-8',
      }).done(function(data){ 
          console.log(data);
          allBooks()
          sflag = 0;
        }).fail(function(data, XMLHttpRequest, textStatus) {
          console.log(data);
          $('#table').empty();
          $('#table').append(FAILURE);
          sflag = 0;
          console.log("XMLHttpRequest : " + XMLHttpRequest.status);
          console.log("textStatus     : " + textStatus);
      });
  });
}

//searchBook
$(function(){ 
  $('#start').on('click',function(){
      sflag = 1;
      data= $("#key").val();
      console.log('data');
      searchBook(data);
      $('#table').empty();
      $('#iimg').empty();
      $('#table').append(RUNNING);
  });
});

//rentalCheck
$(function() {
  $(document).on('click','.rentalCheck',function() {
    id =  $(this).attr("value");
    console.log('data');
    console.log(id);
    $('.rentalBook').val(id);
  });
});

//rentalBook
$(function(){ 
  $(document).on('click','.rentalBook',function() {
      sflag = 1;
      console.log("click")
      id = $(".rentalBook").val();
      InputEmail1 = $("#InputEmail1").val();
      
      if (InputEmail1 == null || InputEmail1 == "") {
        $('#alert').append("<div id='myAlert' class='alert alert-danger alert-dismissible fade show' role='alert'><strong>注意!</strong>　Emailは必須です。<button type='button' class='close' data-dismiss='alert' aria-label='閉じる'><span aria-hidden='true'>&times;</span></button></div>");
        console.log("InputEmail1 null")
        return allBooks()
      }

      inputDate = $("#inputDate").val();
      var request = {
        'id': id
        , 'InputEmail1': InputEmail1
        , 'inputDate': inputDate
      };
      console.log(request);
      rentalBook(request);
  });
});


//alert
$("#myAlert").on('click',function(){
  $("#myAlert").alert();
});


//rentalInfo
$(function() {
  $(document).on('click','.rentalInfocheck',function() {
    sflag = 1;
    id =  $(this).attr("value");
    console.log('data');
    console.log(id);
    rentalInfo(id);
    $('.returnBook').val(id);
  });
});

//returnBook
$(function(){ 
  $(document).on('click','.returnBook',function() {
      sflag = 1;
      console.log("click")
      id = $(".returnBook").val();
      var request = {
        'id': id
      };
      console.log(request);
      returnBook(request);
  });
});

(function() {
  'use strict';

  window.addEventListener('load', function() {
    // カスタムブートストラップ検証スタイルを適用するすべてのフォームを取得
    var forms = document.getElementsByClassName('InputEmail1');
    // ループして帰順を防ぐ
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
})();