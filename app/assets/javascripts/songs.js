// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/
var context = new AudioContext();
window.onload = init;
var bufferLoader;

var buffers = new Array();
var notes = new Array();
var notemap = new Array();
var noteRefs = new Array();
var endTime;
var playbackStartTime = context.currentTime + 0.100;
var tempo = 80; // BPM (beats per minute)
var atomNoteTime = (60 / tempo) / 8; // 32nd note

var MINUTES = 20;
var d = new Date();
var startTime = d.getTime();
var myDataRef;

function editNote(step, length, type, position) {
    var n = d.getTime();

    if (length == '0') {
        noteRefs[notemap.indexOf([step, type, position].toString())].remove();
        console.log(notemap);
        console.log(noteRefs);
    } else {
        noteRefs.unshift(myDataRef.push());
        console.log("noteRefs: ", noteRefs);
        noteRefs[0].set({
            step: step,
            length: length,
            type: type,
            position: position
        });
        notemap.unshift([step, type, position].toString());
        console.log("notemap: ", notemap);
        $('#position').val('');
    }
}

function displayChatMessage(step, length) {
    $('<div/>').text(step).prepend($('<em/>').text(length + ': ')).appendTo($('#messagesDiv'));
    $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
};

function killSession() {
    var n = d.getTime();
    var endTime = n + MINUTES * 60 * 1000;
    thissession.set({
        ID: n,
        endTime: endTime
    });
    location.reload(true);
}

function get_elapsed_time_string(total_seconds) {
    function pretty_time_string(num) {
        return (num < 10 ? "0" : "") + num;
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

function init() {
    // Fix up prefixing
    Controller.Init();
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

    bufferLoader = new BufferLoader(
        context, [
            "../assets/pianoc4.wav",
            "../assets/violinc5.wav",
            //    "http://localhost:3000/assets/guitarc4.wav"
        ],
        finishedLoading
    );

    bufferLoader.load();

    function finishedLoading(bufferList) {
        buffers = bufferList;
    }

    var thissession = new Firebase('https://jamwithme.firebaseio.com/music/thissession');
    thissession.on('value', function (snapshot) {
        var session = snapshot.val();
        var ID = session.ID;
        endTime = session.endTime;

        setInterval(function () {
            var thisDate = new Date();
            $('#box_header').text(get_elapsed_time_string(Math.floor((endTime - thisDate.getTime()) / 1000)));
        }, 1000);
    });

    myDataRef = new Firebase(firebase_song_identifier);
    myDataRef.on('child_added', function (snapshot) {
        var message = snapshot.val();
        console.log(message);
        playNote(message.step, message.length, message.type, 0);
        Controller.handleNewNote(message.position, message.length, message.step, message.type);
    });
}

function playNote(step, length, type, position) {
    console.log(step, length, type, position);
    // convert type of instrument to corresponding bufferIndex
    bufferIndex = 0;
    switch (type) {
    case "piano":
        bufferIndex = 1;
    case "violin":
        bufferIndex = 2;
    default:
        bufferIndex = 0;
    }
    var timeOn = playbackStartTime + position * atomNoteTime;
    var timeOff = timeOn + length * atomNoteTime;
    var source = getTone(step, bufferIndex);
    source.start(timeOn);
    source.noteOff(timeOff);
}

// Generates a source from a buffer and shifts it to the right tone
function getTone(semitones, bufferIndex) {
    var source = context.createBufferSource();
    source.buffer = buffers[bufferIndex];
    source.connect(context.destination);
    var semitoneRatio = Math.pow(2, 1 / 12);
    source.playbackRate.value = Math.pow(semitoneRatio, semitones);
    if (!source.start)
        source.start = source.noteOn;
    return source;
}

function playback() {
    playbackStartTime = context.currentTime + 0.100;
    var myDataRef = new Firebase(firebase_song_identifier);
    myDataRef.on('child_added', function (snapshot) {
        var message = snapshot.val();
        playNote(message.step, message.length, message.type, message.position);
    });
}
