// things to change on this page:
// make function that set and get items from local storage
// change: initializing trasanction item not found messages appear for a second
// content need to appear even after page refresh unless user cancel Transaction
// parserInt should be in double since its money

$('#itemNotFound').hide();

$( "#cancel" ).click(function() {
  localStorage.clear();
  location.reload();
});



$("#id").change(function(){
  $(function(){
    var $input = $("#id").val();
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
    $("#id").val("");
  });
});

// function displays the item info
function displayItemScanned(object){
  var $itemDetails = $('#itemsList');
  $('#itemNotFound').hide();

  if(object){
    object.forEach(function(key){
      if(key.itemQty==1){
        $itemDetails.append("<dt id=" + key.itemId + "> Item Id: " + key.itemId +
        " Item Name: " + key.itemName+ " Price: " + key.itemSalePrice+" Qty: " +
        key.itemQty + "</dt>");
      }else{
        $("#"+key.itemId).text("Item Id: "+ key.itemId + " Item Name: " +
        key.itemName + " Price: " + key.itemSalePrice+" Qty: " + key.itemQty);
      }
    });
  }else{
    $('#itemNotFound').show();
  }
}

localStorage.setItem('subtotal',0);

function subtotal(price){
  var $subtotal = $('#subtotal');
  var increment = parseInt(localStorage.getItem('subtotal'));
  increment += parseInt(price);
  localStorage.setItem('subtotal', increment);
  $subtotal.text("Subtotal: " + localStorage.getItem('subtotal'));
}
