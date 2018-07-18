$( "#idBarcode" ).change(function() {

});



$( "#cancel" ).click(function() {
  localStorage.clear();
  location.reload();

});

function completeTransaction(){
    // access value of total and subtotal from local localStorage
    // var $subtotal = parseFloat(localStorage.getItem('subtotal'));
    // var $total = parseFloat(localStorage.getItem('total'));

    // ajaxSetup keeps CSRFToken safe from attacks since we using external url
    //jQuery("[name=csrfmiddlewaretoken]").val()); -> access value of csrf token
    $.ajaxSetup({
        type: 'POST',
        url:'/polls/api/incomingTransactions/',
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
        'vendorId': $('#vendorId').val(),
        'employeeId': $('#employeeId').val(),
        'tax': .0975,
        'subtotal': 1,
        'total': 1
        },
        dataType: 'application/json',
        success:function(data){
        }
    });
}

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
