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
    Controller.username = "guest";

    var cv = l("drawCanvas");
    cv.width = cv.parentNode.offsetWidth;
    cv.height = cv.parentNode.offsetHeight;
    
    cv = l("drawCanvas2");
    cv.width = cv.parentNode.offsetWidth;
    cv.height = cv.parentNode.offsetHeight;
    
    Controller.Update();
}

Controller.chooseName = function() {
    $(".user-overlay").hide();
    Controller.username = $("#name-box").val();
    dataUserRef.push({user: Controller.username});
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

Controller.handleNewNote = function(pos, length, pitch, instrument) {
    pitch /= 2;
    if(length == 0) {
        Controller.getTrack(instrument).removeNoteAtPos(pos, pitch, true);
    } else {
        Controller.getTrack(instrument).addNote(new Note(pos, length, pitch), true);
    }
}

Controller.getTrack = function(instrument) {
    for(var i = 0; i < Controller.tracks.length; i++) {
        var track = Controller.tracks[i];
        if(track.instrument == instrument) {
            return track;
        }
    }
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
        1: "note_whole", // Whole note
        2: "note_half", // Half note
        4: "note_quarter", // Quarter note
        8: "note_eighth", // 8th note
        16: "note_sixteenth", // 16th note
        32: "note_thirtysecond"  // 32nd note
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

Track.prototype.addNote = function(note, local_only) {
    local_only = typeof local_only !== 'undefined' ? local_only : false;
    for(var i = 0; i < this.notes.length; i++) {
        var n = this.notes[i];
        if(n.pos == note.pos && n.pitch == note.pitch) {
            this.notes.splice(i, 1);
            break;
        }
    }
    this.notes.push(note);
    if(!local_only) {
        editNote(note.pitch * 2, note.length, this.instrument, note.pos);
    }
}

Track.prototype.removeNoteAtPos = function(pos, pitch, local_only) {
    local_only = typeof local_only !== 'undefined' ? local_only : false;
    for(var i = 0; i < this.notes.length; i++) {
        var note = this.notes[i];
        if(note.pos == pos && note.pitch == pitch) {
            this.notes.splice(i, 1);
            break;
        }
    }
    if(!local_only) {
        editNote(pitch * 2, 0, this.instrument, pos);
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
        c.moveTo(Track.leftOffset - 28, y);
        c.lineTo(Track.leftOffset + cv.width, y);
        c.strokeStyle = "#000";
        c.lineWidth = 2;
        c.stroke();
        c.closePath();
    }

    // Vertical measure lines
    for(var i = 1; i < 5; i++) {
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
    c.drawImage(l(this.clefImage), Track.leftOffset - 20, 5 + tri * Track.trackSpacing - 12);

    // Draw notes
    for(var i = 0; i < this.notes.length; i++) {
        var note = this.notes[i];
        var pos = note.pos;
        var length = note.length;
        var pitch = note.pitch;
        var img = this.noteImages[length];
        var x = Track.leftOffset + Track.measureSpacing * pos / 32;
        var y = 5 + tri * Track.trackSpacing + Track.lineSpacing * (3 - pitch);

        var XOFF = -4;
        var YOFF = -29; 

        c.drawImage(l(img), x + XOFF, y + YOFF);
    }
}

function PianoTrack() {
    var tr = new Track();
    tr.instrument = "piano";
    tr.instrumentImage = "instrument_piano";
    tr.clefImage = "clef_treble";
    return tr;
}
function DrumTrack() {
    var tr = new Track();
    tr.instrument = "drums";
    tr.instrumentImage = "instrument_drums";
    tr.clefImage = "clef_treble";
    return tr;
}
function ViolinTrack() {
    var tr = new Track();
    tr.instrument = "violin";
    tr.instrumentImage = "instrument_violin";
    tr.clefImage = "clef_treble";
    return tr;
}
function SynthTrack() {
    var tr = new Track();
    tr.instrument = "synth";
    tr.instrumentImage = "instrument_synth";
    tr.clefImage = "clef_treble";
    return tr;
}

window.onmousemove = function(e) {
    var mx = e.clientX - parseInt($("#track-container").css("margin-left"), 10);
    var my = e.clientY - parseInt($("#track-container").css("margin-top"), 10);
    for(var tri = 0; tri < Controller.tracks.length; tri++) {
        var tr = Controller.tracks[tri];
        var minx = Track.leftOffset + parseInt($("#track-container").css("margin-left"), 10);
        var maxx = parseInt($("#track-container").css("width"), 10);
        var miny = 5 + tri * Track.trackSpacing - Track.lineSpacing * 1.5;
        var maxy = 5 + tri * Track.trackSpacing + Track.lineSpacing * 6.5;
        if(minx <= mx && mx <= maxx && miny <= my && my <= maxy) {
            // Get pos, pitch
            var pos = Math.round((mx - Track.leftOffset) * Track.getSnap() / Track.measureSpacing) * 32 / Track.getSnap();
            var pitch = Math.floor((((5 + tri * Track.trackSpacing + 6.5 * Track.lineSpacing) - my) / Track.lineSpacing) * 2) / 2;

            var x = -4 + Track.leftOffset + parseInt($("#track-container").css("margin-left"), 10) + Track.measureSpacing * pos / 32;
            var y = -29 + 5 + tri * Track.trackSpacing + Track.lineSpacing * (10 - pitch);
            l("ghost_note").style.left = x + "px";
            l("ghost_note").style.top = y + "px";
            l("ghost_note").style.visibility = "visible";
            switch(Track.getLength()) {
                case 1:
                    l("ghost_note").src = l("note_whole").src;
                break;
                case 2:
                    l("ghost_note").src = l("note_half").src;
                break;
                case 4:
                    l("ghost_note").src = l("note_quarter").src;
                break;
                case 8:
                    l("ghost_note").src = l("note_eighth").src;
                break;
                case 16:
                    l("ghost_note").src = l("note_sixteenth").src;
                break;
                case 32:
                    l("ghost_note").src = l("note_thirtysecond").src;
                break;
            }
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
        var maxx = parseInt($("#track-container").css("width"), 10);
        var miny = 5 + tri * Track.trackSpacing - Track.lineSpacing * 1.5;
        var maxy = 5 + tri * Track.trackSpacing + Track.lineSpacing * 6.5;
        if(minx <= mx && mx <= maxx && miny <= my && my <= maxy) {
            var pos = Math.round((mx - Track.leftOffset) * Track.getSnap() / Track.measureSpacing) * 32 / Track.getSnap();
            var length = Track.getLength();
            var pitch = Math.floor((((5 + tri * Track.trackSpacing + 3.5 * Track.lineSpacing) - my) / Track.lineSpacing) * 2) / 2;

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
