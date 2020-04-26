$(function () {
	var currentUser = MW.User.current()
	if (currentUser) {
		window.location = "mword-user.html"
	}
	$("#submit").off("click").on("click", function () {
		if ($("#username").val() != "" && $("#nickname").val() != "" && $("#password").val() != "" && $("#email").val() != "") {
			$("#username").val("")
			$("#nickname").val("")
			$("#password").val("")
			$("#email").val("")
			var user = new MW.User()
			user.setUsername($("#username").val())
			user.set("nickname", $("#nickname").val())
			user.setPassword($("#password").val())
			user.setEmail($("#email").val())
			user.signUp().then(function (user) {
				alert("注册成功 请验证邮箱")
				MW.User.logOut()
				window.location = "mword-login.html"
			}, function (error) {
				alert(error)
			})
		}
	})
})