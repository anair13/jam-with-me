// Convenience functions
l = function(x) {
    return document.getElementById(x);
}

Controller = {};

Controller.Init = function() {
    Controller.FPS = 30;
    Controller.tracks = [new PianoTrack(), new DrumTrack(), new ViolinTrack(), new SynthTrack()];
    Controller.timeLeft = 0;
    Controller.current_canvas = 0;

    var cv = l("drawCanvas");
    cv.width = cv.parentNode.offsetWidth;
    cv.height = cv.parentNode.offsetHeight;
    
    cv = l("drawCanvas2");
    cv.width = cv.parentNode.offsetWidth;
    cv.height = cv.parentNode.offsetHeight;
    
    Controller.Update();
}

Controller.Update = function() {
    /* Update variables */

    /* Drawing */
    
    // Clear
    var cv = Controller.getCanvas();
    var c = cv.getContext("2d");
    c.fillStyle = "#FFF";
    c.clearRect(0, 0, cv.width, cv.height);

    // Draw tracks
    for(var i = 0; i < Controller.tracks.length; i++) {
        var track = Controller.tracks[i];
        track.Draw();
    }
    Controller.flipCanvas();
    setTimeout(Controller.Update, 1000/Controller.FPS);
}

Controller.getCanvas = function() {
    if(Controller.current_canvas == 0) {
        return l("drawCanvas");
    } else {
        return l("drawCanvas2");
    }
}

Controller.flipCanvas = function() {
    Controller.getCanvas().style.visibility = "hidden";
    Controller.current_canvas = 1 - Controller.current_canvas;
    Controller.getCanvas().style.visibility = "visible";
}

function Note(pos, length, pitch) {
    this.pos = pos;
    this.length = length;
    this.pitch = pitch; // Steps relative to A4
}

function Track() {
    this.Init();
    this.noteImages = {
        1: "piano_note_1", // Whole note
        2: "piano_note_1", // Half note
        4: "piano_note_1", // Quarter note
        8: "piano_note_1", // 8th note
        16: "piano_note_1", // 16th note
        32: "piano_note_1"  // 32nd note
    };
    Track.INSTRUMENTS = {
        PIANO: 0,
        SYNTH: 1,
        VIOLIN: 2,
        DRUMS: 3
    };
    this.instrument = -1;
    this.instrumentImage = "";
    this.clefImage = "";

    var cv = Controller.getCanvas();
    Track.leftOffset = 80;
    Track.lineSpacing = 10;
    Track.measureSpacing = 150;
    Track.trackSpacing = 100;
}

Track.prototype.Init = function() {
    this.notes = [];
}

Track.prototype.addNote = function(note) {
    this.notes.push(note);
}

Track.prototype.removeNoteAtPos = function(pos, pitch) {
    for(var i = 0; i < this.notes.length; i++) {
        var note = this.notes[i];
        if(note.pos == pos && note.pitch == pitch) {
            this.notes.splice(i, 1);
        }
    }
}

Track.getSnap = function() {
    return parseInt($('input[name="settings_snap"]:checked').val(), 10);
}

Track.getLength = function() {
    return parseInt($('input[name="settings_length"]:checked').val(), 10);
}

Track.getAction = function() {
    return $('input[name="settings_action"]:checked').val();
}

Track.prototype.Draw = function() {
    var cv = Controller.getCanvas();
    var c = cv.getContext("2d");

    // Draw lines
    var tri = 0;
    for(var _tri = 0; _tri < Controller.tracks.length; _tri++) {
        var tr = Controller.tracks[_tri];
        if(this == tr) {
            tri = _tri;
            break;
        }
    }

    // Horizontal score lines
    for(var i = 0; i < 5; i++) {
        var y = i * Track.lineSpacing + 5 + tri * Track.trackSpacing;
        c.beginPath();
        c.moveTo(Track.leftOffset, y);
        c.lineTo(Track.leftOffset + cv.width, y);
        c.strokeStyle = "#000";
        c.lineWidth = 2;
        c.stroke();
        c.closePath();
    }

    // Vertical measure lines
    for(var i = 0; i < 5; i++) {
        var x = Track.leftOffset + i * Track.measureSpacing;
        var y = 5 + tri * Track.trackSpacing;
        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(x, y + Track.lineSpacing * 4);
        c.strokeStyle = "#000";
        c.lineWidth = 2;
        c.stroke();
        c.closePath();
    }

    // Draw instrument
    c.drawImage(l(this.instrumentImage), 0, 5 + tri * Track.trackSpacing);

    // Draw clefs
    c.drawImage(l(this.clefImage), Track.leftOffset - 20, 5 + tri * Track.trackSpacing);

    // Draw notes
    for(var i = 0; i < this.notes.length; i++) {
        var note = this.notes[i];
        var pos = note.pos;
        var length = note.length;
        var pitch = note.pitch;
        var img = this.noteImages[length];
        var x = Track.leftOffset + Track.measureSpacing * pos / 32;
        var y = 5 + tri * Track.trackSpacing + Track.lineSpacing * (3 - pitch);
        c.drawImage(l(img), x, y);
    }
}

