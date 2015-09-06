/***************Word编辑控件在IE下与服务器交互是同步运行的，其他浏览器例如firefox和chrome是异步运行****************/
var tanger_height;
var filename;//文件的名字
var IsSaveOrNo = false;//此次编辑是否需要保存
var IsOpenFirst = true;//第一次打开文档
var IsTaoHong = false;//初始化时是否要套红
var TaoHongMode = '';//套红模板
var saveOpen = true;//是否保存后再打开
var saveHtml = false;//谷歌是否保存html
var isSetMark = false;//是否已设置过书签
var ofCfg = {upUrl:'http://'+window.location.host+'/yesoa/yes_upload/servlet/WordToHTMLServlet',
			 thEndUrl:'http://'+window.location.host+'/yesoa/yessoft3_std/app/document/zaddline.doc'};//UnidWordToHTML

/******************************自定义的文档控制方法********************************/
intializePage();//控件初始化设置

if(window.location.search&&window.location.search!=''){
	initOfficePage({doType:yes.request('doType'),open_url:yes.request('open_url')});
}
if(window.dialogArguments&&window.dialogArguments.data){
	initOfficePage(window.dialogArguments.data);
}

function initOfficePage(configs){
	IsSaveOrNo = false;
	IsOpenFirst = true;
	IsTaoHong = false;
	TaoHongMode = '';
	saveOpen = true;
	saveHtml = false;
	isSetMark = false;
	try{
		if(!OFFICE_CONTROL_OBJ){
			intializePage();
		}
		$.extend(ofCfg,configs);
		if(ofCfg.doType&&ofCfg.doType=='P'){//执行套打
			setFileClose(false);
			setFileOpen(false);
			setFileSave(false);
			setFileNew(false);
			setFileSaveAs(false);
			if(ofCfg.model_url&&ofCfg.model_url!=''){
				NTKO_OCX_OpenDoc(ofCfg.model_url);
				IsSaveOrNo = false;
				if(Sys.ie){
					setTDAllBooKmark(ofCfg.book_mark);
					setFilePrint(true);
					setFilePrintPreview(true);
				}
			}
		}else if(ofCfg.doType&&ofCfg.doType=='OF'){
			filename = decodeURIComponent(ofCfg.open_url).substring(ofCfg.open_url.lastIndexOf('/')+1);
			var ispdf = filename.indexOf('.pdf')>-1?true:false;
			setToolBar(false);
			setFileClose(false);
			setFileOpen(false);
			setFileSave(false);
			setFileNew(false);
			if(ispdf){
				setFileSaveAs(true);
				setFilePrint(false);
				setFilePrintPreview(false);
			}else{
				setFileSaveAs(true);
				setFilePrint(true);
				setFilePrintPreview(true);
			}
			if(ofCfg.open_url&&ofCfg.open_url!=''){
				IsOpenFirst = false;//第一次打开文档
				saveOpen = false;//是否保存后再打开
				saveHtml = false;//谷歌是否保存html
				isSetMark = true;//是否已设置过书签
				ispdf?addPDFSupport():false;//添加支持pdf打开
				NTKO_OCX_OpenDoc(ofCfg.open_url);
				return;
			}
		}else{
			filename = ofCfg.url_addr.saveAsName;
			resizeWindow();//每次初始化重置页面高度
			var isOpen = false;//此次是否有打开文档(盖章的时候使用)
			if(ofCfg.url_addr&&ofCfg.url_addr.urldown){
				if(!IsFileOpened||(ofCfg.word_state&&ofCfg.word_state.ftaohong=='true')){
					isOpen = true;
					var openDocUrl = ofCfg.url_addr.urldown;
					//20150610 zxd 非ie浏览器直接加载痕迹正文
					if(!Sys.ie&&ofCfg.word_state&&ofCfg.word_mode&&ofCfg.word_state.ftaohong=='true'&&ofCfg.word_mode.urlmode!=''){
						openDocUrl = ofCfg.word_mode.urlmode;
					}
					NTKO_OCX_OpenDoc(openDocUrl);
				} 
				if(ofCfg.word_state.readonly!="true"){
					IsSaveOrNo = true;
				}
			}else{
				NTKO_OCX_NewDoc();
				IsSaveOrNo = true;
			}
			
			initControl();
			if(Sys.ie||(ofCfg.word_state&&ofCfg.word_state.fgaizhang=='true'&&!isOpen)){
				docPropCtl();
			}
		}
	}catch(error){
		//alert("错误1：" + error.number + ":" + error.description);
	}
}
function initControl(){
	try{
		var	readonly = ofCfg.word_state.readonly&&ofCfg.word_state.readonly=="true"?true:false;
		var	filenew = ofCfg.word_state.filenew&&ofCfg.word_state.filenew=="true"?true:false;
		var	fileopen = ofCfg.word_state.fileopen&&ofCfg.word_state.fileopen=="true"?true:false;
		var	filesave = ofCfg.word_state.filesave&&ofCfg.word_state.filesave=="true"?true:false;
		var	fileprint = ofCfg.word_state.fileprint&&ofCfg.word_state.fileprint=="true"?true:false;
		var	filesaveas = ofCfg.word_state.filesaveas&&ofCfg.word_state.filesaveas=="true"?true:false;
		var	fileprintpreview = ofCfg.word_state.fileprintpreview&&ofCfg.word_state.fileprintpreview=="true"?true:false;
		
		
		setFileClose(false);
		if(readonly){
			setToolBar(false);
			
			setFileOpen(false);
			setFileSave(false);
			setFileNew(false);
			setFileSaveAs(false);
			
			setIsShowToolMenu(false);
			setIsShowHelpMenu(false);
			setIsShowEditMenu(false);
			setIsShowInsertMenu(false);
			setIsShowHelpMenu(false);
			if(Sys.ie){
				var hm = $('param[name="Hidden2003Menus"]');
				if(hm.length==0){
					$('param[name="Hidden2003Menus"]').after('<param name="Hidden2003Menus" value="编辑(&E);视图(&V);格式(&O);表格(&A);插入(&I);工具(&T);窗口(&W);帮助(&H)">   ');
				}
			}else if($('#TANGER_OCX').attr('_Hidden2003Menus')==''){
				$('#TANGER_OCX').attr('_Hidden2003Menus',"编辑(&E);视图(&V);格式(&O);表格(&A);插入(&I);工具(&T);窗口(&W);帮助(&H)");
			}
		}else{
			addCustBtn(1,'显示痕迹',true);
			addCustBtn(2,'不显示痕迹',true);
			
			setFileOpen(fileopen);
			setFileSave(filesave);
			setFileNew(filenew);
			setFileSaveAs(filesaveas);
		}
		
		setFilePrint(false);
		setFilePrintPreview(false);
		
		if(ofCfg.url_addr.isUserJYY){
			setFileSaveAs(true);
		}
	}catch(error){
		//alert("错误2：" + error.number + ":" + error.description);
	}
}
function docPropCtl(){//文档操作权限控制
	try{
		var	readonly = ofCfg.word_state.readonly&&ofCfg.word_state.readonly=="true"?true:false;
		var	trackrevisions = ofCfg.word_state.trackrevisions&&ofCfg.word_state.trackrevisions=="true"?true:false;
		var	showrevisions = ofCfg.word_state.showrevisions&&ofCfg.word_state.showrevisions=="true"?true:false;
		var	fpagecount = ofCfg.word_state.fpagecount&&ofCfg.word_state.fpagecount=="true"?true:false;
		var	isstrictnocopy = ofCfg.word_state.isstrictnocopy&&ofCfg.word_state.isstrictnocopy=="true"?true:false;
		var	fdobookmark = ofCfg.word_state.fdobookmark&&ofCfg.word_state.fdobookmark=="true"?true:false;
		var	fclear = ofCfg.word_state.fclear&&ofCfg.word_state.fclear=="true"?true:false;
		var	fslient = ofCfg.word_state.fslient&&ofCfg.word_state.fslient=="true"?true:false;
		var	ftaohong = ofCfg.word_state.ftaohong&&ofCfg.word_state.ftaohong=="true"?true:false;
		var	fgaizhang = ofCfg.word_state.fgaizhang&&ofCfg.word_state.fgaizhang=="true"?true:false;
		
		if(ofCfg.word_user&&ofCfg.word_user.uname){
			setUserName(ofCfg.word_user.uname);
		}
		if(ftaohong&&ofCfg.word_mode&&ofCfg.word_mode.urlmode){
			if(Sys.ie){
				//TANGER_OCX_DoTaoHong(ofCfg.url_addr.urldown);//原
				TANGER_OCX_DoTaoHong(ofCfg.word_mode.urlmode);
				if(!ofCfg.book_mark||!ofCfg.book_mark.copyTarget||ofCfg.book_mark.copyTarget==''){
					doBookMarksRowDelete('copyTarget');
				}
				setTDAllBooKmark(ofCfg.book_mark);
				setAcceptAllRevisions();//接受修订
			}else{
				IsTaoHong = ftaohong;
				TaoHongMode = ofCfg.url_addr.urldown;
			}
		}
		if(!ftaohong&&fdobookmark){
			setTDAllBooKmark(ofCfg.book_mark);
		}
		setReviewMode(trackrevisions);
		setShowRevisions(showrevisions);
		if(readonly){
			setIsStrictNoCopy(true);
		}
		setReadOnly(readonly);
		if(!ftaohong){
			OFFICE_CONTROL_OBJ.activeDocument.saved = true;
		}
		if(fgaizhang){
			setAcceptAllRevisions();//接受修订
			OFFICE_CONTROL_OBJ.activeDocument.saved = false;
		}
	}catch(error){
		//alert("错误3：" + error.number + ":" + error.description);
	}
}

