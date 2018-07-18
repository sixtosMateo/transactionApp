$("#id").change(function(){

  $(function(){
    var $itemNotFound = $('#itemNotFound');
    var $itemName = $('#itemName');
    var $itemDetails = $('#itemDetails');
    var $itemQty= $('#itemQty');
    var $price = $('#price');
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
            $itemDetails.show();
            $itemNotFound.hide();
            $itemName.html("Item Name: " + item.name +"</br>");
            $itemQty.html("Item Qty: "+ item.inStockQty +"</br>");
            $price.html("Item Price:" + item.salePrice +"</br>");
            // $editButton.html("<a role ='button' href= '{% url 'editItem' item.itemId %}'> Edit </a>");
            // $deleteButton.html("Item Price:" + item.salePrice +"</br>");
            $count++;
            return;
        }
        });
        if($count==0){
          $itemDetails.hide();
          $itemNotFound.show();
        }
      }
    });

  });

});
