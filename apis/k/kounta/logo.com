<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
    	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><script type="text/javascript">window.NREUM||(NREUM={}),__nr_require=function(t,n,e){function r(e){if(!n[e]){var o=n[e]={exports:{}};t[e][0].call(o.exports,function(n){var o=t[e][1][n];return r(o?o:n)},o,o.exports)}return n[e].exports}if("function"==typeof __nr_require)return __nr_require;for(var o=0;o<e.length;o++)r(e[o]);return r}({D5DuLP:[function(t,n){function e(t,n){var e=r[t];return e?e.apply(this,n):(o[t]||(o[t]=[]),void o[t].push(n))}var r={},o={};n.exports=e,e.queues=o,e.handlers=r},{}],handle:[function(t,n){n.exports=t("D5DuLP")},{}],G9z0Bl:[function(t,n){function e(){var t=l.info=NREUM.info;if(t&&t.agent&&t.licenseKey&&t.applicationID&&p&&p.body){l.proto="https"===f.split(":")[0]||t.sslForHttp?"https://":"http://",i("mark",["onload",a()]);var n=p.createElement("script");n.src=l.proto+t.agent,p.body.appendChild(n)}}function r(){"complete"===p.readyState&&o()}function o(){i("mark",["domContent",a()])}function a(){return(new Date).getTime()}var i=t("handle"),u=window,p=u.document,s="addEventListener",c="attachEvent",f=(""+location).split("?")[0],l=n.exports={offset:a(),origin:f,features:[]};p[s]?(p[s]("DOMContentLoaded",o,!1),u[s]("load",e,!1)):(p[c]("onreadystatechange",r),u[c]("onload",e)),i("mark",["firstbyte",a()])},{handle:"D5DuLP"}],loader:[function(t,n){n.exports=t("G9z0Bl")},{}]},{},["G9z0Bl"]);</script>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
		<meta name="copyright" content="Kounta" />
		<meta name="title" content="Kounta" />
		<meta name="description" content="Login to Kounta to see what's new and enjoy the Kounta experience!" />
		<meta name="keywords" content="Kounta, Point of Sale, POS, online point of sale, retail point of sale, hospitality point of sale, touch screen pos, mobile pos" />
        <script src="/assets/f39ad735e503adf62c7a468ccdaeefa8c1b0fa06/scripts/public.js"></script>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/themes/kounta/common/images/ios-icon-57.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/themes/kounta/common/images/ios-icon-72.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/themes/kounta/common/images/ios-icon-114.png" />
        <link rel="shortcut icon" href="/themes/kounta/favicon.ico?v=2" />
		<link rel="stylesheet" href="/themes/kounta/website/css/loginsignup.css?f39ad735e503adf62c7a468ccdaeefa8c1b0fa06" type="text/css" media="screen" charset="utf-8" />
		<link rel="stylesheet" href="/themes/kounta/common/css/validationEngine.jquery.css?f39ad735e503adf62c7a468ccdaeefa8c1b0fa06" type="text/css">
        <style>
			html { position:fixed; top:0; bottom:0; left:0; right:0; }
		</style>
        <!--[if IE 8]>
            <link rel="stylesheet" type="text/css" href="/themes/kounta/website/css/frontend-ie8.css?f39ad735e503adf62c7a468ccdaeefa8c1b0fa06" />
        <![endif]-->
        <!--[if IE 7]>
            <link rel="stylesheet" type="text/css" href="/themes/kounta/website/css/frontend-ie8.css?f39ad735e503adf62c7a468ccdaeefa8c1b0fa06" />
            <link rel="stylesheet" type="text/css" href="/themes/kounta/website/css/frontend-ie7.css?f39ad735e503adf62c7a468ccdaeefa8c1b0fa06" />
        <![endif]-->
		<script type="text/javascript" src="/themes/kounta/common/js/jquery-validationEngine.js?f39ad735e503adf62c7a468ccdaeefa8c1b0fa06"></script>
        <script type="text/javascript" src="/themes/kounta/common/js/jquery-validationEngine-en.js?f39ad735e503adf62c7a468ccdaeefa8c1b0fa06"></script>
        <script type="text/javascript" src="/themes/kounta/website/js/jquery-formvalidation.js?f39ad735e503adf62c7a468ccdaeefa8c1b0fa06"></script>
        <script type="text/javascript" src="/themes/kounta/common/js/jquery-keyboard.js?f39ad735e503adf62c7a468ccdaeefa8c1b0fa06"></script>
        <script type="text/javascript" src="/themes/kounta/website/js/jquery-keyboard-settings.js?f39ad735e503adf62c7a468ccdaeefa8c1b0fa06"></script>
        <script type="text/javascript" src="/themes/kounta/website/js/jquery-placeholders.js?f39ad735e503adf62c7a468ccdaeefa8c1b0fa06"></script>     	
        
        <script type="text/javascript">
			$(document).ready(function() {	

				if (Modernizr.touch) {
					$("head").append($("<link rel='stylesheet' href='/themes/kounta/website/css/frontend-touch.css?f39ad735e503adf62c7a468ccdaeefa8c1b0fa06' type='text/css' media='screen' />"));
				}

                function goToPos(refreshData) {
                    if (refreshData) {
                        localStorage['AutoRefreshStuff'] = "1";
                    }
                    window.location.href='/pos/kounta';
                }

                $('#btnGoToPOS').bind((Modernizr.touch) ? "touchstart" : "click", function(e) { // Improved touch focus for inputs
                    if (navigator.onLine) {
                        $.ajaxSetup({
                            async: true,
                            cache: false,
                            dataType: "json",
                            error: function (req, status, ex) {
                                console.log("Error: " + ex);
                                // don't trigger data refresh on pos entry
                                goToPos(false);
                            },
                            success: function (data, status, req) {
                                goToPos(true);
                            },
                            timeout: 5000,
                            type: "GET",
                            url: "ping.js"
                        });
                        $.ajax();
                    }
                    else {
                        goToPos(true);
                    }
				});
				
				$('#btnLogin').bind((Modernizr.touch) ? "click" : "click", function(e) { // Improved touch focus for inputs
					btnLoginClick();
					e.preventDefault();
				});

                if (localStorage && localStorage.getItem('Kounta.Pos.Terminal') && localStorage.getItem('Kounta.Pos.Terminal') != '') {
                    $('#backToPOS').css('display','block');
                }

            });
			
			document.ontouchmove = function(event){
				event.preventDefault();
			}

    	</script>
		<title>Kounta | Login</title>
 
	</head>
    
	<body id="login" class="keyboardDisabled">
    
    	<div id="container">
	
			<div id="header">
                <div class="container">
                    <div class="section">
                        <a href="http://my.kounta.com" id="logok">Kounta</a>
                    </div>
                </div>
            </div>
	
			<div id="content" class="signupContent">
				<div class="container">
					<div class="section">
                    	<form id="login-form" name="loginform" method="post" action="/website/login">
                        	<div id="backToPOS" class="center" style="display:none;">
                                <div id="btnGoToPOS" class="button gradientSilver">GO BACK TO POS</div>
                                <div class="clear"></div>
                                <p>or login as another user:</p>
                            </div>
                            <div id="loginFields">
                                <input type="text" id="loginform_username" name="LoginForm[username]" class="textfield validate[required,custom[email]]" value="" placeholder="Email Address" onclick="if(this.placeholder=='Email Address'){this.placeholder=''}" onblur="if(this.value==''){this.placeholder='Email Address'}" />
                                <input type="password" id="loginform_password" name="LoginForm[password]" class="textfield validate[required]" value="" placeholder="Password" onclick="if(this.placeholder=='Password'){this.placeholder=''}" onblur="if(this.value==''){this.placeholder='Password'}" />
                                <input type="hidden" id="loginform_rid" name="rid" value="1" />
                                <div class="sprite keyboardToggle"></div>
                            	<div class="sprite keyboardToggleActive"></div>
                            </div>
                            <div class="clear"></div>
                            <input id="btnLogin" type="submit" class="button gradientOrange right" value="LOG IN" />
                            <div class="clear"></div>
                            <p class="forgotPassword"><a href="/login-forgotpassword.php">Forgot Password?</a></p>
                        </form>
					</div>
				</div>
			</div>
	
			<div id="footer" style="display:none;">
                <a href="/signup">
                <p class="small">New to Kounta?</p>
                <p class="large">Sign Up</p>
                </a>
			</div>
	
		</div>
	<script type="text/javascript">window.NREUM||(NREUM={});NREUM.info={"beacon":"beacon-3.newrelic.com","licenseKey":"fe379de690","applicationID":"2338389","transactionName":"YVMBYkEFX0AFUBFaWVgZNkRaS11cA1oLHUZeRg==","queueTime":0,"applicationTime":6,"ttGuid":"","agentToken":"","atts":"TRQCFAkfTE4=","errorBeacon":"bam.nr-data.net","agent":"js-agent.newrelic.com\/nr-411.min.js"}</script></body>
</html>