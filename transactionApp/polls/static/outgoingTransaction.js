// things to change on this page:
// make function that set and get items from local storage
// change: initializing trasanction item not found messages appear for a second
// content need to appear even after page refresh unless user cancel Transaction
// float number should only be display to the tenth decimal
// dont make ajax eveytime something gets scan do it once and store it locally
// total and subtotal doesnt contain the value
// jQuery("[name=csrfmiddlewaretoken]").val(); this is acces the cookie

$('#itemNotFound').hide();

$( "#cancel" ).click(function() {
  localStorage.clear();
  location.reload();
});

$("#idBarcode").change(function(){
  $(function(){
    var $input = $("#idBarcode").val();
    var $itemId = $('#itemId');
    var $itemName = $('#itemName');
    var $itemQty= $('#itemQty');
    var $price = $('#price');

    // if the input id doesnt exist in local storage
    if(localStorage.getItem($input) == null){

      var $itemContainer = [];

      // make ajax get request to look for item
      $.ajax({
        type: 'GET',
        url:'/polls/items/',
        success:function(items){
          $.each(items, function(i,item){
            // if the id from the item is the same as the input
            if(item.itemId == $input){
              var itemId = item.itemId;
              var itemName = item.name;
              var itemSalePrice = item.salePrice;
              var itemQty = 1;

              // push all items as json object into $itemContainer array
              $itemContainer.push({"itemId": itemId, "itemName": itemName,
              "itemSalePrice": itemSalePrice, "itemQty": itemQty});

              // set the item into localStorage as json object
              localStorage.setItem(itemId, JSON.stringify($itemContainer));
              displayItemScanned(JSON.parse(localStorage.getItem(itemId)));
              subtotal(itemSalePrice);
              return;
          }});
        }});
    }
    else{
      // if $input has been stored in local storage update the qty
      var updateItem = JSON.parse(localStorage.getItem($input));
      updateItem[0].itemQty++;
      localStorage.setItem(updateItem[0].itemId, JSON.stringify(updateItem));
      subtotal(updateItem[0].itemSalePrice);
    }

    // parse the json object from localStorage based on the input
    var x = JSON.parse(localStorage.getItem($input));
    displayItemScanned(x);
    $("#idBarcode").val("");
  });
});


function completeTransaction(){

    // access value of total and subtotal from local localStorage
    var $subtotal = parseFloat(localStorage.getItem('subtotal'));
    var $total = parseFloat(localStorage.getItem('total'));

    // ajaxSetup keeps CSRFToken safe from attacks since we using external url
    //jQuery("[name=csrfmiddlewaretoken]").val()); -> access value of csrf token
    $.ajaxSetup({
        type: 'POST',
        url:'/polls/outgoingTransactions/',
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
        'storeId': $('#storeId').val(),
        'employeeId': $('#employeeId').val(),
        'tax': .0975,
        'subtotal': $subtotal,
        'total': $total
        },
        dataType: 'application/json',
        success:function(data){
        }
    });


  // $(function(){
  //   $.ajaxSetup({
  //       type: 'POST',
  //       url:'/polls/',
  //       beforeSend: function(xhr, settings) {
  //           if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
  //               xhr.setRequestHeader("X-CSRFToken",
  //               jQuery("[name=csrfmiddlewaretoken]").val());
  //           }
  //       }
  //   });
  //   // sets up the data into json format
  //   $.ajax({
  //       data:{
  //       'storeId': ,
  //       'employeeId': ,
  //       'tax': .0975,
  //       'subtotal': ,
  //       'total':
  //       },
  //       dataType: 'application/json',
  //       success:function(data){
  //       }
  //   });
  // });
}

// function displays the item info
function displayItemScanned(object){
  var $itemDetails = $('#itemsList');
  $('#itemNotFound').hide();

  if(object){
    // iterating data fields from localStorage object that was pass in
    object.forEach(function(key){
      if(key.itemQty==1){
        $itemDetails.append("<dt id=" + key.itemId + "> Item Id: " + key.itemId
        + " Item Name: " + key.itemName+ " Price: " + key.itemSalePrice+
        " Qty: " + key.itemQty + "</dt>");
      }else{
        $("#"+key.itemId).text("Item Id: "+ key.itemId + " Item Name: " +
        key.itemName + " Price: " + key.itemSalePrice+" Qty: " + key.itemQty);
      }
    });
  }else{
    $('#itemNotFound').show();
  }
}


localStorage.setItem('subtotal', 0);
localStorage.setItem('total', 0);

// funtion updates the value of subtotal and total base on user input
function subtotal(price){
  var increment = parseFloat(localStorage.getItem('subtotal'));
  increment += parseFloat(price);
  localStorage.setItem('subtotal', increment);
  localStorage.setItem('total', increment + (increment * .0975));
  $('#subtotal').text("Subtotal: " + localStorage.getItem('subtotal'));
  $('#total').text("Total: " + localStorage.getItem('total'));
}

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
