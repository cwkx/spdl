$(document).ready(function() {
   console.log("model hi");
   $('a#calculate').bind('click', function() {
      $.getJSON($SCRIPT_ROOT + '/add-numbers', {
         a: $('input[name="a"]').val(),
         b: $('input[name="b"]').val()
      }, function(data) {
         $("#result").text(data.result);
      });
      return false;
   });
});
