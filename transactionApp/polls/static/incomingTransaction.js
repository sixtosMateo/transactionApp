// $("#submit").on('click', function(){
//
//   $(function(){
//     // the id of html element is vendorsName but the value is the vendorId
//     var $vendorId = $('#vendorsName').val();
//     var $employeeId = $("#employeeName").val();
//     var order = {
//       vendorId: $vendorId,
//       employeeId: $employeeId,
//     };
//
//     $.ajax({
//       type: 'POST',
//       url:'/polls/incomingTransactions/',
//       data: order,
//       success:function(newIncomingTransaction){
//         window.alert(newIncomingTransaction.vendorId);
//       }
//     });
//
//   });
//
// });
