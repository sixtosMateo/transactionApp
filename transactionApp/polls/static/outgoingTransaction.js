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
    else{
        var x = JSON.parse(localStorage.getItem($input));
        // if(x[0].itemQty !== 1){
        x[0].itemQty= x[0].itemQty +1;
        // }
        window.alert(x[0].itemQty);

        x.forEach(function(key){
          $itemDetails.append("<dt> Item Id: "+key.itemId+ " Item Name: "+key.itemName+ " Sale Price " +key.itemSalePrice+" Qty: "+key.itemQty +"</dt>");
        });




    }

  });

});



$( "#cancel" ).click(function() {

  localStorage.clear();
  window.alert( "localStorage was clear" );
});
