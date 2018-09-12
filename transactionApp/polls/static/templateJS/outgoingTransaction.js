// things to change on this page:
// delete items from table or decrease qty
// change: initializing trasanction item not found messages appear for a second
// dont make ajax eveytime something gets scan do it once and store it locally
// jQuery("[name=csrfmiddlewaretoken]").val(); this is acces the cookie
// i need to update the total quantity of inventory when OutgoingTransaction is posted

//************************** CLASSES and GLOBAL Varibles:**************************


var outTransactionItems = [];


class OutgoingTransactionItem{
  // initialize object parameters for each OutgoingTransactionItem
  constructor(data) {
    this.itemId = data.itemId;
    this.name = data.name;
    this.quantitySold = 1;
    this.price = data.salePrice;
    this.tax = .0925;
  }
}

//************************** USEFUL FUNCTION:**************************



// does ajax call to retrieve data and takes in a callback function to access data
function retriveItemData(callback){
  var $input = $("#idBarcode").val();
  var itemContainer = [];
  return $.ajax({
         type: 'GET',
         url:'/polls/api/items/',
         success:function(items){
           $.each(items, function(i,item){
             // if the id from the item is the same as the input
             if(item.itemId == $input){
               // window.alert(item.itemId);
               callback(item);
           }});
         }
       });
}

localStorage.setItem('subtotal', 0);

// callback function calls a function that display and update subtotal, total, tax
function itemCallback(data){
  subtotal(data.salePrice);
}

//this is a callback funtion that display a table with the object data
function createTransactionItem(data){
  var tableName = $("#itemsList");
  $('#itemsList').show()
  $('#formButtons').show()
  if($("#"+data.itemId).length == 0){

    var newTransactionItem =  new OutgoingTransactionItem(data);

    outTransactionItems.push(newTransactionItem);
    // var transItem = new OutgoingTransactionItem(data);
    tableName.append("<tr id=" + data.itemId + ">" +
                      "<td id='itemId' value='"+data.itemId+"'>"+data.itemId+"</td>"+
                      "<td id='name' value='"+data.name+"'>"+data.name+"</td>"+
                      "<td id='price' value='"+data.salePrice+"'>"+data.salePrice+"</td>"+
                      "<td id='qty' value='"+1+"'>"+1+"</td>"+
                      "</tr>");
  }
  else{
    // updates the qty in array for specific object
    outTransactionItems.forEach(function(transactionItem, data){
      if(transactionItem.itemId == data.itemId){
        transactionItem.quantitySold = transactionItem.quantitySold+1;
      }
    });

    // find() function allows to access each element that we are looking for
    var qtyValue = parseInt(tableName.find('tr#' + data.itemId).find('td#qty').html());
    qtyValue++;

    //replaceWith is replacing an element with another, in this case itself with new values
    tableName.find('tr#' +data.itemId).find('td#qty').replaceWith(
      "<td id='qty' value='"+ qtyValue  +"'>"+ qtyValue +"</td>")
  }

}

function postObject(outTransactionItems){

        var store = $("#storeId").val();
        var employeeId = $("#employeeId").val();
        var subtotal = $("#subtotal").val();
        var tax = $("#tax").val();
        var total = $("#total").val();
        // ajaxSetup keeps CSRFToken safe from attacks since we using external url
        //jQuery("[name=csrfmiddlewaretoken]").val()); -> access value of csrf token
        $.ajaxSetup({
            type: 'POST',
            url:'/polls/api/outgoingTransactions/',
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken",
                    jQuery("[name=csrfmiddlewaretoken]").val());
                }
            }
        });
        // sets up the data into json format
        $.ajax({
            data:{
            'storeId': store,
            'employeeId': employeeId,
            'tax': tax,
            'subtotal': subtotal,
            'total':total,
            'transactionItems': JSON.stringify(outTransactionItems)
            },
            dataType: 'application/json',
            success:function(data){
            },
            error: function(error_data){
                console.log("error")
                console.log(error_data)
            },
        });
  }

function subtotal(price){
  var increment = parseFloat(localStorage.getItem('subtotal'));
  increment += parseFloat(price);
  localStorage.setItem('subtotal', increment);
  localStorage.setItem('tax', increment * .0925);
  localStorage.setItem('total', increment + (increment * .0925));
  $('#sub').html("Subtotal: <input type='text' id='subtotal' name='subtotal' value=" +Math.ceil(localStorage.getItem('subtotal')*100) / 100 + " readonly><br>");
  $('#taxTotal').html("Tax: <input type='text' id='tax' name='tax' value=" +Math.ceil(localStorage.getItem('tax')*100) / 100 + " readonly><br>");
  $('#tot').html("Total: <input type='text' id='total' name='total' value=" +Math.ceil(localStorage.getItem('total')*100) / 100+ " readonly><br>");

}

//************************** EVENT LISTENER:**************************


$('#itemsList').hide()
$("#formButtons").hide();

// this can set in function
$("#idBarcode").change(function(){
    $('#itemNotFound').hide();
    retriveItemData(itemCallback);
    retriveItemData(createTransactionItem);
    $("#idBarcode").val("");

});


$( "#submit" ).click(function() {
  postObject(outTransactionItems);
  // localStorage.clear();
  // location.reload();
});

$( "#cancel" ).click(function() {
  localStorage.clear();
  location.reload();
});
