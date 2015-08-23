// 请勿修改，否则可能出错
var Sys = {};
var ua = navigator.userAgent.toLowerCase();
var s;
(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
var classid = 'C9BC4DFF-4248-4A3C-8A49-63A7D317F404';
var userAgent = navigator.userAgent, rMsie = /(msie\s|trident.*rv:)([\w.]+)/, 
	rFirefox = /(firefox)\/([\w.]+)/, rOpera = /(opera).+version\/([\w.]+)/, 
	rChrome = /(chrome)\/([\w.]+)/, rSafari = /version\/([\w.]+).*(safari)/;
var browser;
var version;
var ua = userAgent.toLowerCase();
function uaMatch(ua) {
	var match = rMsie.exec(ua);
	if (match != null) {
		return { browser : "IE", version : match[2] || "0" };
	}
	var match = rFirefox.exec(ua);
	if (match != null) {
		return { browser : match[1] || "", version : match[2] || "0" };
	}
	var match = rOpera.exec(ua);
	if (match != null) {
		return { browser : match[1] || "", version : match[2] || "0" };
	}
	var match = rChrome.exec(ua);
	if (match != null) {
		return { browser : match[1] || "", version : match[2] || "0" };
	}
	var match = rSafari.exec(ua);
	if (match != null) {
		return { browser : match[2] || "", version : match[1] || "0" };
	}
	if (match != null) {
		return { browser : "", version : "0" };
	}
}
var browserMatch = uaMatch(userAgent.toLowerCase());
if(browserMatch.browser =='IE'){
	Sys.ie = 1;
	document.write('<object id="TANGER_OCX" classid="clsid:C9BC4DFF-4248-4a3c-8A49-63A7D317F404" ');
	document.write('codebase="fileJs/OfficeControl.cab#version=5,0,2,4" width="100%" height="830">');
	document.write('<param name="IsUseUTF8URL" value="-1">   ');
	document.write('<param name="IsUseUTF8Data" value="-1">   ');
	document.write('<param name="BorderStyle" value="1">   ');
	document.write('<param name="BorderColor" value="14402205">   ');
	document.write('<param name="TitlebarColor" value="15658734">   ');
	document.write('<param name="ProductCaption" value="福建中烟">  ');
	document.write('<param name="ProductKey" value="2231004405F8C487D3F6A80357FDC1889F4A3764"> ');
	document.write('<param name="TitlebarTextColor" value="0">   ');
	document.write('<param name="MenubarColor" value="14402205">   ');
	document.write('<param name="MenuButtonColor" VALUE="16180947">   ');
	document.write('<param name="MenuBarStyle" value="3">   ');
	document.write('<param name="MenuButtonStyle" value="7">   ');
	//document.write('<param name="Hidden2003Menus" value="编辑(&E);视图(&V);格式(&O);表格(&A);插入(&I);工具(&T);窗口(&W);帮助(&H)">   ');//2003版word隐藏菜
	document.write('<SPAN STYLE="color:red">不能装载文档控件。请在检查浏览器的选项中检查浏览器的安全设置。</SPAN>   ');
	document.write('</object>');
}else if (Sys.firefox){ 	
	document.write('<object id="TANGER_OCX" type="application/ntko-plug"  codebase="fileJs//OfficeControl.cab#version=5,0,2,4" width="100%" height="100%" ForOnSaveasOtherFormatToUrl="saveToUrlBack" ForOnDocumentOpened="DocumentOpenedBack"');
	document.write('ForAfterPublishAsPDFToURL="PublishAsPdfToURLBack"');
	document.write('ForOnFileCommand="FileCommand"');
	document.write('ForOnaddtemplatefromurl="AddtemplatefromurlBack"');
	document.write('ForOnCustomButtonOnMenuCmd="CustomButtonOnMenuCmd"');
	
	document.write('_ProductCaption="福建中烟"');
	document.write('_ProductKey="2231004405F8C487D3F6A80357FDC1889F4A3764"');

	document.write('_IsUseUTF8URL="-1"   ');
	document.write('_IsUseUTF8Data="-1"   ');
	document.write('_BorderStyle="1"   ');
	document.write('_BorderColor="14402205"   ');
	document.write('_MenubarColor="14402205"   ');
	document.write('_MenuButtonColor="16180947"   ');
	document.write('_MenuBarStyle="3"  ');
	document.write('_MenuButtonStyle="7"   ');
	//document.write('_Hidden2003Menus="编辑(&E);视图(&V);格式(&O);表格(&A);插入(&I);工具(&T);窗口(&W);帮助(&H)"   ');//2003版word隐藏菜
	document.write('clsid="{C9BC4DFF-4248-4a3c-8A49-63A7D317F404}" >');
	document.write('<SPAN STYLE="color:red">尚未安装NTKO Web FireFox跨浏览器插件。请点击<a href="ntkoplugins.xpi">安装组件</a></SPAN>   ');
	document.write('</object>   ');
}else if(Sys.chrome){
	document.write('<object id="TANGER_OCX" clsid="{C9BC4DFF-4248-4a3c-8A49-63A7D317F404}"  ForOnSaveasOtherFormatToUrl="saveToUrlBack" ForOnDocumentOpened="DocumentOpenedBack"');
	document.write('ForAfterPublishAsPDFToURL="PublishAsPdfToURLBack"');
	document.write('ForOnFileCommand="FileCommand"');
	document.write('ForOnaddtemplatefromurl="AddtemplatefromurlBack"');
	document.write('ForOnCustomButtonOnMenuCmd="CustomButtonOnMenuCmd"');
	
	document.write('codebase="fileJs//OfficeControl.cab#version=5,0,2,4" width="100%" height="100%" type="application/ntko-plug" ');
	document.write('_IsUseUTF8URL="-1"   ');
	document.write('_IsUseUTF8Data="-1"   ');

	document.write('_ProductCaption="福建中烟"');
	document.write('_ProductKey="2231004405F8C487D3F6A80357FDC1889F4A3764"');

	document.write('_BorderStyle="1"   ');
	document.write('_BorderColor="14402205"   ');
	document.write('_MenubarColor="14402205"   ');
	document.write('_MenuButtonColor="16180947"   ');
	document.write('_MenuBarStyle="3"  ');
	document.write('_MenuButtonStyle="7"   ');
	//document.write('_Hidden2003Menus="编辑(&E);视图(&V);格式(&O);表格(&A);插入(&I);工具(&T);窗口(&W);帮助(&H)"   ');//2003版word隐藏菜
	document.write('<SPAN STYLE="color:red">尚未安装NTKO Web Chrome跨浏览器插件。请点击<a href="ntkoplugins.crx">安装组件</a></SPAN>   ');
	document.write('</object>');
}else if (Sys.opera){
	alert("sorry,word控件暂时不支持opera浏览器!");
}else if (Sys.safari){
	alert("sorry,word控件暂时不支持safari浏览器!");
}