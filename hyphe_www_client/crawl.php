<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Hyphe</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">

<?php include("includes/codetop.php"); ?>

        <style>
/* Specific styles */
.crawlJob_log{
    font-size:10px;
}
.crawlJob_log p{
    line-height: 12px;
    margin: 0px;
}

.webentityNameContainer{
    max-width: 400px;
}

        </style>
        <link rel="stylesheet" href="css/jquery.dataTables.css">
        <link rel="stylesheet" href="css/select2.css">
        <link rel="stylesheet" href="css/main.css">

        <script src="js/libs/modernizr-2.6.1-respond-1.1.0.min.js"></script>
    </head>
    <body>
        <!--[if lt IE 7]>
            <p class="chromeframe">You are using an outdated browser. <a href="http://browsehappy.com/">Upgrade your browser today</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to better experience this site.</p>
        <![endif]-->

        

<?php include("includes/navbar.php"); ?>


        <div class="container">

<?php // include("includes/header.php"); ?>

            <div class="row">
                <div class="span12">
                    <h1>Crawl</h1>
                    <p class="text-info">
                        The crawler gathers pages on the web up to a settable depth.
                        Their links are extracted in order to know the outbound links of the crawled web entities.
                        <br/>
                        Each crawl job is dedicated to a different web entity.
                    </p>
                    <hr>
                </div>
            </div>

            <div class="row">
                <div class="span8">
                    <a class="btn btn-primary" href="crawl_new.php"><i class="icon-plus icon-white"></i> New crawl</a>
                    <a class="btn" href="crawl_urllist.php"><i class="icon-plus"></i> Crawl a list of URLs</a>
                    <form class="form-inline pull-right">
                        <label class="checkbox" title="The five last crawls are always showed">
                            <input type="checkbox" id="crawlJobs_showFinished"> Show all finished
                        </label>
                        &nbsp;
                        <label class="checkbox">
                            <input type="checkbox" id="crawlJobs_showPending" checked="true"> Show pending
                        </label>
                        &nbsp;
                        <a class="btn btn-link" id="crawlJobs_refresh">Refresh</a>
                    </form>
                </div>
            </div>

            <div class="row">
                <div class="span8">
                    <div id="jobs"></div>
                </div>
                <div class="span4">
                    <div id="jobFrame" style="display:none">
                    </div>
                </div>
            </div>
        </div>

<?php include("includes/footer.php"); ?>

<?php include("includes/codebottom.php"); ?>

        <!-- Page-specific js package -->
        <script src="js/_page_crawl_modules.js"></script>
        <script src="js/_page_crawl.js"></script>

    </body>
</html>