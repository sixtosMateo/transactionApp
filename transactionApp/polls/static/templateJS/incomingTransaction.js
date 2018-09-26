// what happen when the purchasedPrice changes
//when its in the thousandth it should round it not ceil
//need to create a function that hide div

// barcode needs to be change it wont let me submit new item
// unless the value of barcode is unique the value of barcode is set to 6 right now



//************************** OBJECT SAVE AS CLASSES:**************************
var inTransactionItems = [];
var transactionId;
// var tempBarcode = null;
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
        },
        complete:function(xhr){
          if(xhr.status != 201){
            console.log("Error-IncomingTransaction.js: postNewItem method")
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
        dataType: 'application/json'
    });
  }

}

class IncomingTransactionItem{
  constructor(data){
    this.barcode = data.barcode;
    this.name = data.name;
    this.quantityBought = 1;
    this.tax = (this.quantityBought * data.purchasedPrice) * .0925;
    this.purchasedPrice = data.purchasedPrice;
  }

}

//************************** USEFUL FUNCTION:**************************


localStorage.setItem('subtotal', 0);


function verifiedItemExist(callback){
  var $input = $("#idBarcode").val();
  var $exist =false;
  return $.ajax({
         type: 'GET',
         url:'/polls/api/items/',
         success:function(items){
           $.map(items, function (item){
             if(item.barcode == $input){
               $exist=true;
               callback($exist, item);

             }
           });
           if ($exist == false){
            callback($exist);
           }

         },
         error: function(data){
             console.log("error")
             console.log(error_data)
         },
       });
}


function callbackFound(found, data){
  var tableName = $("#itemsTable");
  if(found == false){
    $("#itemFormStyle").show();
  }
  else{
    $('#itemsTable').show()
    $("#formButtons").show();

    if($("#"+data.barcode).length == 0){

      subtotal(data.purchasedPrice);

      var newTransactionItem =  new IncomingTransactionItem(data);

      inTransactionItems.push(newTransactionItem);

      tableName.append("<tr id=" + data.barcode + ">" +
                        "<td id='barcode' value='"+data.barcode+"'>"+data.barcode+"</td>"+
                        "<td id='name' value='"+data.name+"'>"+data.name+"</td>"+
                        "<td id='purchasedPrice' value='"+data.purchasedPrice+"'>"+data.purchasedPrice+"</td>"+
                        "<td id='quantityBought' value='"+1+"'>"+1+"</td>"+
                        "</tr>");
    }
    else{
      subtotal(data.purchasedPrice);
      inTransactionItems.forEach(function(transactionItem){
        if(transactionItem.barcode == data.barcode){
          transactionItem.quantityBought = transactionItem.quantityBought + 1;
        }
      });

      var qtyValue = parseInt(tableName.find('tr#' + data.barcode).find('td#quantityBought').html());
      qtyValue++;

      //replaceWith is replacing an element with another, in this case itself with new values
      tableName.find('tr#' +data.barcode).find('td#quantityBought').replaceWith(
        "<td id='quantityBought' value='"+ qtyValue  +"'>"+ qtyValue +"</td>")

    }

  }


}

function postObject(inTransactionItems){
  var vendorId = $("#vendorId").val();
  var employeeId = $("#employeeId").val();
  var subtotal = $("#subtotal").val();
  var tax = $("#tax").val();
  var total = $("#total").val();

  $.ajaxSetup({
      type: 'POST',
      url:'/polls/api/incomingTransactions/',
      beforeSend: function(xhr, settings) {
          if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
              xhr.setRequestHeader("X-CSRFToken",
              jQuery("[name=csrfmiddlewaretoken]").val());
          }
      },

      complete: function(xhr){
        if(xhr.status == 201){
          transactionId = JSON.parse(xhr.responseText).transactionId;

          $.ajaxSetup({
              type: 'POST',
              url:'/polls/api/incomingTransactionsItems/',
              beforeSend: function(xhr, settings) {
                  if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                      xhr.setRequestHeader("X-CSRFToken",
                      jQuery("[name=csrfmiddlewaretoken]").val());
                  }
              },
              complete: function(xhr){
                if(xhr.status == 201){
                  location.reload();
                  localStorage.clear();
                  }
                }
              });

              inTransactionItems.forEach(function(arrayOfObject){
                    $.ajax({
                      data:
                      {   'barcode': arrayOfObject.barcode,
                          'quantityBought': arrayOfObject.quantityBought,
                          'purchasedPrice': arrayOfObject.purchasedPrice,
                          'tax': (arrayOfObject.quantityBought * arrayOfObject.purchasedPrice) *.0975 ,
                          'transactionId': transactionId},
                      dataType: 'application/json'
                    });
                  });
            }
        else{
              console.log("Error: IncomingTransaction.js file: PostObject");
            }
      }
  });
  // sets up the data into json format
  //write failed message
  $.ajax({
      data:{
      'vendorId': vendorId,
      'employeeId': employeeId,
      'tax': tax,
      'subtotal': subtotal,
      'total': total
      },
      dataType: 'application/json'
  });
}


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
//************************** EVENT LISTENER:**************************

$("#itemFormStyle").hide();
$("#itemsTable").hide();
$("#formButtons").hide();

$("#idBarcode").change(function(){

  $("#itemFormStyle").hide();
  // verifiedItemExist(itemCallback);
  verifiedItemExist(callbackFound);
  $("#barcode").val($("#idBarcode").val());
  $("#idBarcode").val("");
});

$( "#newItem" ).click(function() {
  var newItem = new Item();
  newItem.postNewItem();
  $("#itemFormStyle").hide();
});

$( "#submit" ).click(function() {
  postObject(inTransactionItems);

});

$( "#cancel" ).click(function() {
  localStorage.clear();
  location.reload();
});
