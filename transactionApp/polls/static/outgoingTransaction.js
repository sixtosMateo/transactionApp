$("#id").change(function(){

  $(function(){
    var $transactionItem = $('#transactionItem');
    var $editButton = $('#edit');
    var $deleteButton = $('#delete');
    var $input = $("#id").val();
    var $count =0;
    $.ajax({
      type: 'GET',
      url:'/polls/items/',
      success:function(items){
        $.each(items, function(i,item){
          if(item.itemId == $input){
            $transactionItem.html("Barcode: "+ item.barcode +" Name: " + item.name +" Price: "+item.salePrice);

            $count++;
            return;
        }
        });
        if($count==0){
          $itemDetails.html("Item Not Found");
          $itemName.html();
          $itemQty.html();
          $price.html();
        }
      }
    });

  });

});
