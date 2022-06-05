<template>
	<div class="top">
		<div aria-expanded="true" data-modal="demo-login" class="v--modal-overlay">
			<div class="v--modal-background-click">
				<div class="v--modal-top-right"></div>
				<div
					class="v--modal-box v--modal"
					style="
						position: absolute;
						layout: fixed;
						border: 1px none;
						top: 62%;
						left: 57%;
						margin: -150px 0 0 -150px;
						-webkit-box-sizing: border-box;
						-moz-box-sizing: border-box;
						box-sizing: border-box;
					"
				>
					<div class="box">
						<div id="bp-left" class="box-part">
							<div id="partition-register" class="partition">
								<div class="partition-title">CREATE ACCOUNT</div>
								<div class="partition-form">
									<form autocomplete="false">
										<div class="autocomplete-fix"><input type="password" /></div>
										<input id="n-email" type="text" placeholder="Email" />
										<input id="n-username" type="text" placeholder="Username" />
										<input id="n-password2" type="password" placeholder="Password" />
									</form>
									<div style="margin-top: 42px"></div>
									<div class="button-set">
										<button id="goto-signin-btn">Sign In</button>
										<button id="register-btn">Register</button>
									</div>
									<button class="large-btn github-btn">connect with <span>github</span></button>
									<button class="large-btn facebook-btn">connect with <span>facebook</span></button>
								</div>
							</div>
						</div>
						<div id="bp-right" class="box-part"><div class="box-messages"></div></div>
					</div>
					<!---->
				</div>
			</div>
		</div>
	</div>
</template>
<script>
const MODAL_WIDTH = 656;
export default {
	name: "LoginModal",
	data() {
		return {
			modalWidth: MODAL_WIDTH,
		};
	},
	created() {
		this.modalWidth = window.innerWidth < MODAL_WIDTH ? MODAL_WIDTH / 2 : MODAL_WIDTH;
	},
	methods: {
		signIn() {
			alert("Sign in");
		},
		register() {
			alert("Register");
		},
	},
};
</script>
<style>
.v--modal-overlay {
	cursor: default;
	-webkit-font-smoothing: antialiased;
	color: #6b7c93;
	font-family: Montserrat;
	position: fixed;
	box-sizing: border-box;
	left: 0;
	top: 0;
	width: 100%;
	height: 100vh;
	background: rgba(0, 0, 0, 0.2);
	z-index: 999;
	opacity: 1;
}
.v--modal-top-right {
	display: block;
	position: absolute;
	right: 0;
	top: 0;
}
.v--modal-overlay .v--modal-box {
	position: relative;
	overflow: hidden;
	box-sizing: border-box;
}
.v--modal {
	background-color: white;
	text-align: left;
	border-radius: 3px;
	box-shadow: 0 20px 60px -2px rgb(27 33 58 / 40%);
	padding: 0;
}
.v--modal-overlay .v--modal-background-click {
	min-height: 100%;
	width: 100%;
	padding-bottom: 10px;
}
.box,
.box .box-part {
	box-sizing: border-box;
}
.box .box-part {
	display: inline-block;
	position: relative;
	vertical-align: top;
	height: 100%;
	width: 50%;
}
.box .box-part#bp-right {
	background: url(/src/assets/img/panorama.jpg) no-repeat 0 0;
	border-left: 1px solid #eee;
}
.box .partition {
	width: 100%;
	height: 100%;
}
.box .partition .partition-title {
	box-sizing: border-box;
	padding: 30px;
	width: 100%;
	text-align: center;
	letter-spacing: 1px;
	font-size: 20px;
	font-weight: 300;
}
.box .partition .partition-form {
	padding: 0 20px;
	box-sizing: border-box;
}
.box .button-set {
	margin-bottom: 8px;
}
.box button {
	background: #fff;
	border-radius: 4px;
	box-sizing: border-box;
	padding: 10px;
	letter-spacing: 1px;
	font-family: Open Sans, sans-serif;
	font-weight: 400;
	min-width: 140px;
	margin-top: 8px;
	color: #8b8c8d;
	cursor: pointer;
	border: 1px solid #dddedf;
	text-transform: uppercase;
	transition: all 0.1s;
	font-size: 10px;
	outline: none;
}
.box button:hover {
	background: #8b8c8d;
	border-radius: 4px;
	box-sizing: border-box;
	padding: 10px;
	letter-spacing: 1px;
	font-family: Open Sans, sans-serif;
	font-weight: 400;
	min-width: 140px;
	margin-top: 8px;
	color: #fff;
	cursor: pointer;
	border: 1px solid #dddedf;
	text-transform: uppercase;
	transition: all 0.1s;
	font-size: 10px;
	outline: none;
}
.box .github-btn {
	border-color: #dba226;
	color: #dba226;
}
.box .github-btn:hover {
	background-color: #dba226;
	color: #fff;
}
.box .facebook-btn {
	border-color: #3880ff;
	color: #3880ff;
}
.box .facebook-btn:hover {
	background-color: #3880ff;
	color: #fff;
}
.box .large-btn {
	width: 100%;
	background: #fff;
}
.box #register-btn,
.box #signin-btn {
	margin-left: 8px;
}
.box .box-messages {
	position: absolute;
	left: 0;
	bottom: 0;
	width: 100%;
}
.box .autocomplete-fix {
	position: absolute;
	visibility: hidden;
	overflow: hidden;
	opacity: 0;
	width: 0;
	height: 0;
	left: 0;
	top: 0;
}
form {
	display: block;
	margin-top: 0em;
}
.box input[type="password"],
.box input[type="text"] {
	display: block;
	box-sizing: border-box;
	margin-bottom: 4px;
	width: 100%;
	font-size: 12px;
	line-height: 2;
	border: 0;
	border-bottom: 1px solid #dddedf;
	padding: 4px 8px;
	font-family: inherit;
	transition: all 0.5s;
	outline: none;
}
.box {
	background: #fff;
	overflow: hidden;
	width: 656px;
	height: 400px;
	border-radius: 2px;
	box-shadow: 0 0 40px #000;
	color: #8b8c8d;
	font-size: 0;
}
div {
	display: block;
}
</style>
