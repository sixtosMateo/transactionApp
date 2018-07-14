$('#itemNotFound').hide();

$( "#cancel" ).click(function() {
  localStorage.clear();
  window.alert( "localStorage was clear" );
  location.reload();
});


$("#id").change(function(){

  $(function(){
    var $input = $("#id").val();
    var $itemId = $('#itemId');
    var $itemName = $('#itemName');
    // var $itemDetails = $('#itemsList');
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
              $itemContainer.push({"itemId": itemId, "itemName": itemName, "itemSalePrice": itemSalePrice, "itemQty": itemQty});
              // set the item into localStorage as json object
              localStorage.setItem(itemId, JSON.stringify($itemContainer));
              return;
          }
          });
        }
      });


    }
    else{
      var updateItem = JSON.parse(localStorage.getItem($input));
      updateItem[0].itemQty++;
      localStorage.setItem(updateItem[0].itemId, JSON.stringify(updateItem));
    }

    // parse the json object from localStorage based on the input
    var x = JSON.parse(localStorage.getItem($input));
    displayItemScanned(x);


  });
});

// function displays the item into
function displayItemScanned(object){
  var $itemDetails = $('#itemsList');
  $('#itemNotFound').hide()
  if(object){
    object.forEach(function(key){
      $itemDetails.append("<dt> Item Id: "+key.itemId+ " Item Name: "+key.itemName+ " Sale Price " +key.itemSalePrice+" Qty: "+key.itemQty +"</dt>");
    });
  }
  else{
    $('#itemNotFound').show();
  }


}