function setTDAllBooKmark(fieldObj){//书签设值
	try{
		if(fieldObj){
			$.each(fieldObj,function(i,v){
				setBookmarkValue(i,v);
			});
		}
	}catch(error){
		//alert("错误4：" + error.number + ":" + error.description);
	}
}

function saveSuccess(htmls){
	try{
		setContentBack("1");
		if(ofCfg.callback){
			htmls.docname = OFFICE_CONTROL_OBJ.webfilename;
			ofCfg.callback(htmls,ofCfg,saveOpen);
		}
		OFFICE_CONTROL_OBJ.activeDocument.saved = true;
	}catch(error){
		//alert("错误5：" + error.number + ":" + error.description);
	}
}


function saveDocAndHtml(saveBtn){//文档保存操作
	try{
		if(checkSave()){
			if(Sys.ie){
				var result = $.parseJSON(saveFileToUrl());//alert('保存doc返回值:'+result.success+'  '+result.msg);
				if(result.success){
					result = $.parseJSON(saveFileAsHtmlToUrl());//alert('保存html返回值:'+result.success+'  '+result.msg);
				}
				saveSuccess(result);
			}else{
				saveFileToUrl();
			}
		}
		if(saveBtn)
			OFFICE_CONTROL_OBJ.CancelLastCommand = true;
	}catch(error){
		//alert("错误：" + error.number + ":" + error.description);
	}
}

