var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: '3E915g8lDT95ASTydrRmTno6f',
  consumer_secret: '21LrVnJTsoE92RRHdW8jEXUhfb5gKriHKR8hItl9oL2n5tEU83',
  access_token_key: '790193783530860544-TUE2M0KWn4Eu8g5zYjBLw8XRNwX7pIu',
  access_token_secret: 'VrGfxhNjKaIACluaWnZP5QRjXZ1AifZVP72CNB7VCOsdj'
});

// client.post('statuses/update', {status: 'Another tweet of awesomeness!'},  function(error, tweet, response) {
//   if(error) throw error;
//   //console.log(tweet);  // Tweet body. 
//   //console.log(response);  // Raw response object. 
// });

module.exports.updateTweets = function(user) {
    if(user.reports.length < 6) {
        return;
    }

    var reports = user.reports;
    reports.sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
    })

    var noCode = 0;


    for(let i = 0; i < 6; i++) {
        //console.log(reports[i]);

        if(reports[i].lines == 0) {
            noCode++;
        } else {
            break;
        }
    }

    console.log('total nocode: ' + noCode);

    if(noCode > 4){
        console.log('Tweeting to motivate ' + user.email);

        var tweetStatus = user.email + ' needs to code more!';

        console.log(tweetStatus);

        client.post('statuses/update', {status: tweetStatus},  function(error, tweet, response) {
            if(error) throw error;
            //console.log(tweet);  // Tweet body. 
            //console.log(response);  // Raw response object. 
        });
    }
}