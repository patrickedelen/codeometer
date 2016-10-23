var mainEmail = '';

$("#email-form").submit(function(e) {
    e.preventDefault();            
        $.ajax({
            url     : $(this).attr('action'),
            type    : $(this).attr('method'),
            dataType: 'json',
            data    : $(this).serialize(),
            success : function( data ) {
                         console.log(data);
                         processData(data);
                         getMembers(data.team);
            },
            error   : function( xhr, err ) {
                         alert('Error');     
            }
        });    
        return false;
    });

$("#member-form").submit(function(e) {
    console.log($("#member").val());
    var formData = {
        email : mainEmail,
        member : $("#member").val()
    }

    console.log(formData);
    
    e.preventDefault();            
        $.ajax({
            url     : $(this).attr('action'),
            type    : $(this).attr('method'),
            dataType: 'json',
            data    : formData,
            success : function( data ) {
                         console.log(data);
            },
            error   : function( xhr, err ) {
                         alert('Error');     
            }
        });    
        return false;
    });


function getMembers(team) {
    $("#member-form").removeClass("hidden");
    $("#none").removeClass("hidden");

    var teamMembers = [];

    var expected = team.length;
    var current = 0;


    team.forEach(function(element) {
        $.ajax(
            {url: '/api/user/get', 
            type: 'post', 
            dataType: 'json', 
            data : {email: element}, 
            success: function(data) {
                teamMembers.push(data);
                current++;
                if(current == expected) {
                    processTeamData(teamMembers);
                }
            }, 
            error: function(xhr, err) {console.log(err);}
        });
    });
}

function processData(data) {
    mainEmail = data.email;

    $("#individualChart").empty();

    $("#individualInfo h4").text('You have written ' + data.totalLines + ' lines of code!');

    var chartData = [];
    for(var i = data.reports.length - 1; i >= 0; i--) {
        if(chartData.length < 5) {
            chartData.push(data.reports[i].lines);
        } else {
            break;
        }
    }

    while(chartData.length < 5){
        chartData.push(0);
    }

    chartData.reverse();

    console.log(chartData);

    var ci = document.getElementById("individualChart");
    var individChart = new Chart(ci, {
        type: 'bar',
        data: {
            labels: ["t-20m", "t-15m", "t-10m", "t-5m", "t=now"],

            datasets: [{
                label: data.email,
                data: chartData,
                backgroundColor: "rgba(140, 232, 140, 1)"
            }]
        }
    });
}

function processTeamData(team) {
    $("#teamChart").empty();

    var teamDataset = [];
    var totalLines = 0;
    
    team.forEach(function(element) {
        totalLines += element.totalLines;

        var chartData = [];
        for(var i = element.reports.length - 1; i >= 0; i--) {
            if(chartData.length < 5) {
                chartData.push(element.reports[i].lines);
            } else {
                break;
            }
        }

        while(chartData.length < 5){
            chartData.push(0);
        }

        chartData.reverse();

        var randomColor = "rgba(" + Math.floor(Math.random()*256) + ',' + Math.floor(Math.random()*256) + ',' + Math.floor(Math.random()*256) + ',' + '1)';

        teamDataset.push({
            label: element.email,
            data: chartData,
            backgroundColor: randomColor
        });
    });

    console.log(teamDataset);

    var teamGraphOptions = {
        scales: {
            yAxes: [{
                stacked: true
            }],
            xAxes: [{
                stacked: true
            }]
        }
    };

    $("#teamInfo h4").text('Your team has written ' + totalLines + ' lines of code!');

    var ct = document.getElementById("teamChart");
    var teamChart = new Chart(ct, {
        type: 'bar',
        data: {
            labels: ["t-20m", "t-15m", "t-10m", "t-5m", "t=now"],

            datasets: teamDataset
        },
        options: {
            scales: {
                yAxes: [{
                    stacked: true
                }],
                xAxes: [{
                    stacked: true
                }]
            }
        }
    });

    
}