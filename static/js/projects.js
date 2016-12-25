$(document).ready(function() {

	// we initially refresh the projects list
	refreshProjects();

	// refresh the project list
	function refreshProjects() {
		$.get($SCRIPT_ROOT + '/list-projects', function(data) {
			var activeIndex = $('.project-list-group a.active').index();
			$('#projectListGroup').empty();
			$("#projectList").prop('disabled', false);
			data.forEach(function(name) {
				$('#projectListGroup').append('<a href="#" class="list-group-item">' + name + '</a>');
			});
			if (data.length == 0) {
				$("#projectList").prop('disabled', true);
				$("#newProject").click();
			}
			$('.project-list-group a').eq(activeIndex).addClass('active').click();
		});
	}

	// on click for project list item
	$('body').on('click', '.project-list-group a', function(e) {
		e.preventDefault();
		$(this).addClass('active');
		$(this).siblings().removeClass('active');

		var name = e.currentTarget.text;
		$.getJSON($SCRIPT_ROOT + '/project-meta', {
			name: name
		}, function(data) {
			console.log(data);
			$("#listProjectName").val(data.name);
			$("#listProjectDescription").val(data.description);
			$("#listProjectSize").text(data.size);
		});
	});

	$('#projectList').on('click', function(e) {
		if (!$("#projectList").prop('disabled')) {
			$("#newProjectCollapse").parent().removeClass("panel-primary");
			$("#newProjectCollapse").parent().addClass("panel-default");
			$("#projectListCollapse").parent().addClass("panel-primary");
		}
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
				$("#newProjectName").val("");
				$("#newProjectDescription").val("");
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
