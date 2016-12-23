$(document).ready(function() {

	$('#projectListCollapse').on('hidden.bs.collapse', function () {

	});

	$('#newProjectCollapse').on('hidden.bs.collapse', function () {
	});

	$('#projectList').on('click', function(e) {
		$("#newProjectCollapse").parent().removeClass("panel-primary");
		$("#newProjectCollapse").parent().addClass("panel-default");
		$("#projectListCollapse").parent().addClass("panel-primary");
	});

	$('#newProject').on('click', function(e) {
		$("#projectListCollapse").parent().removeClass("panel-primary");
		$("#projectListCollapse").parent().addClass("panel-default");
		$("#newProjectCollapse").parent().addClass("panel-primary");
	});

	$('button#newProjectCreate').bind('click', function(e) {
		e.preventDefault();
		$.getJSON($SCRIPT_ROOT + '/_create_project', {
			name: $('#newProjectName').val(),
			description: $('#newProjectDescription').val()
		}, function(data) {
			console.log(data);
			if (data.success) {
				$("#projectList").click();
			}
			else {
				$("#newProjectAlert").removeClass('alert-danger');
				$("#newProjectAlert").removeClass('alert-success');
				$("#newProjectAlert").addClass('alert-danger');
				$("#newProjectAlert").html(data.message);
				$("#newProjectAlert").fadeTo(2000, 500).slideUp(700, function(){
					 $("#newProjectAlert").slideUp(500);
				});
			}
		});
		return false;
	});
});
