<?php
    require_once 'AuthenticationMiddleware.php';
    verifySession();
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
    <!-- iCheck -->
    <link href="../../vendors/iCheck/skins/flat/green.css" rel="stylesheet">
    <!-- Custom Theme Style -->
    <link href="../../build/css/custom.min.css" rel="stylesheet">
    <!-- Dropzone.css -->
    <link href="../../vendors/dropzone/dist/min/dropzone.min.css" rel="stylesheet">
    <!-- Dropzone.js -->
    <script src="../../vendors/dropzone/dist/min/dropzone.min.js"></script>
    <!-- Modelupload JS -->
    <script type="text/javascript" src="../js/modelupload/modelupload_general.js"></script>
    <script type="text/javascript" src="../js/modelupload/modelObj.js"></script>
    <!-- Jquery -->
    <script src="../../vendors/jquery/dist/jquery.min.js"></script>
    <!-- PNotify -->
    <link href="../../vendors/pnotify/dist/pnotify.css" rel="stylesheet">
    <link href="../../vendors/pnotify/dist/pnotify.nonblock.css" rel="stylesheet">
</head>

<body class="nav-md">


<div class="container body">
    <div class="main_container">
        <div class="col-md-3 left_col">
            <div class="left_col scroll-view">
                <div class="navbar nav_title" style="border: 0;">
                    <a href="../index.html" class="site_title"><i class="fa fa-home"></i> <span>Interreg</span></a>
                </div>

                <div class="clearfix"></div>

                <!-- menu profile quick info -->
                <div class="profile clearfix">
                    <div class="profile_pic">
                        <img src="../images/img.jpg" alt="..." class="img-circle profile_img">
                    </div>
                    <div class="profile_info">
                        <span>Welcome,</span>
                        <h2>Your name</h2>
                    </div>
                </div>
                <!-- /menu profile quick info -->

                <br/>

                <!-- sidebar menu -->
                <div id="sidebar-menu" class="main_menu_side hidden-print main_menu">
                    <div class="menu_section">
                        <h3>General</h3>
                        <ul class="nav side-menu">
                           <li class="active"><a><i class="fa fa-home"></i> Modelupload</a></li>
                        </ul>
                    </div>
                </div>
                <!-- /sidebar menu -->

                <!-- /menu footer buttons -->
                <div class="sidebar-footer hidden-small">
                    <a data-toggle="tooltip" data-placement="top" title="Settings">
                        <span class="glyphicon glyphicon-cog" aria-hidden="true"></span>
                    </a>
                    <a data-toggle="tooltip" data-placement="top" title="FullScreen">
                        <span class="glyphicon glyphicon-fullscreen" aria-hidden="true"></span>
                    </a>
                    <a data-toggle="tooltip" data-placement="top" title="Lock">
                        <span class="glyphicon glyphicon-eye-close" aria-hidden="true"></span>
                    </a>
                    <a data-toggle="tooltip" data-placement="top" title="Logout" href="../login.html">
                        <span class="glyphicon glyphicon-off" aria-hidden="true"></span>
                    </a>
                </div>
                <!-- /menu footer buttons -->
            </div>
        </div>

        <!-- top navigation -->
        <div class="top_nav">
            <div class="nav_menu">
                <nav>
                    <div class="nav toggle">
                        <a id="menu_toggle"><i class="fa fa-bars"></i></a>
                    </div>

                    <ul class="nav navbar-nav navbar-right">
                        <li class="">
                            <a href="javascript:;" class="user-profile dropdown-toggle" data-toggle="dropdown"
                               aria-expanded="false">
                                <img src="../images/img.jpg" alt="">Your name
                                <span class=" fa fa-angle-down"></span>
                            </a>
                            <ul class="dropdown-menu dropdown-usermenu pull-right">
                                <li><a href="javascript:;"> Profile</a></li>
                                <li>
                                    <a href="javascript:;">
                                        <span class="badge bg-red pull-right">50%</span>
                                        <span>Settings</span>
                                    </a>
                                </li>
                                <li><a href="javascript:;">Help</a></li>
                                <li><a href="../login.html"><i class="fa fa-sign-out pull-right"></i> Log Out</a></li>
                            </ul>
                        </li>

                        <li role="presentation" class="dropdown">
                            <a href="javascript:;" class="dropdown-toggle info-number" data-toggle="dropdown"
                               aria-expanded="false">
                                <i class="fa fa-envelope-o"></i>
                                <span class="badge bg-green">1</span>
                            </a>
                            <ul id="menu1" class="dropdown-menu list-unstyled msg_list" role="menu">
                                <li>
                                    <a>
                                        <span class="image"><img src="../images/img.jpg" alt="Profile Image"/></span>
                                        <span>
                          <span>System</span>
                          <span class="time">3 mins ago</span>
                        </span>
                                        <span class="message">
                          Your model was uploaded successfully!
                        </span>
                                    </a>
                                </li>
                                <li>
                                    <div class="text-center">
                                        <a>
                                            <strong>See All Alerts</strong>
                                            <i class="fa fa-angle-right"></i>
                                        </a>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
        <!-- /top navigation -->

        <!-- page content -->
        <div class="right_col" role="main">
            <div class="">
                <div class="page-title">
                    <div class="title_left">
                        <h3>Model Upload - Wizard</h3>
                    </div>

                    <!-- if you want you could here place the search bar -->
                </div>
                <div class="clearfix"></div>

                <div class="row">

                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <div class="x_panel">
                            <div class="x_title">
                                <h2>Model Management
                                    <small>Upload new model</small>
                                </h2>
                                <ul class="nav navbar-right panel_toolbox">
                                    <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
                                    </li>
                                    <li class="dropdown">
                                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button"
                                           aria-expanded="false"><i class="fa fa-wrench"></i></a>
                                        <ul class="dropdown-menu" role="menu">
                                            <li><a href="#" title="Reloads all data" onclick="printAllModelTableRows('#queriedmodels', ModelObj.getAllLocally());">Synchronize</a> <!-- TODO: Place here synchronize/refresh logic -->
                                            </li>
                                        </ul>
                                    </li>
                                    <li><a class="close-link"><i class="fa fa-close"></i></a>
                                    </li>
                                </ul>
                                <div class="clearfix"></div>
                            </div>
                            <div class="x_content">


                                <!-- Smart Wizard -->
                                <p>This is a basic wizard for adding new models.</p>
                                <div id="wizard" class="form_wizard wizard_horizontal">
                                    <ul class="wizard_steps">
                                        <li>
                                            <a href="#step-1">
                                                <span class="step_no">1</span>
                                                <span class="step_descr">
                                              Step 1<br/>
                                              <small>Search and Select</small>
                                          </span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#step-2">
                                                <span class="step_no">2</span>
                                                <span class="step_descr">
                                              Step 2<br/>
                                              <small>Upload new compression</small>
                                          </span>
                                            </a>
                                        </li>
                                    </ul>
                                    <div id="step-1">
                                        <h2 class="StepTitle">Step 1: Search and Select</h2>
                                        <p>This step focuses on searching for available models. After selecting a model
                                            you can add new variations of it.</p>
                                        <div class="title_right">
                                            <div class="col-md-5 col-sm-5 col-xs-12 form-group top_search">
                                                <div class="input-group">
                                                    <input id="modelupload_search" type="text" class="form-control"
                                                           placeholder="Search for models...">
                                                    <span class="input-group-btn">
                                                        <button class="btn btn-default" type="button" onclick="printAllModelTableRows('#queriedmodels', searchInResultSet(document.getElementById('modelupload_search').value,ModelObj.getAllLocally()))">Go!</button>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- start project list -->
                                        <table class="table table-striped projects">
                                            <thead>
                                            <tr>
                                                <th style="width: 1%">#</th>
                                                <th style="width: 20%">Description</th>
                                                <th>Compressions</th>
                                                <th>Status</th>
                                                <th style="width: 20%">#Edit</th>
                                            </tr>
                                            </thead>
                                            <tbody id="queriedmodels"><!-- ID necessary in modelupload_general.js / Just print the whole result set now. -->
                                            <script type="text/javascript">printAllModelTableRows("#queriedmodels", ModelObj.getAllLocally());</script>
                                            </tbody>
                                        </table>

                                    </div>
                                    <div id="step-2">
                                        <!-- ID used for updating with TrippleUUID (usability) -->
                                        <h2 class="StepTitle" id="step2_title">Step 2: Upload new compression</h2>
                                        <p>Drag (multiple) files or upload them manually by clicking onto the dropzone.</p>

                                        <form class="form-horizontal form-label-left">
                                            <div class="form-group">
                                                <label>License</label>
                                                <!-- If I know which data to place here I would make something more special here -->
                                                <input type="text" id="license" class="form-control" placeholder="Enter license">
                                            </div>
                                            <div class="form-group">
                                                <label for="accessLevels">Accesslevel</label>
                                                <select id="accessLevels" class="form-control" required>
                                                    <option value="public">public</option>
                                                    <option value="visit">visit</option>
                                                    <option value="private">private</option>
                                                </select>
                                            </div>
                                        </form>

                                        <!-- Drag/Upload File -->
                                        <form action="../form_upload.html" class="dropzone"></form>
                                    </div>
                                </div>
                            </div>
                            <!-- End SmartWizard Content -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- /page content -->

    <!-- footer content -->
    <footer>
        <div class="pull-right">
            Gentelella - Bootstrap Admin Template by <a href="https://colorlib.com">Colorlib</a>
        </div>
        <div class="clearfix"></div>
    </footer>
    <!-- /footer content -->
</div>


<!-- jQuery -->
<script src="../../vendors/jquery/dist/jquery.min.js"></script>
<!-- Bootstrap -->
<script src="../../vendors/bootstrap/dist/js/bootstrap.min.js"></script>
<!-- FastClick -->
<script src="../../vendors/fastclick/lib/fastclick.js"></script>
<!-- NProgress -->
<script src="../../vendors/nprogress/nprogress.js"></script>
<!-- jQuery Smart Wizard -->
<script src="../../vendors/jQuery-Smart-Wizard/js/jquery.smartWizard.js"></script>
<!-- Custom Theme Scripts -->
<script src="../../build/js/custom.min.js"></script>
<!-- PNotify -->
<script src="../../vendors/pnotify/dist/pnotify.js"></script>
<script src="../../vendors/pnotify/dist/pnotify.nonblock.js"></script>


</body>
</html>