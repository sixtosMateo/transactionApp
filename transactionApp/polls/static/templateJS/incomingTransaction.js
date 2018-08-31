// what happen when the purchasedPrice changes
//when its in the thousandth it should round it not ceil
//need to create a function that hide div

// barcode needs to be change it wont let me submit new item
// unless the value of barcode is unique the value of barcode is set to 6 right now


//************************** OBJECT SAVE AS CLASSES:**************************
class Item{
  constructor(){
    this.name = $("#name").val();
    this.inStockQty = $("#inStockQty").val();
    this.picture = $("#picture").val();
    this.color = $("#color").val();
    this.ageRequirement = $("#ageRequirement").val();
    this.purchasedPrice = $("#purchasedPrice").val();
    this.salePrice = $("#salePrice").val();
    this.vendorId = $("#vendorId").val();
    this.locationId = $("#locationId").val();
    this.barcode = $("#barcode").val();
    this.department = $("#department").val();
  }
  postNewItem(){
    $.ajaxSetup({
        type: 'POST',
        url:'../api/items/',
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken",
                jQuery("[name=csrfmiddlewaretoken]").val());
            }
        }
    });

    $.ajax({
        data:{
        'name': this.name,
        'inStockQty': this.inStockQty,
        'picture': this.picture,
        'color': this.color,
        'ageRequirement': this.ageRequirement,
        'purchasedPrice': this.purchasedPrice,
        'salePrice': this.salePrice,
        'vendorId': this.vendorId,
        'locationId': this.locationId,
        'barcode': this.barcode,
        'department': this.department
        },
        dataType: 'application/json',
        success:function(data){
        }
    });
  }

}

class IncomingTransaction{
  constructor(){
    this.vendor = $("#vendorId").val();
    this.employeeId = $("#employeeId").val();
    this.tax = $("#tax").val();
    this.subtotal = $("#subtotal").val();
    this.total = $("#total").val();
  }
  postObject(){
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
        'vendorId': this.vendor,
        'employeeId': this.employeeId,
        'tax': this.tax,
        'subtotal': this.subtotal,
        'total': this.total
        },
        dataType: 'application/json',
        success:function(data){

        }
    });
  }

}

class IncomingTransactionItem{
  constructor(){

  }
  
}
//************************** EVENT LISTENER:**************************

$("#itemFormStyle").hide();
$("#itemsTable").hide();
$("#formButtons").hide();

$("#idBarcode").change(function(){
  $("#itemFormStyle").hide();
  verifiedItemExist(callbackFound);
  $("#idBarcode").val("");
});

$( "#newItem" ).click(function() {
  var newItem = new Item();
  newItem.postNewItem();
  $("#itemFormStyle").hide();
});

$( "#submit" ).click(function() {
  // var newTransaction = new IncomingTransaction();
  var newTransactionItem = new IncomingTransactionItem();
  newTransactionItem.postObject();
  // newTransaction.postObject();

  localStorage.clear();
  location.reload();
});

$( "#cancel" ).click(function() {
  localStorage.clear();
  location.reload();
});

//************************** USEFUL FUNCTION:**************************

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

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

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
