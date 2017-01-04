var editors = [];

$(document).ready(function() {

   // sortable tabs
   var tabID = 1;
   $('#btn-add-tab').click(function () {
      tabID++;
      $('#editorTabs').append($('<li><a href="#tab' + tabID + '" role="tab" data-toggle="tab">Tab ' + tabID + '<button class="close" type="button" title="Remove this page">×</button></a></li>'));
      $('#editorContent').append($('<div class="tab-pane fade" id="tab' + tabID + '">Tab '+ tabID +' content</div>'));
   });
   $('#editorTabs').on('click','.close',function(){
      var tabID = $(this).parents('a').attr('href');
      $(this).parents('li').remove();
      $(tabID).remove();

      //display first tab
      var tabFirst = $('#editorTabs a:first');
      tabFirst.tab('show');
   });

   var list = document.getElementById("editorTabs");
   new Sortable(list);

   $( "#editorPanel" ).resizable({
      resize: function( event, ui ) {
         $.each(editors, function(i, e) {
            e.resize();
         });
      }
   });
});

// reloads file list, called from projects.js when a project is loaded
function editorReloadFiles(projectName)
{
   $.getJSON($SCRIPT_ROOT + '/list-files', {
      name: projectName
   }, function(data) {
      $('#editorTabs').empty();
      $('#editorContent').empty();
      editors.length = 0;
      $.each(data.files, function(i, filename) {
         var active = i==0 ? 'active' : '';
         $('#editorTabs').append($('<li class="'+active+'"><a role="tab" data-toggle="tab" href="#editorTab'+i+'">'+filename+'</a></li>'));
         $('#editorContent').append('<div class="tab-pane '+active+'" id="editorTab'+i+'" role="tabpanel"><div class="ace-editor" id="editorAce'+i+'">'+data.contents[i]+'</div></div>');

         var editor = ace.edit("editorAce"+i);
         editor.setTheme("ace/theme/chrome");
         editor.getSession().setMode("ace/mode/python");
         editors.push(editor);

         // http://jsbin.com/ojijeb/645/edit?html,css,output
      });
      $('#editorTabs').append('<div class="btn-group pull-right">\
      <button id="editorModify" type="button" data-toggle="modal" href="#editorModifyModal" class="btn btn-default"><span class="glyphicon glyphicon-wrench"\ aria-hidden="true"></span></button>\
      <button id="editorHelp" type="button" class="btn btn-default"><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span></button>\
      </div>')
   });
}
