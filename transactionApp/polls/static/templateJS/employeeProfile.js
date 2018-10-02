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



function calllbackTransaction(callback , url, type){
  var id = $("#employeeId").val();
  $.ajax({
         type: 'GET',
         url: url,
         success:function(transactions){
           $.each(transactions, function(i,transaction){
               if(transaction.employeeId == id ){
                  callback(transaction, type);
               }
           });
         }
       });
}

function displayTransaction(transaction, type){
  var tableName = $('#itemsTable').children('tbody');
  var urlType ='../viewIncomingTransactionItems/';

  if(type==0){
    urlType='../viewOutgoingTransactionItems/';
  }
  
  tableName.append("<tr id=" + transaction.transactionId + ">" +
                    "<td id='transactionId' value='"+transaction.transactionId+"'>"+transaction.transactionId+"</td>"+
                    "<td id='tax' value='"+transaction.tax+"'>"+transaction.tax+"</td>"+
                    "<td id='subtotal' value='"+transaction.subtotal+"'>"+transaction.subtotal+"</td>"+
                    "<td id='total' value='"+transaction.total+"'>"+transaction.total+"</td>"+
                    "<td id='total' value='"+transaction.createdAt+"'>"+transaction.createdAt+"</td>"+
                    "<td><a role ='button' class='btn btn-succes' href='"+ urlType + "" + transaction.transactionId +"'> Transaction Items</a></td>"+
                    "</tr>");


}
$('#labels').hide();

$( "#outgoing-transaction" ).click(function() {
    $('tbody').empty();
    $('#tableStyle').show();
    $('#labels').show();
    calllbackTransaction(displayTransaction, '/polls/api/outgoingTransactions/',0);

});


$( "#incoming-transaction" ).click(function() {
    $('tbody').empty();
    $('#tableStyle').show();
    $('#labels').show();
    calllbackTransaction(displayTransaction, '/polls/api/incomingTransactions/', 1);

});
