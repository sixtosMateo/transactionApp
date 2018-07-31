// what happen when the purchasedPrice changes
//when its in the thousandth it should round it not ceil
$("#itemFormStyle").hide();
$("#itemsTable").hide();
$("#formButtons").hide();

$("#idBarcode").change(function(){
  $("#itemFormStyle").hide();
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

localStorage.setItem('subtotal', 0);
function subtotal(price){
  var increment = parseFloat(localStorage.getItem('subtotal'));
  increment += parseFloat(price);
  localStorage.setItem('subtotal', increment);
  localStorage.setItem('tax', increment * .0925);
  localStorage.setItem('total', increment + (increment * .0925));
  $('#sub').html("Subtotal: <input type='text' id='subtotal' name='subtotal' value=" +Math.ceil(localStorage.getItem('subtotal')*100) / 100 + " readonly><br>");
  $('#taxTotal').html("Tax: <input type='text' id='tax' name='tax' value=" +Math.ceil(localStorage.getItem('tax')*100) / 100 + " readonly><br>");
  $('#tot').html("Total: <input type='text' id='total' name='total' value=" +Math.ceil(localStorage.getItem('total')*100) / 100+ " readonly><br>");

}



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
  var tableName = $("#itemsTable");
  if(found == false){
    $("#itemFormStyle").show();
  }
  else{
    $('#itemsTable').show()
    $("#formButtons").show();
    if($("#"+data.itemId).length == 0){
      // var transItem = new OutgoingTransactionItem(data);
      tableName.append("<tr id=" + data.itemId + ">" +
                        "<td id='itemId' value='"+data.itemId+"'>"+data.itemId+"</td>"+
                        "<td id='name' value='"+data.name+"'>"+data.name+"</td>"+
                        "<td id='price' value='"+data.purchasedPrice+"'>"+data.purchasedPrice+"</td>"+
                        "<td id='qty' value='"+1+"'>"+1+"</td>"+
                        "</tr>");
    }
    else{
      var qtyValue = parseInt(tableName.find('tr#' + data.itemId).find('td#qty').html());
      qtyValue++;

      //replaceWith is replacing an element with another, in this case itself with new values
      tableName.find('tr#' +data.itemId).find('td#qty').replaceWith(
        "<td id='qty' value='"+ qtyValue  +"'>"+ qtyValue +"</td>")

    }
    subtotal(data.purchasedPrice);
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