function checkSave(){//检测是否需要保存
	return IsSaveOrNo&&IsFileOpened&&(OFFICE_CONTROL_OBJ.activeDocument&&!OFFICE_CONTROL_OBJ.activeDocument.saved)
}



/****************************控件的一些事件监听回调函数*******************************/

function DocumentOpenedBack(str,doc){//文档打开的回调
	OFFICE_CONTROL_OBJ.activeDocument.saved = false;//saved属性用来判断文档是否被修改过,文档打开的时候设置成ture,当文档被修改,自动被设置为false,该属性由office提供.
	
	if(!Sys.ie){//套红的代码
		if(ofCfg.doType&&ofCfg.doType=='P'){
			setTDAllBooKmark(ofCfg.book_mark);
			setFilePrint(true);
			setFilePrintPreview(true);
		}else if(IsOpenFirst){//文档第一次打开后，对文档做控制
			IsOpenFirst = false;
			docPropCtl();
			
			if(IsTaoHong){//打开正文后，是套红的话，就执行这个步骤
				OFFICE_CONTROL_OBJ.ActiveDocument.Application.selection.Goto(-1,0,0,"content");
				OFFICE_CONTROL_OBJ.AddTemplateFromURL(TaoHongMode);
			}
		}
	}
	setFileOpenedOrClosed(true);
}

