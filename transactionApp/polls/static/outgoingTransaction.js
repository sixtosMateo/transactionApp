$("#id").change(function(){

  $(function(){
    var $input = $("#id").val();

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
              $itemContainer.push(itemId, itemName, itemSalePrice, itemQty);
              localStorage.setItem(itemId, JSON.stringify($itemContainer));
              $itemDetails.show();
              $itemNotFound.hide();
              $count++;
              return;
          }
          });
          if($count==0 ){
            $itemDetails.hide();
            $itemNotFound.show();

          }
        }
      });

    }
    else{
      window.alert(JSON.parse(localStorage.getItem($input)));
    }

  });

});
