$(document).ready(function(){
var endpoint = '/polls/api/items/'
var itemId = inStockQty = []
var graphDiv = document.getElementById('items')

$.ajaxSetup({
    type: 'GET',
    url: '/polls/api/items/',
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken",
            jQuery("[name=csrfmiddlewaretoken]").val());
        }
    }
});

$.ajax({
    method: "GET",
    url: '/polls/api/items/',
    success: function(data){
        itemId = data.itemId
        inStockQty = data.inStockQty
        articleChart()
        transcriptChart()
    // console.log(data)
    },
    error: function(error_data){
        console.log("error")
        console.log(error_data)
    },
})

function articleChart(){
    var data = [{
        x: itemId,
        y: inStockQty,
        type: 'bar',
        orientation: 'h',
        marker: {
            color: '#23b7e5',
        },
    }];
    var layout = {
        title: 'Number of Articles per Company',
        titlefont: {
            family: 'Droid Sans Mono',
            size: 36,
            color: '#000000'
        },
        margin: {l:200},
    };

    Plotly.newPlot(graphDiv, data, layout);
}

})
