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
  var id = $("#employeeId").val();
  $.ajax({
         type: 'GET',
         url: url,
         success:function(transactions){
           $.each(transactions, function(i,transaction){
             // if the id from the item is the same as the input
               // window.alert(item.itemId);
               if(transaction.employeeId == id ){
                  callback(transaction);
               }
           });
         }
       });
}

function displayTransaction(transaction){
  var tableName = $('#itemsTable').children('tbody');

  tableName.append("<tr id=" + transaction.transactionId + ">" +
                    "<td id='transactionId' value='"+transaction.transactionId+"'>"+transaction.transactionId+"</td>"+
                    "<td id='tax' value='"+transaction.tax+"'>"+transaction.tax+"</td>"+
                    "<td id='subtotal' value='"+transaction.subtotal+"'>"+transaction.subtotal+"</td>"+
                    "<td id='total' value='"+transaction.total+"'>"+transaction.total+"</td>"+
                    "<td id='total' value='"+transaction.createdAt+"'>"+transaction.createdAt+"</td>"+
                    "<td><a role ='button' class='btn btn-succes' href='../viewOutgoingTransactionItems/"+transaction.transactionId +"'> Transaction Items</a></td>"+
                    "</tr>");


}



$( "#outgoing-transaction" ).click(function() {
    $('tbody').empty();
    calllbackTransaction(displayTransaction, '/polls/api/outgoingTransactions/');

});


$( "#incoming-transaction" ).click(function() {
    $('tbody').empty();
    calllbackTransaction(displayTransaction, '/polls/api/incomingTransactions/');

});
