$(document).ready(function() {

   var editor = ace.edit("testEditor");
   editor.setTheme("ace/theme/chrome");
   editor.getSession().setMode("ace/mode/python");

});
