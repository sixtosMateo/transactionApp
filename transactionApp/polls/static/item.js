$("#id").change(function(){

  $(function(){
    var $itemName = $('#itemName');
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
          $itemName.html("Item Not Found");
        }
      }
    });

  });

});
