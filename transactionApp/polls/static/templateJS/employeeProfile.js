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

function calllbackTransaction(callback , url){
  return $.ajax({
         type: 'GET',
         url: url,
         success:function(transactions){
           $.each(transactions, function(i,transaction){
             // if the id from the item is the same as the input
               // window.alert(item.itemId);
               callback(transaction);
           });
         }
       });
}

function displayTransaction(trasanction){

  console.log(trasanction);

}



$( "#outgoing-transaction" ).click(function() {
    window.alert("out");
    calllbackTransaction(displayTransaction, '/polls/api/outgoingTransactions/');
});

$( "#incoming-transaction" ).click(function() {
  window.alert("in");

});
