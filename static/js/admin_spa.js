//グローバル変数
var items = [];
var tUrl = 'http://localhost:8087/';
var all = 'all';
var key = 'key';
var sflag = 0;
var savedata;

window.onload = function() {
  //today
  //var pastDate = null; 
  allBooks();
  //getPastDay();
}

function today() {
  var d = new Date();
  var formatted = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  return formatted;
}

function regBook(request) {  
  
  $(function(){

      var targetUrl = tUrl+'regBook';

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

          allBooks()
      
        }).fail(function(data, XMLHttpRequest, textStatus) {
          console.log(data);
          $('#table').empty();
          $('#table').append('<tr><td><div style="color: #000000;font-size:x-large ;font-weight: 700;">INFO</div></td><td><div style="color: #FF3300;font-size:x-large ;font-weight: 700;">FAILURE</div></td></tr>');
          sflag = 0;
          console.log("XMLHttpRequest : " + XMLHttpRequest.status);
          console.log("textStatus     : " + textStatus);
      });
  });
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
            $('#table').append('<tr><td><div style="color: #000000;font-size:x-large ;font-weight: 700;">INFO</div></td><td><div style="color: #000000;font-size:x-large ;font-weight: 700;">NO DATA</div></td></tr>');
          } else {
            for(var i in data) {
              var status_img = "";
              var rental_start_dt ="";

              if (data[i].rental_status == 0) {   
                status_img = '<img src="./static/img/ico/rental_ok.jpeg" width="17" height="17" alt="rental ok"></img>';
              } else {
                status_img = '<img src="./static/img/ico/rental_ng.jpeg" width="17" height="17" alt="rental ng"></img>';
              }

              if (data[i].rental_start_dt == null) {
                rental_start_dt = 'ー';
              } else {
                rental_start_dt = data[i].rental_start_dt;
              }

              if (data[i].rental_user_name == null) {
                rental_user_name = 'ー';
              } else {
                rental_user_name = data[i].rental_user_name;
              }

              edirbtn = '<button id="'+data[i].id+'" class="godel btn btn-warning" type="button" data-toggle="modal" data-target="#editModal">Edite</button>';
              delbtn = '<button id="'+data[i].id+'" class="godel btn btn-danger" type="button" data-toggle="modal" data-target="#delModal">Delete</button>';

              $('#table').append('<tr><td>'+data[i].area+'</td><td>'+data[i].title+'</td><td>'+status_img+'</td><td>'+rental_user_name+'</td><td>'+rental_start_dt+'</td><td>'+edirbtn+'</td><td>'+delbtn+'</td></tr>');
            }
          }
      
        }).fail(function(data, XMLHttpRequest, textStatus) {
          console.log(data);
          $('#table').empty();
          $('#table').append('<tr><td><div style="color: #000000;font-size:x-large ;font-weight: 700;">INFO</div></td><td><div style="color: #FF3300;font-size:x-large ;font-weight: 700;">FAILURE</div></td></tr>');
          sflag = 0;
          console.log("XMLHttpRequest : " + XMLHttpRequest.status);
          console.log("textStatus     : " + textStatus);
      });
  });
}

function delBook(request) {  
  $(function(){
      var targetUrl = tUrl+'delBook';

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

          allBooks()
      
        }).fail(function(data, XMLHttpRequest, textStatus) {
          console.log(data);
          $('#table').empty();
          $('#table').append('<tr><td><div style="color: #000000;font-size:x-large ;font-weight: 700;">INFO</div></td><td><div style="color: #FF3300;font-size:x-large ;font-weight: 700;">FAILURE</div></td></tr>');
          sflag = 0;
          console.log("XMLHttpRequest : " + XMLHttpRequest.status);
          console.log("textStatus     : " + textStatus);
      });
  });
}



//regBook
$(function(){ 
  $('#regBook').on('click',function(){
    if (sflag == 0) {
      sflag = 1;
      console.log("click")
      area = $("#inputArea").val();
      title = $("#inputTitle").val();
      author = $("#inputAuthor").val();
      publisher = $("#inputPublisher").val();
      url = $("#inputURL").val();

      var request = {
        'area': area
        , 'title': title
        , 'author': author
        , 'publisher': publisher
        , 'url': url
      };
      
      console.log(request);
      
      regBook(request);

      $('#table').empty();
      $('#iimg').empty();
      $('#table').append('<tr><td><div style="color: #000000;font-size:x-large ;font-weight: 700;">INFO</td><td><div color: #0000FF;font-size:x-large ;font-weight: 700;">RUNNING　<img src="./static/img/ico/load.gif" width="30" height="30" /></div></td></tr>');
    } else {
      $('#table').empty();
      $('#iimg').empty();
      $('#table').append('<tr><td><div style="color: #000000;font-size:x-large ;font-weight: 700;">INFO</td><td><div color: #0000FF;font-size:x-large ;font-weight: 700;">RUNNING NOW ( PLEASE WAIT A MINUTE )　<img src="./static/img/ico/load.gif" width="30" height="30" /></div></td></tr>');
    }  
  });
});

//delete
$(function() {
  $(document).on('click','.godel',function() {
    //sendkey= $("#delkey").val();
    var delid = "";

    delid =  $(this).attr("id");

    var request = {
      'delid': delid
    };

    delBook(request);

  });
});
