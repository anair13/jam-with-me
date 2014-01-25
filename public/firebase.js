var MINUTES = 20;
var d = new Date();
var startTime = d.getTime();
var thissession = new Firebase('https://jamwithme.firebaseio.com/music/thissession');
thissession.on('value', function(snapshot) {
  var session = snapshot.val();
  var ID = session.ID;
  var endTime = session.endTime;
  
  setInterval(function() {
    var thisDate = new Date();
    $('#box_header').text(get_elapsed_time_string(Math.floor((endTime - thisDate.getTime())/1000)));
  }, 1000);
  var myDataRef = new Firebase('https://jamwithme.firebaseio.com/music/session'+ID);
  $('#messageInput').keypress(function (e) {
    var n = d.getTime();
    if(n > endTime) {
      killSession();
    }
    if (e.keyCode == 13) {
      var name = $('#nameInput').val();
      var text = $('#messageInput').val();
      var frequency = $('#testbox3').val();
      myDataRef.push({name: name, text: text, frequency: frequency});
      $('#messageInput').val('');
    }
  });
  myDataRef.on('child_added', function(snapshot) {
    var message = snapshot.val();
    displayChatMessage(message.name, message.text, message.frequency);
  });

});
function displayChatMessage(name, text) {
  $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
  $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
};
function killSession() {
  var n = d.getTime();
  var endTime = n + MINUTES * 60 * 1000;
  thissession.set({ID: n, endTime: endTime});
  location.reload(true);
}
function get_elapsed_time_string(total_seconds) {
    function pretty_time_string(num) {
      return ( num < 10 ? "0" : "" ) + num;
    }

    var hours = Math.floor(total_seconds / 3600);
    total_seconds = total_seconds % 3600;

    var minutes = Math.floor(total_seconds / 60);
    total_seconds = total_seconds % 60;

    var seconds = Math.floor(total_seconds);

    // Pad the minutes and seconds with leading zeros, if required
    hours = pretty_time_string(hours);
    minutes = pretty_time_string(minutes);
    seconds = pretty_time_string(seconds);

    // Compose the string for display
    var currentTimeString = hours + ":" + minutes + ":" + seconds;

    return currentTimeString;
}  