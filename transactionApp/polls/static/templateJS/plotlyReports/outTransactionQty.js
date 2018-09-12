$('#transactionQty').ready(function(){
var itemId = inStockQty = []
var graphDiv = document.getElementById('transactionQty')

$.ajaxSetup({
    type: 'GET',
    url: '/polls/api/plotly/outgoingTransactionQty/',
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken",
            jQuery("[name=csrfmiddlewaretoken]").val());
        }
    }
});

$.ajax({
    method: "GET",
    url: '/polls/api/plotly/outgoingTransactionQty/',
    success: function(data){
        month = data.month
        transactionQty = data.transactionQty
        articleChart()
        <!-- transcriptChart() -->
    // console.log(data)
    },
    error: function(error_data){
        console.log("error")
        console.log(error_data)
    },
})
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
function articleChart(){
    var data = [{
        x: month,
        y: transactionQty,
        type: 'line',
        orientation: 'v',
        marker: {
            color: '#23b7e5',
        },
    }];
    var layout = {
        title: 'Outgoing Transaction per month',
        titlefont: {
            family: 'Droid Sans Mono',
            size: 36,
            color: '#000000'
        },
        margin: {l:200},
    };

    Plotly.newPlot('transactionQty', data, layout);
}

})
