$('#itemNotFound').hide();
$("#itemsTable").hide();
$("#idBarcode").change(function(){
  $('#itemNotFound').hide();
  getItem(callbackFound);

});


function getItem(callback){
  var $input = $("#idBarcode").val();
  var $exist =false;
  return $.ajax({
    type: 'GET',
    url:'/polls/api/items/',
    success:function(items){
      $.map(items, function (item){
        if(item.itemId == $input){
          $exist=true;
          callback($exist, item);

        }
      });
      if ($exist == false){
       callback($exist);
      }

    }
  });

}


function callbackFound(found, data){
  var tableName = $("#itemsTable");
  if(found == false){
    $('#itemsTable').hide()
    $('#itemNotFound').show();
  }
  else{
    $('#itemsTable').show()
    tableName.html(
                      "<tr id ='labels'>"+
                        "<th>Name:</th>"+
                        "<th>SalePrice:</th>"+
                        "<th>inStockQty:</th>"+
                        "<th>color:</th>"+
                        "<th>ageRequirement:</th>"+
                        "<th>vendorId:</th>"+
                        "<th>locationId:</th>"+
                        "<th>Barcode:</th>"+
                        "<th>Department:</th>"+
                      "</tr>"+
                      "<tr id=" + data.itemId + ">" +
                        "<td id='name' value='"+data.name+"'>"+data.name+"</td>"+
                        "<td id='salePrice' value='"+data.salePrice+"'>"+data.salePrice+"</td>"+
                        "<td id='qty' value='"+data.inStockQty+"'>"+data.inStockQty+"</td>"+
                        "<td id='color' value='"+data.color+"'>"+data.color+"</td>"+
                        "<td id='ageRequirement' value='"+data.ageRequirement+"'>"+data.ageRequirement+"</td>"+
                        "<td id='vendorId' value='"+data.vendorId+"'>"+data.vendorId+"</td>"+
                        "<td id='locationId' value='"+data.locationId+"'>"+data.locationId+"</td>"+
                        "<td id='barcode' value='"+data.barcode+"'>"+data.barcode+"</td>"+
                        "<td id='department' value='"+data.department+"'>"+data.department+"</td>"+
                      "</tr>");

  }
}
