var OFFICE_CONTROL_OBJ;//控件对象
var	IsFileOpened = false;//控件是否已打开文档


//控件初始化
function intializePage(){
	try{
		OFFICE_CONTROL_OBJ = document.getElementById("TANGER_OCX");
		getOfficeVer();
		setTitleBar(false);
		setStatusbar(false);
		OFFICE_CONTROL_OBJ.DefaultOpenDocType = 1;//打开对话框中默认显示的文档类型为word
	}catch(error){
		//alert("错误：" + error.number + ":" + error.description);
	}
}

//控件版本提示
function getOfficeVer(){
	try{
		if(OFFICE_CONTROL_OBJ.getOfficeVer){
			var ver = OFFICE_CONTROL_OBJ.getOfficeVer();
			if(ver==100){//9=Office2000,10=OfficeXP,11=Office2003,12=Office2007,6=office95,8= office 97,100=错误，即本机没有安装OFFICE。
				alert('找不到系统默认的Office软件，请联系管理员...');
			}
		}
	}catch(error){
		//alert("错误：" + error.number + ":" + error.description);
	}
}
//添加信任站点
function setTrustSite(site){
	OFFICE_CONTROL_OBJ.AddDomainToTrustSite(site);
}

//新建文件
function NTKO_OCX_NewDoc(){
	try{
		OFFICE_CONTROL_OBJ.CreateNew("Word.Document");
	}catch(error){
		//alert("错误：" + error.number + ":" + error.description);
	}
}

//打开文件
function NTKO_OCX_OpenDoc(fileUrl){
	try{
		NTKO_OCX_ActiveDoc();
		var ispdf = fileUrl.indexOf('.pdf')>-1?true:false;
		ispdf?addPDFSupport():false;//添加支持pdf打开
		OFFICE_CONTROL_OBJ.OpenFromURL(fileUrl);
		setFileOpenedOrClosed(true);
	}catch(error){
		//alert("错误：" + error.number + ":" + error.description);
	}
}

//激活控件
function NTKO_OCX_ActiveDoc(){
	try{
		if(OFFICE_CONTROL_OBJ)
			OFFICE_CONTROL_OBJ.activate(true);
	}catch(error){
		//alert("错误：" + error.number + ":" + error.description);
	}
}

//关闭文件
function NTKO_OCX_CloseDoc(){
	try{
		if(OFFICE_CONTROL_OBJ&&OFFICE_CONTROL_OBJ.ActiveDocument){
			OFFICE_CONTROL_OBJ.Close();
			setFileOpenedOrClosed(false);
		}
	}catch(error){
		//alert("错误：" + error.number + ":" + error.description);
	}
}

//弹出打开文件窗口
function NTKO_OCX_OpenWindow(){
	try{
		OFFICE_CONTROL_OBJ.ShowDialog(1);
	}catch(error){
		//alert("错误：" + error.number + ":" + error.description);
	}
}

//设置文档是否打开
function setFileOpenedOrClosed(bool){
	IsFileOpened = bool;
}

//保存文档到服务器{url:'上传路径',id:'文档Id',upStr:'附带上传的参数',name:'文档名称名称'}
function saveFileToUrl(){
	try{
		var result = OFFICE_CONTROL_OBJ.saveasotherformattourl(5,ofCfg.upUrl,//提交到的url地址
				'updoc',//文件域的id，类似<input type=file id=upLoadFile 中的id
				'dochtml=doc&unid='+ofCfg.url_addr.unid+'&path='+ofCfg.url_addr.path,//与控件一起提交的参数如："p1=a&p2=b&p3=c"parm.name
			ofCfg.url_addr.docname||'正文.doc');
		return result;
	}catch(error){
		//alert("错误：" + error.number + ":" + error.description);
	}
}
//保存html文档到服务器{url:'上传路径',id:'文档Id',upStr:'附带上传的参数',name:'文档名称名称'}
function saveFileAsHtmlToUrl(){
	try{
		setAcceptAllRevisions();
		var result = OFFICE_CONTROL_OBJ.saveasotherformattourl(5,ofCfg.upUrl,//提交到的url地址
				'uphtml',
				'dochtml=html&unid='+ofCfg.url_addr.unid+'&path='+ofCfg.url_addr.path+'&hname='+ofCfg.url_addr.html,//与控件一起提交的参数如："p1=a&p2=b&p3=c"parm.name
			'正文转html版.doc');
		return result;
	}catch(error){
		//alert("错误：" + error.number + ":" + error.description);
	}
}

//套红

