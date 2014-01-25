// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/

// note(i) returns the frequency of a note i steps above A4
function note(i) {
    return 440 * Math.pow(Math.pow(2, 1/12), i)
}