function AddtemplatefromurlBack(){//Addtemplatefromurl的回调函数 ******IE以外才用到******* 套红时执行设置书签
	if(!isSetMark){
		isSetMark = true;
		if(OFFICE_CONTROL_OBJ.ActiveDocument.BookMarks.Exists('bottomline')){
			OFFICE_CONTROL_OBJ.ActiveDocument.Application.Selection.goto(1, 1, 1);//光标移动到当前页面的下一页的开始
			OFFICE_CONTROL_OBJ.ActiveDocument.Application.Selection.MoveLeft(1, 1);//上移一行,到最后一行的末尾
			OFFICE_CONTROL_OBJ.addTemplateFromURL(ofCfg.thEndUrl);//打开模板
		}
		if(!ofCfg.book_mark||!ofCfg.book_mark.copyTarget||ofCfg.book_mark.copyTarget==''){
			doBookMarksRowDelete('copyTarget');
		}
		setTDAllBooKmark(ofCfg.book_mark);
		setAcceptAllRevisions();//接受修订
		
		
	}
}

function FileCommand(TANGER_OCX_str,TANGER_OCX_obj){//点击文件按钮的回调
	switch(TANGER_OCX_str){
		case 1:
				if(!confirm("导入新文档，会覆盖现有文档，是否继续?")){
					OFFICE_CONTROL_OBJ.CancelLastCommand = true;
					return;
				}else{
					NTKO_OCX_CloseDoc();
				}
				break;
		case 3: saveDocAndHtml(true);break;//保存
		case 4:
				OFFICE_CONTROL_OBJ.webfilename = filename.replace(/[\\/*\?":\<\>\|]/gi,' ');
				if(filename.indexOf('.pdf')>-1?true:false){
					OFFICE_CONTROL_OBJ.showdialog(3);
				}
				else{
				   OFFICE_CONTROL_OBJ.showdialog(2);
				}
				OFFICE_CONTROL_OBJ.CancelLastCommand = true;
				break;
	}
}

function saveToUrlBack(type,code,html){//saveToUrl的回调函数 ******IE以外才用到*******
	var htmls = $.parseJSON(html);
	if(!saveHtml&&htmls.success){
		saveHtml = true;
		saveFileAsHtmlToUrl();
	}else{
		saveSuccess(htmls);
	}
}

function CustomButtonOnMenuCmd(btnPos,btnCaption,btnCmdid){//自定义按钮回调事件
	switch(btnPos){
		case 1:
			var noChange = OFFICE_CONTROL_OBJ.activeDocument.saved;
			setReadOnly(false);
			setShowRevisions(true);
			if(ofCfg.word_state&&ofCfg.word_state.readonly=="true"){
				setReadOnly(true);
			}
			if(noChange){
				OFFICE_CONTROL_OBJ.activeDocument.saved = true;
			}
			break;
		case 2:
			var noChange = OFFICE_CONTROL_OBJ.activeDocument.saved;
			setReadOnly(false);
			setShowRevisions(false);
			if(ofCfg.word_state&&ofCfg.word_state.readonly=="true"){
				setReadOnly(true);
			}
			if(noChange){
				OFFICE_CONTROL_OBJ.activeDocument.saved = true;
			}
			break;
	}
}

function PublishAsHTMLToURLBack(type,code,html){//PublishAsHTMLToURL的回调函数 ******IE以外才用到*******
	
}