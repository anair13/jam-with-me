// Convenience functions
l = function(x) {
    return document.getElementById(x);
}

Controller = {};

Controller.Init = function() {
    Controller.FPS = 30;
    Controller.tracks = [new Track(), new Track(), new Track(), new Track()];
    Controller.timeLeft = 0;
    Controller.current_notetype = 0;

    var cv = l("drawCanvas");
    cv.width = cv.parentNode.offsetWidth;
    cv.height = cv.parentNode.offsetHeight;
    
    Controller.Update();
}

Controller.Update = function() {
    /* Update variables */
    for(var i = 0; i < Controller.tracks.length; i++) {
        var track = Controller.tracks[i];
        track.Draw();
    }
    setTimeout(Controller.Update, 1000/Controller.FPS);
}

function Note(pos, length, pitch) {
    this.pos = pos;
    this.length = length;
    this.pitch = pitch; // Steps relative to A4
}

function Track() {
    this.Init();
    this.noteImages = {
        0: "piano_note_1", // Whole note
        1: "piano_note_1", // Half note
        2: "piano_note_1", // Quarter note
        3: "piano_note_1", // 8th note
        4: "piano_note_1", // 16th note
        5: "piano_note_1"  // 32nd note
    };

    var cv = l("drawCanvas");
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

Track.prototype.Draw = function() {
    var cv = l("drawCanvas");
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
        c.moveTo(0, y);
        c.lineTo(cv.width, y);
        c.strokeStyle = "#000";
        c.lineWidth = 2;
        c.stroke();
        c.closePath();
    }

    // Vertical measure lines
    for(var i = 0; i < 5; i++) {
        var x = i * Track.measureSpacing;
        var y = 5 + tri * Track.trackSpacing;
        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(x, y + Track.lineSpacing * 5);
        c.strokeStyle = "#000";
        c.lineWidth = 2;
        c.stroke();
        c.closePath();
    }

    // Draw notes
    for(var i = 0; i < this.notes.length; i++) {
        var note = this.notes[i];
        var pos = note.pos;
        var length = note.length;
        var pitch = note.pitch;
        var img = this.noteImages[length];
        var x = Track.measureSpacing * pos / 32;
        var y = 5 + tri * Track.trackSpacing + Track.lineSpacing * (3 - pitch);
        c.drawImage(l(img), x, y);
    }
}

window.onload = function() {
    Controller.Init();
};

window.onmousemove = function(e) {
    var mx = e.clientX;
    var my = e.clientY;
    for(var tri = 0; tri < Controller.tracks.length; tri++) {
        var tr = Controller.tracks[tri];
        var miny = 5 + tri * Track.trackSpacing - Track.lineSpacing * 2.5;
        var maxy = 5 + tri * Track.trackSpacing + Track.lineSpacing * 6.5;
        if(miny <= my && my <= maxy) {
            // Get pos, pitch
            var pos = Math.floor(mx * 32 / Track.measureSpacing);
            var pitch = Math.floor((((5 + tri * Track.trackSpacing) - my) / Track.lineSpacing) * 2) / 2;

            var x = Track.measureSpacing * pos / 32;
            var y = 5 + tri * Track.trackSpacing + Track.lineSpacing * (3 - pitch);
            l("ghost_note").style.left = x + "px";
            l("ghost_note").style.top = y + "px";
            break;
        }
    }
};

window.onclick = function(e) {
    var mx = e.clientX;
    var my = e.clientY;
    for(var tri = 0; tri < Controller.tracks.length; tri++) {
        var tr = Controller.tracks[tri];
        var miny = 5 + tri * Track.trackSpacing - Track.lineSpacing * 2.5;
        var maxy = 5 + tri * Track.trackSpacing + Track.lineSpacing * 6.5;
        if(miny <= my && my <= maxy) {
            var pos = Math.floor(mx * 32 / Track.measureSpacing);
            var length = Controller.current_notetype;
            var pitch = Math.floor((((5 + tri * Track.trackSpacing) - my) / Track.lineSpacing) * 2) / 2;

            tr.addNote(new Note(pos, length, pitch));
            break;
        }
    }
};
