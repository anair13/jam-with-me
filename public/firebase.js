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
  var temp = d.getTime()
  setTimeout(function() {
    killSession();
  },endTime - startTime);

  var myDataRef = new Firebase('https://jamwithme.firebaseio.com/music/session'+ID);
  $('#position').keypress(function (e) {
    var n = d.getTime();
    if(n > endTime) {
      killSession();
    }
    if (e.keyCode == 13) {
      var step = $('#step').val();
      var length = $('#length').val();
      var type = $('#type').val();
      var position = $('#position').val();
      myDataRef.push({step: step, length: length, type:type, position: position});
      $('#position').val('');
    }
  });
  myDataRef.on('child_added', function(snapshot) {
    var message = snapshot.val();
    displayChatMessage(message.step, message.length, message.frequency);
  });

});
function displayChatMessage(step, length) {
  $('<div/>').text(step).prepend($('<em/>').text(length+': ')).appendTo($('#messagesDiv'));
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