$(function() {
	var currentUser = MW.User.current()
	if(currentUser) {
		window.location = "mword-user.html"
	}
	$("#submit").off("click").on("click", 
	function() {
		if($("#username").val() != "" && $("#password").val() != "") {
			MW.User.logIn($("#username").val(), $("#password").val()).then(function (user) {
				window.location="mword-user.html"
			}, function (error) {
				alert(error)
			})
			$("#username").val("")
            $("#password").val("")
		}
	})
})