$(document).ready(function() {

	// we initially refresh the projects list
	refreshProjects();

	// initialize popovers
	$('[data-toggle="popover"]').popover();

	// refresh the project list
	function refreshProjects() {
		$.get($SCRIPT_ROOT + '/list-projects', function(data) {
			var activeIndex = $('.project-list-group a.active').index();
			$('#projectListGroup').empty();
			data.forEach(function(name) {
				$('#projectListGroup').append('<a href="#" class="list-group-item">' + name + '</a>');
			});
			var maxChildren = $('.project-list-group a').length;
			activeIndex = Math.min(activeIndex, maxChildren - 1);
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
			$("#listProjectName").val(data.name);
			$("#listProjectDescription").val(data.description);
			$("#listProjectSize").text(data.size);
		});
	});

	$('#listProjectUpdate').popover({
		title: "Success",
		content: "Details saved!",
		html: true,
		template: '<div class="popover popover-success"><div class="arrow"></div><div class="popover-inner popover-success"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>',
		placement: 'bottom',
		trigger: 'focus'
	});

	$('#listProjectDeleteInput').bind('input', function() {
		if ($(this).val() == $('#listProjectName').val() && $(this).val() != '')
		{
			$('#listProjectDeleteConfirm').removeClass('btn-disabled');
			$('#listProjectDeleteConfirm').addClass('btn-danger');
		} else
		{
			$('#listProjectDeleteConfirm').removeClass('btn-danger');
			$('#listProjectDeleteConfirm').addClass('btn-disabled');
		}
   });

	$('#listProjectDeleteConfirm').on('click', function() {
		var name = $('#listProjectDeleteInput').val();
		if (name == $('#listProjectName').val() && name != '')
		{
			$.getJSON($SCRIPT_ROOT + '/delete-project', {
				name: name
			}, function(data) {
				// we wipe the meta values incase you delete the last project, otherwise it would show old information
				$("#listProjectName").val('');
				$("#listProjectDescription").val('');
				$("#listProjectSize").text('');
				refreshProjects();
				$('#listProjectDeleteModal').modal('toggle');
			});
		}
	});

	$('#listProjectDelete').on('click', function() {
		$('#listProjectDeleteInput').val('');
		$('#listProjectDeleteConfirm').removeClass('btn-danger');
		$('#listProjectDeleteConfirm').addClass('btn-disabled');
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

	$('#newProjectName').popover({
		title: "Error",
		html: true,
		template: '<div class="popover popover-danger"><div class="arrow"></div><div class="popover-inner popover-danger"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>',
		placement: 'top',
		trigger: 'manual'
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
				var popover = $('#newProjectName').data('bs.popover');
				    popover.options.content = data.message;
					 popover.show();
				setTimeout(function(){
					popover.hide();
				}, 2000);

			}
		});
		return false;
	});
});