function TANGER_OCX_DoTaoHong(URL){
	try{
		OFFICE_CONTROL_OBJ.ActiveDocument.AcceptAllRevisions(); //清稿
		
		var curSel = OFFICE_CONTROL_OBJ.ActiveDocument.Application.Selection;
		curSel.WholeStory();
		curSel.Cut();
		//OFFICE_CONTROL_OBJ.ActiveDocument.Application.Selection.HomeKey(6);
		
		OFFICE_CONTROL_OBJ.AddTemplateFromURL(URL);//插入套红模板
		
		var BookMarkName = "content";
		if(!OFFICE_CONTROL_OBJ.ActiveDocument.BookMarks.Exists(BookMarkName)){
		 alert("Word 模板中不存在名称为：\""+BookMarkName+"\"的书!签");
		 return;
		}
		var bkmkObj = OFFICE_CONTROL_OBJ.ActiveDocument.BookMarks(BookMarkName);
		var saverange = bkmkObj.Range;
		saverange.Paste();
		OFFICE_CONTROL_OBJ.ActiveDocument.BookMarks.Add(BookMarkName,saverange);
		
		
		//OFFICE_CONTROL_OBJ.ActiveDocument.Application.selection.Goto(-1,0,0,"content");
		//OFFICE_CONTROL_OBJ.AddTemplateFromURL(URL);//插入正文数据
		
		if(OFFICE_CONTROL_OBJ.ActiveDocument.BookMarks.Exists('bottomline')){
			OFFICE_CONTROL_OBJ.ActiveDocument.Application.Selection.goto(1, 1, 1);//光标移动到当前页面的下一页的开始
			OFFICE_CONTROL_OBJ.ActiveDocument.Application.Selection.MoveLeft(1, 1);//上移一行,到最后一行的末尾
			OFFICE_CONTROL_OBJ.addTemplateFromURL(ofCfg.thEndUrl);//打开模板
		}
		
		  var app = OFFICE_CONTROL_OBJ.ActiveDocument.Application;
		  var pgSetup = OFFICE_CONTROL_OBJ.ActiveDocument.PageSetup;
		  //pgSetup.PageWidth = app.CentimetersToPoints(15);
		  //pgSetup.PageHeight = app.CentimetersToPoints(12);
		  pgSetup.LeftMargin = app.InchesToPoints(1.024);
		  pgSetup.RightMargin = app.InchesToPoints(1.024);
		  pgSetup.TopMargin = app.InchesToPoints(1.4173);
		  pgSetup.BottomMargin = app.InchesToPoints(1.1811); 
		 
	}catch(error){
		//alert("错误：" + error.number + ":" + error.description);
	}
}





//设置是否保留痕迹
function setReviewMode(boolvalue){
	if(OFFICE_CONTROL_OBJ.doctype==1){
		OFFICE_CONTROL_OBJ.ActiveDocument.TrackRevisions = boolvalue;
		OFFICE_CONTROL_OBJ.ActiveDocument.ActiveWindow.View.RevisionsMode=0;
		//OFFICE_CONTROL_OBJ.ActiveDocument.ActiveWindow.View.MarkupMode=1;
	}
}

//设置是否显示痕迹
function setShowRevisions(boolevalue){
	if(OFFICE_CONTROL_OBJ.doctype==1){
		OFFICE_CONTROL_OBJ.ActiveDocument.ShowRevisions =boolevalue;
		OFFICE_CONTROL_OBJ.ActiveDocument.ActiveWindow.View.RevisionsMode=0;
		//OFFICE_CONTROL_OBJ.ActiveDocument.ActiveWindow.View.MarkupMode=1;
	}
}

//文档接受修订(清稿)
function setAcceptAllRevisions(){
	OFFICE_CONTROL_OBJ.ActiveDocument.AcceptAllRevisions();
}

//是否允许打印
function setFilePrint(boolvalue){
	OFFICE_CONTROL_OBJ.fileprint=boolvalue;
}

//是否允许打印预览
function setFilePrintPreview(boolvalue){
	OFFICE_CONTROL_OBJ.FilePrintPreview=boolvalue;
}

//是否允许新建
function setFileNew(boolvalue){ 
	OFFICE_CONTROL_OBJ.FileNew=boolvalue;
}

//是否允许打开
function setFileOpen(boolvalue){
	OFFICE_CONTROL_OBJ.FileOpen=boolvalue;
}

//是否允许关闭
function setFileClose(boolvalue){
	OFFICE_CONTROL_OBJ.FileClose=boolvalue;
}

//是否允许保存
function setFileSave(boolvalue){
	OFFICE_CONTROL_OBJ.FileSave=boolvalue;
}

