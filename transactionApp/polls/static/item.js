$("#id").change(function(){

  $(function(){
    var $items = $('#itemName');
    var $input = $("#id").val();
    var $count =0;
    $.ajax({
      type: 'GET',
      url:'/polls/items/',
      success:function(items){
        $.each(items, function(i,item){
          if(item.itemId == $input){
            $items.html(item.name +"</br>");
            $count++;
            return;
        }
        });
        if($count==0){
          $items.html("Item Not Found");
        }
      }
    });

  });

});