function PianoTrack() {
    var tr = new Track();
    tr.instrument = Track.INSTRUMENTS[Track.INSTRUMENTS.PIANO];
    tr.instrumentImage = "instrument_piano";
    tr.clefImage = "clef_treble";
    return tr;
}
function DrumTrack() {
    var tr = new Track();
    tr.instrument = Track.INSTRUMENTS[Track.INSTRUMENTS.DRUMS];
    tr.instrumentImage = "instrument_drums";
    tr.clefImage = "clef_treble";
    return tr;
}
function ViolinTrack() {
    var tr = new Track();
    tr.instrument = Track.INSTRUMENTS[Track.INSTRUMENTS.VIOLIN];
    tr.instrumentImage = "instrument_violin";
    tr.clefImage = "clef_bass";
    return tr;
}
function SynthTrack() {
    var tr = new Track();
    tr.instrument = Track.INSTRUMENTS[Track.INSTRUMENTS.SYNTH];
    tr.instrumentImage = "instrument_synth";
    tr.clefImage = "clef_treble";
    return tr;
}

window.onload = function() {
    Controller.Init();
};

window.onmousemove = function(e) {
    var mx = e.clientX - parseInt($("#track-container").css("margin-left"), 10);
    var my = e.clientY - parseInt($("#track-container").css("margin-top"), 10);
    for(var tri = 0; tri < Controller.tracks.length; tri++) {
        var tr = Controller.tracks[tri];
        var minx = Track.leftOffset + parseInt($("#track-container").css("margin-left"), 10);
        var miny = 5 + tri * Track.trackSpacing - Track.lineSpacing * 1.5;
        var maxy = 5 + tri * Track.trackSpacing + Track.lineSpacing * 6.5;
        if(minx <= mx && miny <= my && my <= maxy) {
            // Get pos, pitch
            var pos = Math.floor((mx - Track.leftOffset) * Track.getSnap() / Track.measureSpacing) * 32 / Track.getSnap();
            var pitch = Math.floor((((5 + tri * Track.trackSpacing) - my) / Track.lineSpacing) * 2) / 2;

            var x = Track.leftOffset + parseInt($("#track-container").css("margin-left"), 10) + Track.measureSpacing * pos / 32;
            var y = 5 + tri * Track.trackSpacing + Track.lineSpacing * (3 - pitch);
            l("ghost_note").style.left = x + "px";
            l("ghost_note").style.top = y + "px";
            l("ghost_note").style.visibility = "visible";
            break;
        }
        l("ghost_note").style.visibility = "hidden";
    }
};

window.onclick = function(e) {
    var mx = e.clientX - parseInt($("#track-container").css("margin-left"), 10);
    var my = e.clientY - parseInt($("#track-container").css("margin-top"), 10);
    for(var tri = 0; tri < Controller.tracks.length; tri++) {
        var tr = Controller.tracks[tri];
        var minx = Track.leftOffset;
        var miny = 5 + tri * Track.trackSpacing - Track.lineSpacing * 1.5;
        var maxy = 5 + tri * Track.trackSpacing + Track.lineSpacing * 6.5;
        if(minx <= mx && miny <= my && my <= maxy) {
            var pos = Math.floor((mx - Track.leftOffset) * Track.getSnap() / Track.measureSpacing) * 32 / Track.getSnap();
            var length = Track.getLength();
            var pitch = Math.floor((((5 + tri * Track.trackSpacing + 4 * Track.lineSpacing) - my) / Track.lineSpacing) * 2) / 2;

            var action = Track.getAction();
            if(action == "add") {
                tr.addNote(new Note(pos, length, pitch));
            }
            else if(action == "remove") {
                tr.removeNoteAtPos(pos, pitch);
            }
            break;
        }
    }
};
