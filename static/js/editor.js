$(document).ready(function() {



   // sortable tabs
   var tabID = 1;
   $('#btn-add-tab').click(function () {
      tabID++;
      $('#tab-list').append($('<li><a href="#tab' + tabID + '" role="tab" data-toggle="tab">Tab ' + tabID + '<button class="close" type="button" title="Remove this page">×</button></a></li>'));
      $('#tab-content').append($('<div class="tab-pane fade" id="tab' + tabID + '">Tab '+ tabID +' content</div>'));
   });
   $('#tab-list').on('click','.close',function(){
      var tabID = $(this).parents('a').attr('href');
      $(this).parents('li').remove();
      $(tabID).remove();

      //display first tab
      var tabFirst = $('#tab-list a:first');
      tabFirst.tab('show');
   });

   var list = document.getElementById("tab-list");
   new Sortable(list);

});

// reloads file list, called from projects.js when a project is loaded
function editorReloadFiles(projectName)
{
   $.getJSON($SCRIPT_ROOT + '/list-files', {
      name: projectName
   }, function(data) {
      $('#tab-list').empty();
      $('#tab-content').empty();
      $.each(data.files, function(i, filename) {
         $('#tab-list').append($('<li><a role="tab" data-toggle="tab" href="#editorTab'+i+'">'+filename+'</a></li>'));
         $('#tab-content').append($('<div class="tab-pane fade" id="editorTab'+i+'"><h1>blah</h1></div>'));
         //todo: fix this
         var editor = ace.edit("testEditor");
         editor.setTheme("ace/theme/chrome");
         editor.getSession().setMode("ace/mode/python");
         editor.setValue(data.contents[i]);

         console.log(filename, data.contents[i]);
      });
   });
}
