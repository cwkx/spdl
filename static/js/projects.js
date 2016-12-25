$(document).ready(function() {

	// we initially refresh the projects list
	refreshProjects();

	// refresh the projects list
	function refreshProjects() {
		$.get($SCRIPT_ROOT + '/list-projects', function(data) {
			var activeIndex = $('.projects-list-group a.active').index();
			$('#projectsListGroup').empty();
			data.forEach(function(name) {
				$('#projectsListGroup').append('<a href="#" class="list-group-item">' + name + '</a>');
			});
			$('.projects-list-group a').eq(activeIndex).addClass('active').click();
		});
	}

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
		$.getJSON($SCRIPT_ROOT + '/create-project', {
			name: $('#newProjectName').val(),
			description: $('#newProjectDescription').val()
		}, function(data) {
			if (data.success) {
				refreshProjects();
				$("#projectList").click();
			}
			else {
				$("#newProjectAlert").removeClass('alert-danger');
				$("#newProjectAlert").removeClass('alert-success');
				$("#newProjectAlert").addClass('alert-danger');
				$("#newProjectAlert").html(data.message);
				$("#newProjectAlert").fadeTo(2000, 500).slideUp(700, function() {
					$("#newProjectAlert").slideUp(500);
				});
			}
		});
		return false;
	});
});
