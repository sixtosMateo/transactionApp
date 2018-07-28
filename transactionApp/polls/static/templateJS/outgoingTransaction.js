class OutgoingTransaction {
  //initialize object parameters for each OutgoingTransaction
  constructor() {
    // this.scannedItem = $("#idBarcode");
    this.store = $("#storeId").val();
    this.employeeId = $("#employeeId").val();
    this.subtotal = $("#subtotal").val();
    this.tax = $("#tax").val();
    this.total = $("#total").val();
  }

  postObject(){
        // ajaxSetup keeps CSRFToken safe from attacks since we using external url
        //jQuery("[name=csrfmiddlewaretoken]").val()); -> access value of csrf token
        $.ajaxSetup({
            type: 'POST',
            url:'/polls/api/outgoingTransactions/',
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
            'storeId': this.store,
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

class OutgoingTransactionItem{

  constructor(data) {
    // this.scannedItem = $("#idBarcode");
    this.item = data.itemId;
    this.name = data.name;
    this.qty = 1;
    this.price = data.salePrice;
    this.tax = .0975;
  }

  postObject(){
        // ajaxSetup keeps CSRFToken safe from attacks since we using external url
        //jQuery("[name=csrfmiddlewaretoken]").val()); -> access value of csrf token
        $.ajaxSetup({
            type: 'POST',
            url:'/polls/api/outgoingTransactionItems/',
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
            'itemId': this.item,
            'quantitySold': this.qty,
            'tax': this.tax,
            'subtotal': this.subtotal,
            'transactionId':this.obj
            },
            dataType: 'application/json',
            success:function(data){
            }
        });
  }
}


function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

// does ajax call to retrieve function and uses callback function
function retriveItemData(callback){
  var $input = $("#idBarcode").val();
  var itemContainer = [];
  return $.ajax({
         type: 'GET',
         url:'/polls/api/items/',
         success:function(items){
           $.each(items, function(i,item){
             // if the id from the item is the same as the input
             if(item.itemId == $input){
               // window.alert(item.itemId);
               callback(item);
           }});
         },
       });
}

localStorage.setItem('subtotal', 0);

// callback function returns item object
function itemCallback(data){
  subtotal(data.salePrice);
}

function createTransactionItem(data){
  var tableName = $("#itemsList");

  if($("#"+data.itemId).length == 0){
    var transItem = new OutgoingTransactionItem(data);
    tableName.append("<tr id=" + transItem.item + ">" +
                      "<td id='itemId' value='"+transItem.item+"'>"+transItem.item+"</td>"+
                      "<td id='name' value='"+transItem.name+"'>"+transItem.name+"</td>"+
                      "<td id='price' value='"+transItem.price+"'>"+transItem.price+"</td>"+
                      "<td id='qty' value='"+transItem.qty+"'>"+transItem.qty+"</td>"+
                      "</tr>");
  }

//         $itemDetails.append("<dt id=" + key.itemId + "> Item Id: " + key.itemId
//         + " Item Name: " + key.itemName+ " Price: " + key.itemSalePrice+
//         " Qty: " + key.itemQty + "</dt>");


}

function subtotal(price){
  var increment = parseFloat(localStorage.getItem('subtotal'));
  increment += parseFloat(price);
  localStorage.setItem('subtotal', increment);
  localStorage.setItem('tax', increment * .0975);
  localStorage.setItem('total', increment + (increment * .0975));
  $('#sub').html("Subtotal: <input type='text' id='subtotal' name='subtotal' value=" +Math.ceil(localStorage.getItem('subtotal')*100) / 100 + " readonly><br>");
  $('#taxTotal').html("Tax: <input type='text' id='tax' name='tax' value=" +Math.ceil(localStorage.getItem('tax')*100) / 100 + " readonly><br>");
  $('#tot').html("Total: <input type='text' id='total' name='total' value=" +Math.ceil(localStorage.getItem('total')*100) / 100+ " readonly><br>");

}



$('#itemNotFound').hide();
// this can set in function
$("#idBarcode").change(function(){
    retriveItemData(itemCallback);
    retriveItemData(createTransactionItem);


  $("#idBarcode").val("");

});




$( "#submit" ).click(function() {
  var newTransaction =  new OutgoingTransaction();
  newTransaction.postObject();
  localStorage.clear();
  location.reload();
});

$( "#cancel" ).click(function() {
  localStorage.clear();
  location.reload();
});

//$('#elemId').length -> this to check if element with ID exist

// $input = $("#idBarcode").val();
//
// if(localStorage.getItem($input) == null){
//
//   var item = new OutgoingTransactionItem(data);
//
//   localStorage.setItem(item.item, JSON.stringify(item));
//
//   $( "#itemsList" ).append( "<dt id="+ item.item+" > qty: "+ item.item+ " "+item.qty+" <dt>" );
//   // subtotal(item.price);
// }
// else{
//   var repeatedItem = JSON.parse(localStorage.getItem($input));
//   repeatedItem.qty++;
//
//   localStorage.setItem($input, JSON.stringify(repeatedItem));
//
//   $( "#"+ repeatedItem.item).text("qty: "+repeatedItem.qty );
//   // subtotal(repeatedItem.price);
 // }


// localStorage.setItem('subtotal', 0);
// localStorage.setItem('total', 0);
//
// funtion updates the value of subtotal and total base on user input




//=============================================================================

// // things to change on this page:
// // make function that set and get items from local storage
// // change: initializing trasanction item not found messages appear for a second
// // content need to appear even after page refresh unless user cancel Transaction
// // float number should only be display to the tenth decimal
// // dont make ajax eveytime something gets scan do it once and store it locally
// // total and subtotal doesnt contain the value
// // jQuery("[name=csrfmiddlewaretoken]").val(); this is acces the cookie
// // create a function that makes ajax function with arguments
//
//
// $('#itemNotFound').hide();
//

//
// $("#idBarcode").change(function(){
//   $(function(){
//     var $input = $("#idBarcode").val();
//     var $itemId = $('#itemId');
//     var $itemName = $('#itemName');
//     var $itemQty= $('#itemQty');
//     var $price = $('#price');
//
//     // if the input id doesnt exist in local storage
//     if(localStorage.getItem($input) == null){
//
//       var $itemContainer = [];
//
//       // make ajax get request to look for item
//       $.ajax({
//         type: 'GET',
//         url:'/polls/api/items/',
//         success:function(items){
//           $.each(items, function(i,item){
//             // if the id from the item is the same as the input
//             if(item.itemId == $input){
//               var itemId = item.itemId;
//               var itemName = item.name;
//               var itemSalePrice = item.salePrice;
//               var itemQty = 1;
//               var tax = .0975;
//
//               // push all items as json object into $itemContainer array
//               $itemContainer.push({"itemId": itemId, "itemName": itemName,
//               "itemSalePrice": itemSalePrice, "itemQty": itemQty, "tax": tax});
//
//               // set the item into localStorage as json object
//               localStorage.setItem(itemId, JSON.stringify($itemContainer));
//
//               displayItemScanned(JSON.parse(localStorage.getItem(itemId)));
//               subtotal(itemSalePrice);
//               return;
//           }});
//         }});
//     }
//     else{
//       // if $input has been stored in local storage update the qty
//       var updateItem = JSON.parse(localStorage.getItem($input));
//       updateItem[0].itemQty++;
//       localStorage.setItem(updateItem[0].itemId, JSON.stringify(updateItem));
//       subtotal(updateItem[0].itemSalePrice);
//     }
//
//     // parse the json object from localStorage based on the input
//     var x = JSON.parse(localStorage.getItem($input));
//     displayItemScanned(x);
//     $("#idBarcode").val("");
//   });
// });
//
//
// function completeTransaction(){
//     // access value of total and subtotal from local localStorage
//
//     var $subtotal = parseFloat(localStorage.getItem('subtotal'));
//     var $total = parseFloat(localStorage.getItem('total'));
//
//     // ajaxSetup keeps CSRFToken safe from attacks since we using external url
//     //jQuery("[name=csrfmiddlewaretoken]").val()); -> access value of csrf token
//     $.ajaxSetup({
//         type: 'POST',
//         url:'/polls/api/outgoingTransactions/',
//         beforeSend: function(xhr, settings) {
//             if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
//                 xhr.setRequestHeader("X-CSRFToken",
//                 jQuery("[name=csrfmiddlewaretoken]").val());
//             }
//         }
//     });
//     // sets up the data into json format
//     $.ajax({
//         data:{
//         'storeId': $('#storeId').val(),
//         'employeeId': $('#employeeId').val(),
//         'tax': .0975,
//         'subtotal': $subtotal,
//         'total': $total
//         },
//         dataType: 'application/json',
//         success:function(data){
//         }
//     });
//
// }
//
//
// // function displays the item info
// function displayItemScanned(object){
//   var $itemDetails = $('#itemsList');
//   $('#itemNotFound').hide();
//
//   if(object){
//     // iterating data fields from localStorage object that was pass in
//     object.forEach(function(key){
//       if(key.itemQty==1){
//         $itemDetails.append("<dt id=" + key.itemId + "> Item Id: " + key.itemId
//         + " Item Name: " + key.itemName+ " Price: " + key.itemSalePrice+
//         " Qty: " + key.itemQty + "</dt>");
//       }else{
//         $("#"+key.itemId).text("Item Id: "+ key.itemId + " Item Name: " +
//         key.itemName + " Price: " + key.itemSalePrice+" Qty: " + key.itemQty);
//       }
//     });
//   }else{
//     $('#itemNotFound').show();
//   }
// }
//
//
// localStorage.setItem('subtotal', 0);
// localStorage.setItem('total', 0);
// //
// // funtion updates the value of subtotal and total base on user input
// function subtotal(price){
//   var increment = parseFloat(localStorage.getItem('subtotal'));
//   increment += parseFloat(price);
//   localStorage.setItem('subtotal', increment);
//   localStorage.setItem('total', increment + (increment * .0975));
//   $('#subtotal').text("Subtotal: " + localStorage.getItem('subtotal'));
//   $('#total').text("Total: " + localStorage.getItem('total'));
// }
