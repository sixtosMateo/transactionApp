$("#newitemForm").hide();
$("#itemsTable").hide();
$("#idBarcode").change(function(){
  $("#newitemForm").hide();
  verifiedItemExist(callbackFound);
  $("#idBarcode").val("");
});

$( "#submit" ).click(function() {
  localStorage.clear();
  location.reload();
});

$( "#cancel" ).click(function() {
  localStorage.clear();
  location.reload();
});

function completeTransaction(){
    // access value of total and subtotal from local localStorage
    // var $subtotal = parseFloat(localStorage.getItem('subtotal'));
    // var $total = parseFloat(localStorage.getItem('total'));

    // ajaxSetup keeps CSRFToken safe from attacks since we using external url
    //jQuery("[name=csrfmiddlewaretoken]").val()); -> access value of csrf token
    $.ajaxSetup({
        type: 'POST',
        url:'/polls/api/incomingTransactions/',
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken",
                jQuery("[name=csrfmiddlewaretoken]").val());
            }
        }
    });
    // sets up the data into json format
    $.ajax({
        data:{
        'vendorId': $('#vendorId').val(),
        'employeeId': $('#employeeId').val(),
        'tax': .0975,
        'subtotal': 1,
        'total': 1
        },
        dataType: 'application/json',
        success:function(data){
        }
    });
}

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

// this function
function verifiedItemExist(callback){
  var $input = $("#idBarcode").val();
  var $exist =false;
  return $.ajax({
         type: 'GET',
         url:'/polls/api/items/',
         success:function(items){
           $.map(items, function (item){
             if(item.itemId == $input){
               $exist=true;
               callback($exist, item);

             }
           });
           if ($exist == false){
            callback($exist);
           }

         }
       });
  //
}

function callbackFound(found, data){
  if(found == false){
    $("#newitemForm").show();
  }
  else{
    $('#itemsTable').show()
  }

}

class IncomingTransactionItem{
  constructor(data){
    this.item = data.itemId;
    this.qty = data.quantityBought;
    this.store = data.storeId;
    this.price = data.purchasedPrice;
  }

}
