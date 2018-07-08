$("#id").change(function(){

  $(function(){
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

            $("dt").append("Barcode: "+item.barcode+" Name: "+item.name+" Price: "+ item.salePrice + "</br>");
            $count++;
            return;
        }
        });
        if($count==0){
          $transactionItem.html("Item Not Found");

      }
    }
    });
  });
});
