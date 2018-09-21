$('#damageCost').ready(function(){
var itemId = inStockQty = []
var graphDiv = document.getElementById('damageCost')

$.ajaxSetup({
    type: 'GET',
    url: 'polls/api/plotly/damageCostReport/',
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken",
            jQuery("[name=csrfmiddlewaretoken]").val());
        }
    }
});

$.ajax({
    method: "GET",
    url: '/polls/api/plotly/damageCostReport/',
    success: function(data){
        id = data.id
        qty = data.qty
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
        x: id,
        y: qty,
        type: 'line',
        orientation: 'v',
        marker: {
            color: '#23b7e5',
        },
    }];
    var layout = {
        title: 'Damage Cost Report',
        titlefont: {
            family: 'Droid Sans Mono',
            size: 36,
            color: '#000000'
        },
        margin: {l:200},
    };

    Plotly.newPlot('damageCost', data, layout);
}

})
