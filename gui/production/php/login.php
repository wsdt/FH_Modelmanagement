<?php
    require_once './AuthenticationMiddleware.php';
    verifySession(false);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Meta, title, CSS, favicons, etc. -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>FH Kufstein</title>

    <!-- Bootstrap -->
    <link href="../../vendors/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="../../vendors/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <!-- NProgress -->
    <link href="../../vendors/nprogress/nprogress.css" rel="stylesheet">
    <!-- Animate.css -->
    <link href="../../vendors/animate.css/animate.min.css" rel="stylesheet">

    <!-- Custom Theme Style -->
    <link href="../../build/css/custom.min.css" rel="stylesheet">

    <!-- Auth (login/registration procedures) -->
    <script type="text/javascript" src="../js/modelupload/auth.js"></script>

    <!-- PNotify -->
    <link href="../../vendors/pnotify/dist/pnotify.css" rel="stylesheet">
    <link href="../../vendors/pnotify/dist/pnotify.buttons.css" rel="stylesheet">
    <link href="../../vendors/pnotify/dist/pnotify.nonblock.css" rel="stylesheet">
</head>

<body class="login">
<div>
    <a class="hiddenanchor" id="signup"></a>
    <a class="hiddenanchor" id="signin"></a>

    <div class="login_wrapper">
        <div class="animate form login_form">
            <section class="login_content">
                <form name="loginForm">
                    <h1>Login Form</h1>
                        <div>
                            <input type="text" class="form-control" placeholder="Username" required name="userName" id="userName"/>
                        </div>
                        <div>
                            <input type="password" class="form-control" placeholder="Password" required
                                   name="clearPassword" id="clearPassword"/>
                        </div>
                        <div>
                            <input class="btn btn-default submit" type="button" value="Log in" onclick="login(
                                document.getElementById('userName').value, document.getElementById('clearPassword').value);" />
                            <a class="reset_pass" href="#">Lost your password?</a>
                        </div>

                        <div class="clearfix"></div>

                        <div class="separator">
                            <p class="change_link">New to site?
                                <a href="#signup" class="to_register"> Create Account </a>
                            </p>

                            <div class="clearfix"></div>
                            <br/>

                            <div>
                                <h1>FH Kufstein</h1>
                                <p>© 2018 All Rights Reserved. FH Kufstein. Privacy and Terms</p>
                            </div>
                        </div>
                </form>
            </section>
        </div>

        <div id="register" class="animate form registration_form">
            <section class="login_content">
                <form>
                    <h1>Create Account</h1>
                    <div>
                        <input type="text" id="rUserName" class="form-control" placeholder="Username" required=""/>
                    </div>
                    <div>
                        <input type="email" id="rEMail" class="form-control" placeholder="Email" required=""/>
                    </div>
                    <div>
                        <input type="password" id="rClearPassword" class="form-control" placeholder="Password" required=""/>
                    </div>
                    <div>
                        <input class="btn btn-default submit" type="button" value="Register" onclick="register(
                            document.getElementById('rUserName').value,document.getElementById('rEMail').value,document.getElementById('rClearPassword').value
                        );"/>
                    </div>

                    <div class="clearfix"></div>

                    <div class="separator">
                        <p class="change_link">Already a member ?
                            <a href="#signin" class="to_register"> Log in </a>
                        </p>

                        <div class="clearfix"></div>
                        <br/>

                        <div>
                            <h1>FH Kufstein</h1>
                            <p>© 2018 All Rights Reserved. FH Kufstein. Privacy and Terms</p>
                        </div>
                    </div>
                </form>
            </section>
        </div>
    </div>
</div>

<!-- jQuery -->
<script src="../../vendors/jquery/dist/jquery.min.js"></script>
<!-- Bootstrap -->
<script src="../../vendors/bootstrap/dist/js/bootstrap.min.js"></script>
<!-- PNotify -->
<script src="../../vendors/pnotify/dist/pnotify.js"></script>
<script src="../../vendors/pnotify/dist/pnotify.buttons.js"></script>
<script src="../../vendors/pnotify/dist/pnotify.nonblock.js"></script>

</body>
</html>
