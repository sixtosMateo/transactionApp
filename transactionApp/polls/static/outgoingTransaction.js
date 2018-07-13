$("#id").change(function(){

  $(function(){
    var $input = $("#id").val();
    var $itemId = $('#itemId');
    var $itemName = $('#itemName');
    var $itemDetails = $('#itemsList');
    var $itemQty= $('#itemQty');
    var $price = $('#price');


    if(localStorage.getItem($input) == null){
      var $itemContainer = [];
      $.ajax({
        type: 'GET',
        url:'/polls/items/',
        success:function(items){


          $.each(items, function(i,item){

            if(item.itemId == $input){
              var itemId = item.itemId;
              var itemName = item.name;
              var itemSalePrice = item.salePrice;
              var itemQty = 1;
              $itemContainer.push({"itemId": itemId, "itemName": itemName, "itemSalePrice": itemSalePrice, "itemQty": itemQty});
              localStorage.setItem(itemId, JSON.stringify($itemContainer));
              // $itemDetails.show();
              // $itemNotFound.hide();
              // $count++;
              return;
          }
          });
          // if($count==0 ){
          //   $itemDetails.hide();
          //   $itemNotFound.show();
          //
          // }
        }
      });

    }
    var x = JSON.parse(localStorage.getItem($input));
    displayItemScanned(x);


  });
});


function displayItemScanned(object){
  var $itemDetails = $('#itemsList');
  if(object){

    object.forEach(function(key){
      $itemDetails.append("<dt> Item Id: "+key.itemId+ " Item Name: "+key.itemName+ " Sale Price " +key.itemSalePrice+" Qty: "+key.itemQty +"</dt>");
    });
  }


}

$( "#cancel" ).click(function() {
  localStorage.clear();
  window.alert( "localStorage was clear" );
  location.reload();
});
