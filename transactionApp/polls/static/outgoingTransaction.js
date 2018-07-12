$("#id").change(function(){

  $(function(){
    $('#itemNotFound').html("Item Not Found");
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
            $('#itemNotFound').hide();
            $("#itemsList").append("<dt> Barcode: "+item.barcode+" Name: "+item.name+" Price: "+ item.salePrice + "</dt></br>");
            $count++;
            return item;
        }
        });
        if($count==0){
          $('#itemNotFound').show();
      }
    }
    });
  });
});
