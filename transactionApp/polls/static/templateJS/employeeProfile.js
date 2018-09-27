$(function () {
  var loadForm = function () {
   var btn = $(this);
   $.ajax({
     url: btn.attr("data-url"),
     type: 'get',
     dataType: 'json',
     beforeSend: function () {
      $("#modal-employees").modal("show");
     },
     success: function (data) {
       $("#modal-employees .modal-content").html(data.html_form);
     }
   });
 };

$("#employees-table").on("click", ".js-delete-employee", loadForm);


});


$( "#outgoing-transaction" ).click(function() {
    
});

$( "#incoming-transaction" ).click(function() {
  window.alert("in");

});