//是否允许另存为
function setFileSaveAs(boolvalue){
	OFFICE_CONTROL_OBJ.FileSaveAs=boolvalue;
}

//是否禁止拷贝
function setIsStrictNoCopy(boolvalue){
	//OFFICE_CONTROL_OBJ.IsStrictNoCopy =boolvalue;//严格禁止粘贴
	OFFICE_CONTROL_OBJ.IsNoCopy = boolvalue;
}

//是否文档只读
function setReadOnly(boolvalue){
	//OFFICE_CONTROL_OBJ.SetReadOnly(boolvalue,"");//这种方式光标会一直在文档开头
	if(OFFICE_CONTROL_OBJ.ActiveDocument){
		if(boolvalue){
			OFFICE_CONTROL_OBJ.ActiveDocument.protect(3,0,"保护密钥");
		}else if(OFFICE_CONTROL_OBJ.ActiveDocument.ProtectionType!=-1){
			OFFICE_CONTROL_OBJ.ActiveDocument.unprotect("保护密钥");
		}
	}
}

//设置单个书签
function setBookmarkValue(name,value){
	if(OFFICE_CONTROL_OBJ.ActiveDocument.Bookmarks.Exists(name)){
		OFFICE_CONTROL_OBJ.SetBookmarkValue(name,value);
	}
}
//删除单个书签
function doBookMarksRowDelete(bm){
    if(OFFICE_CONTROL_OBJ.ActiveDocument.Bookmarks.Exists(bm)){ //书签是否存在
		OFFICE_CONTROL_OBJ.Activedocument.Application.Selection.goto(-1,0,0,bm); //定位书签
		var sel = OFFICE_CONTROL_OBJ.ActiveDocument.Application.selection;
		sel.Expand(5);//选中光标所在行
		sel.Delete();
		OFFICE_CONTROL_OBJ.ActiveDocument.Application.Selection.HomeKey(6,0);
	}
}
//添加一个自定义按钮
function addCustBtn(btnPos,btnTitle,IsNeedOpenDoc,cmdID){
	OFFICE_CONTROL_OBJ.AddCustomButtonOnMenu(btnPos,btnTitle,IsNeedOpenDoc?true:false,cmdID?cmdID:btnPos);
}
//撤销编辑，和（ctrl+z一样的效果），numstr：侧小几个步骤
function setContentBack(numstr){
	OFFICE_CONTROL_OBJ.ActiveDocument.Undo(numstr);
}


//设置痕迹用户名
function setUserName(name){
	OFFICE_CONTROL_OBJ.ActiveDocument.application.UserName = name;
}

//获取打开的文档内容
function getConDoc(){
	return OFFICE_CONTROL_OBJ.ActiveDocument.Content.Text;
}

//设置是否显示工具菜单
function setIsShowToolMenu(boolvalue){
	OFFICE_CONTROL_OBJ.IsShowToolMenu=boolvalue;
}

//设置是否显示帮助菜单
function setIsShowHelpMenu(boolvalue){
	OFFICE_CONTROL_OBJ.IsShowHelpMenu=boolvalue;
}

//设置是否显示编辑菜单
function setIsShowEditMenu(boolvalue){
	OFFICE_CONTROL_OBJ.IsShowEditMenu=boolvalue;
}

//设置是否显示插入菜单
function setIsShowInsertMenu(boolvalue){
	OFFICE_CONTROL_OBJ.IsShowInsertMenu=boolvalue;
}

//设置是否显示帮助菜单
function setIsShowHelpMenu(boolvalue){
	OFFICE_CONTROL_OBJ.IsShowHelpMenu=boolvalue;
}

//设置菜单栏
function setMenubar(boolvalue){
	OFFICE_CONTROL_OBJ.Menubar=boolvalue;
}

//设置标题栏
function setTitleBar(boolvalue){
	OFFICE_CONTROL_OBJ.Titlebar = boolvalue;
}

//设置工具栏
function setToolBar(boolvalue){
	OFFICE_CONTROL_OBJ.ToolBars=boolvalue;
}

//设置状态栏
function setStatusbar(boolvalue){
	OFFICE_CONTROL_OBJ.Statusbar = boolvalue;
}

//隐藏控件
function visibleOfficeControl(show){
	if(show){
		$('#TANGER_OCX').height(tanger_height);
	}else{
		$('#TANGER_OCX').height(0);
	}
}

//加载pdf支持组件
function addPDFSupport(){
	OFFICE_CONTROL_OBJ.AddDocTypePlugin(".pdf","PDF.NtkoDocument","4.0.0.2","fileJs/ntkooledocall.cab",51,true);
}