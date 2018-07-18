$(function () {
  var loadForm = function () {
   var btn = $(this);
   $.ajax({
     url: btn.attr("data-url"),
     type: 'get',
     dataType: 'json',
     beforeSend: function () {
      $("#modal-vendors").modal("show");
     },
     success: function (data) {
       $("#modal-vendors .modal-content").html(data.html_form);
     }
   });
 };

$(".js-delete-vendors").on("click", loadForm);


});
