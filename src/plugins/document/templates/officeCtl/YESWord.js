var isSaveOpen = false;

function YESWord(config){
	var verifyClose = false;//打开编辑器校验
	
	var cfg = {//yesword的属性
			haszw:false,//是否存在正文
			hasth:false,//是否已套红
			hasgz:false,//是否已盖章
			esave:false,//是否编辑完成后执行保存动作
			islerder:false,//是否是领导(是的话就强制不显示痕迹)
			isUserJYY:false,//是否是机要员(有打印和另存为的权限)
			modelurl:yes_config_app_path+"/app/document/福建中烟工业有限责任公司公司发文稿纸.doc",//文档套打的url
			callback:function(){},//esave为是会执此方法
			tpath:'',//临时加载地址(如果esave为false,则使用此地址)
			sourcedoc:'',//一般编辑的附件（1：痕迹正文，2：套红正文，3：盖章正文）
			saveAsName:'正文.doc',//文件另存为的名称
			docname:'痕迹正文.doc',
			dbnsf:'document.nsf'
	}
	
	var doFun = {//yesword的内部方法
		init:function(){//控件初始化方法
			$.extend(cfg,config);
		},
		btmUpCon:function(){//底层上传正文
			var uunid,upath;
			var upath = doFun.createAtPath('');
			if(upath.unids){
				var parms = {url_addr:{path:upath.path,unid:upath.unids,html:"documentwh.html",docname:"痕迹正文.doc"},
							word_state:{readonly:$('[name=readonly]').val(),trackrevisions:$('[name=trackrevisions]').val(),
							showrevisions:$('[name=showrevisions]').val(),fileprint:$('[name=fileprint]').val(),
							fileprintpreview:$('[name=fileprintpreview]').val(),fpagecount:$('[name=fpagecount]').val(),
							filesaveas:$('[name=filesaveas]').val(),filesave:$('[name=filesave]').val(),isstrictnocopy:$('[name=isstrictnocopy]').val(),
							fileopen:$('[name=fileopen]').val(),filenew:$('[name=filenew]').val(),fclear:$('[name=fclear]').val(),
							ftaohong:"false",fgaizhang:"false",fslient:"false",fdobookmark:"false"}};
				
				var callback = function(rs,ofCfg,saveClose){
					isSaveOpen = saveClose;
					if(!rs.success){
						alert(rs.msg);
						return;
					}
				    return doFun.verifyOK({path:ofCfg.url_addr.path+'/html/documentwh.html',unids:ofCfg.url_addr.unid,isSave:saveClose});
				}
				
				parms.callback = callback;
				var openOffice = setInterval(function(){
					if($("#contentifr")[0].contentWindow&&$("#contentifr")[0].contentWindow.initOfficePage){
						clearInterval(openOffice);
						$("#contentifr")[0].contentWindow.initOfficePage(parms);
					}
				},200);
			}
		},
		showCon:function(){
			var whhtmlname = '';
			if(cfg.hasgz){
				whhtmlname = 'documentgzwh.html';
			}else if(cfg.hasth){
				whhtmlname = 'documentthwh.html';
			}else if(cfg.haszw){
				whhtmlname = 'documentwh.html';
			}
			if(whhtmlname==''){
				return;
			}
			var unid = $("input[name='UniversalID']").val();
			var loadhtml = yes_config_app_path+'/app/'+cfg.dbnsf+'/0/'+unid+'/$File/{0}';
			if(cfg.tpath!=''){
				doFun.setContent(cfg.tpath.replace(/[^//]+$/, "")+'html/'+whhtmlname);
			}else{
				doFun.setContent(loadhtml.format(whhtmlname));
			}
		},
		btmPrePCon:function(){
			var fis = $('input[name=consigners]').val().split(',');
			var fseqs = $('input[name=seq]').val().split(',');
			var hqstr = '';
			if(fis&&fis.length>0){
				var onevals = [];
				$.each(fseqs,function(i,v){
					var iv = parseInt(v);
					onevals.push({num:iv,name:fis[i]});
				});
				onevals.sort(function(a,b){return a.num-b.num});
				$.each(onevals,function(i,v){
					if(hqstr==''){
						hqstr = v.name;
					}else{
						hqstr += '、'+v.name;
					}
				});
			}
			var qfdate = $('input[name="qfdate"]').val();
			qfdate = qfdate.length>10?qfdate.substring(0,10):qfdate;
			var gwnofull = $('input[name=gwnotype]').val()+'〔'+$('input[name=gwnoyear]').val()+'〕'+$('input[name=gwnoseq]').val()+'号';
			if($('input[name="gwnotype"]').val()==''){
				var yes_formname = $('input[name="yes_formname"]').val();
				if('gongwen4,gongwen28,gongwen30'.indexOf(yes_formname)>-1){
					gwnofull = $('input[name=gwnoyear]').val()+'〔第'+$('input[name=gwnoseq]').val()+'期〕';
				}else{
					gwnofull = '';
				}
			}
			var  parmsd = {doType:"P",model_url:cfg.modelurl,book_mark:{typetitle:$('input[name="typetitle"]').val(),
							gwnofull:gwnofull,
							sclassification:$('input[name="sclassification"]').val(),priorities:$('input[name="priorities"]').val(),
							qfpizhu:$('input[name="qfpizhu"]').val(),signleader:$('input[name="signleader"]').val(),qfdate:qfdate,
							consigners:hqstr,main_send:$('input[name="main_send"]').val().replace(/,/gi,'、'),
							copy_send:$('input[name="copy_send"]').val().replace(/,/gi,'、'),dunits:$('input[name="dunits"]').val(),dperson:$('input[name="dperson"]').val(),
							tel:$('input[name="tel"]').val(),dpic:$('input[name="dpic"]').val(),secretarial:$('input[name="secretarial"]').val(),
							bgspic:$('input[name="bgspic"]').val(),jdperson:$('input[name="jdperson"]').val(),printcount:$('input[name="printcount"]').val(),
							yesrtf_atm_body:$('input[name="yesrtf_atm_body"]').val().replace(/\.doc\s\-/gi,'.doc\n -'),gtitle:$('[name="gtitle"]').text()}};
			
			var windowcfg = "dialogHeight:"+screen.height+"px;dialogWidth:"+screen.width
				+"px;resizable:yes;scroll:no;status:no;center:yes;help:no;minimize:yes;maximize:yes;";
			window.showModalDialog(yes_config_domain+'/resource/controls/officeCtl/officectl.html',{data:parmsd},windowcfg);
		},
		btmEditCon:function(editType,thmb){//editType(O:打开,E:编辑,T:套红,G:盖章)
			var docname = '痕迹正文.doc';//此次编辑生成的doc的名称
			var vwhhtml = 'documentwh.html';//此次编辑生成的html的名称 
			var nfile = 'yesrtf_atm_zhewen';//此次编辑对应的栏位的附件
			if(cfg.hasgz||editType=="G"){
				docname = '正文.doc';
				vwhhtml = 'documentgzwh.html';
				if(editType=="G"){
					nfile = 'yesrtf_atm_zwungz'
				}else{
					nfile = 'yesrtf_atm_zwgz';
				}
			}else if(cfg.hasth||editType=="T"){
				docname = '套红正文.doc';
				vwhhtml = 'documentthwh.html';
				if(editType!="T"){
					nfile = 'yesrtf_atm_zwungz';
				}
			}
			var attName = doFun.getAtNameByFieldName(nfile);
			var unpath = doFun.createAtPath(attName.name);
			
			var unid = $("input[name='UniversalID']").val();
			var upath = unpath.path.replace(/[^//]+$/, "");
			
			var patp = doFun.putAtToPath(unid,nfile,attName.name,upath.substring(0,upath.length-1));
			if(!patp){
				return;
			}
			
			var tempath = yes_config_domain+'/u'+upath+attName.source;
			
			var ft = $('[name=ftaohong]').val();
			var fz = $('[name=fgaizhang]').val();
			var fslient = 'false';
			var fdobookmark = 'false';
			var lpath = '';
			if(editType=='G'||editType=='T'){
				lpath = tempath;
				fdobookmark = 'true';
			}else{
				lpath = cfg.tpath!=''?cfg.tpath:tempath;
				ft = "false";
				fz = "false";
			}
			
			var wordmode ='{"urlmode":""}';
			if(editType=='T'){
				if(thmb){
					var patp = doFun.putAtToPath(thmb.UniversalID,'template',thmb.name,upath+'template');
					if(!patp){
						return;
					}
				}else{
					yesbox.addMsg("没有可用的套红模板，请联系管理员！");
					return false;
				}
				wordmode = {"urlmode":yes_config_domain+'/u'+upath+'template/'+thmb.name};
			}
			var book_mark = {};
			if(editType=='T'||editType=='G'){
				var qfdate = $('[name=qfdate]').val();
				if(qfdate&&qfdate!=''){
					qfdate = qfdate.substring(0,10);
					var qfdates = qfdate.split('-');
					qfdate = qfdates[0]+'年'+parseFloat(qfdates[1])+'月'+parseFloat(qfdates[2])+'日';
				}else{
					var now = new Date();
					qfdate = now.getFullYear()+'年'+(now.getMonth()+1)+'月'+now.getDate()+'日';
				}
				var thds = [];
				var thdate = $('[name="thdate"]').val();
				if(thdate&&thdate!=''){
					thds = thdate.split('-');
				}else{
					var now = new Date();
					var thd = now.getFullYear()+'-'+((now.getMonth()+1)<10?'0'+(now.getMonth()+1):now.getMonth()+1)+'-'+(now.getDate()<10?'0'+now.getDate():now.getDate());
					thds = thd.split('-');
					$('[name="thdate"]').val(thd);
				}
				var gwnofull = $('input[name=gwnotype]').val()+'〔'+$('input[name=gwnoyear]').val()+'〕'+$('input[name=gwnoseq]').val()+'号';
				if($('input[name="gwnotype"]').val()==''){
					var yes_formname = $('input[name="yes_formname"]').val();
					if('gongwen4,gongwen28,gongwen30'.indexOf(yes_formname)>-1){
						gwnofull = $('input[name=gwnoyear]').val()+'〔第'+$('input[name=gwnoseq]').val()+'期〕';
					}else{
						gwnofull = '';
					}
				}
				book_mark = {displaynumber:gwnofull,
							signatory:$('[name=signleader]').val(),issueName:$('[name=signleader_id]').val(),signTime:qfdate,
							mainTarget:$('[name=main_send]').html(),copyTarget:$('[name=copy_send]').html(),reportTarget:"",keywords:"",
							year:thds[0],month:parseFloat(thds[1]),day:parseFloat(thds[2]),allattrchname:$('[allAttrchName]').val()};
			}
			var word_state = '';
			if(editType=='O'){
				word_state = {readonly:"true",trackrevisions:"false",showrevisions:"false",fileprint:"false",fileprintpreview:"false",
								fpagecount:$('[name=fpagecount]').val(),filesaveas:"false",filesave:"false",isstrictnocopy:"false",fileopen:"false",
								filenew:"false",fclear:"false",ftaohong:"false",fgaizhang:"false",fslient:"false",fdobookmark:"false"};	
			}else{
				var showrevisions = $('[name=showrevisions]').val();
				if(cfg.islerder){
					showrevisions = "false";
				}
				word_state = {readonly:$('[name=readonly]').val(),trackrevisions:$('[name=trackrevisions]').val(),showrevisions:showrevisions,
							fileprint:$('[name=fileprint]').val(),fileprintpreview:$('[name=fileprintpreview]').val(),
							fpagecount:$('[name=fpagecount]').val(),filesaveas:$('[name=filesaveas]').val(),filesave:$('[name=filesave]').val(),
							isstrictnocopy:$('[name=isstrictnocopy]').val(),fileopen:$('[name=fileopen]').val(),filenew:$('[name=filenew]').val(),
							fclear:$('[name=fclear]').val(),ftaohong:ft,fgaizhang:fz,fslient:fslient,fdobookmark:fdobookmark};	
			}
			
			var parms = {url_addr:{urldown:lpath,path:upath,unid:unpath.unids,html:vwhhtml,saveAsName:cfg.saveAsName,docname:docname,
						isUserJYY:cfg.isUserJYY},book_mark:book_mark,word_state:word_state,word_mode:wordmode,word_user:{uname:$.cookie('userName')}};
			
			var callback = function(rs,ofCfg,saveClose){
					isSaveOpen = saveClose;
					if(!rs.success){
						alert(rs.msg);
						return;
					}
				   return doFun.verifyOK({path:ofCfg.url_addr.path+'/html/documentwh.html',
										 unids:ofCfg.url_addr.unid,editType:editType,isSave:saveClose,docname:docname});
				}
			parms.callback = callback;
			var openOffice = setInterval(function(){
				if($("#contentifr")[0].contentWindow&&$("#contentifr")[0].contentWindow.initOfficePage){
					clearInterval(openOffice);
					$("#contentifr")[0].contentWindow.initOfficePage(parms);
				}
			},200);
		},
		selThMuban:function(editType){//选择套红模板
			var thmb = {};
			yesajax.get({
				url:yes_config_app_path+'/yesbase/yes_process.nsf/yes_getATMByKey?OpenAgent&yesap_db='+cfg.dbnsf+'&fldname=template',
				data:{key:$('input[name=typeno]').val()},
				async:false,
				callback:function(data){
					if(data.listData && data.listData.length>0){
						if(data.listData.length==1){
							isloadzw = true;
							$('a[href="#tab-zhengwen"]').tab('show');
							var thmb  = data.listData[0];
							doFun.btmEditCon(editType,thmb);
						}else{
							var templates = new Array();
							for(var i = 0; i< data.listData.length ; i++){
								var thmb = data.listData[i];
								var it = {};
								it.key = i;
								it.val = thmb.source;
								templates.push(it);
							}
							yesbox.select("选择套红模板",templates,
							{
								cmds:[{
									 "close":true,
									 "name":"sure",
									 "value":yes_global_tip_btn_sure,
									 "callback":function(selData){
										isloadzw = true;
										$('a[href="#tab-zhengwen"]').tab('show');
										var  thmb = data.listData[selData.selected];
										doFun.btmEditCon(editType,thmb);
									 }
								},{
									 "close":true,
									 "value":yes_global_tip_btn_cancel
								}]
							});	
						}
					}
				}
			});
		},
		setContent:function(path,timeout){//加载html页面
			function timeouts(){
				var t = new Date().getTime();
				$('#contentfrm').attr('src',path+'?OpenElement&_t'+t);
			}
			if(timeout){
				return setTimeout(timeouts,timeout);
			}else{
				return timeouts();
			}
		},
		putAtToPath:function(unid,nfile,attName,upath){//将正文文件移到生成的文件夹里
			var result = false;
			yesajax.get({ 
				url:yes_config_app_path+'/yesbase/yes_process.nsf/(yes_docFileToTemp)?openagent&yesap_db='+cfg.dbnsf,
				async:false,
				data:{unid:unid,fieldname:nfile,filename:attName,pathstr:upath},
				success:function(tdata){
					result = tdata.rs;
				}
			});
			
			if(!result){
				yesbox.errMsg('获取文件到文件夹失败，请确认！');
			}
			return result;
		},
		getATMCountByField:function(fieldname){//根据栏位，获取附件个数
			var unid = $("input[name='UniversalID']").val();
			var count = 0;
			yesajax.get({
				url:yes_config_app_path + "/yesbase/yes_process.nsf/yes_getATM?OpenAgent&yesap_db={2}&unid={0}&fldname={1}".format(unid,fieldname,cfg.dbnsf),
				async:false,
				callback:function(data){
					if(data && data.listData && data.listData.length>0){
						count = data.listData.length;
					}
				}
			});
			return count;
		},
		createAtPath:function(attName){//设置和获取附件暂存位置
			var unpath = {unids:'',path:''};
			yesajax.get({
				url:yes_config_domain+'/yes_attachment.nsf/yes_createAInfo?openagent',
				async:false,
				data:{file:attName},
				success:function(tdata){
					if(tdata.rs && tdata.AppDatas){
						for(var i in tdata.AppDatas){
							unpath.unids = tdata.AppDatas[i].UniversalID;
							unpath.path = tdata.AppDatas[i].Items.a_attachments.Values[0];
						}
					}
				}
			});
			
			if(unpath.path==""){
				yesbox.errMsg('获取文件失败，请确认！');
				return false;
			}else{
				return unpath;
			}
		},
		getAtNameByFieldName:function(fieldName){//根据栏位名获取栏位内的附件名称
			var attName = {name:'',source:''};
			var unid = $("input[name='UniversalID']").val();
			yesajax.get({
				url:yes_config_app_path + "/yesbase/yes_process.nsf/yes_getATM?OpenAgent&yesap_db="+cfg.dbnsf,
				async:false,
				data:{unid:unid,fldname:fieldName},
				success:function(odata){
					if(odata.rs && odata.AppDatas && odata.AppDatas.listData.length>0){
						attName = odata.AppDatas.listData[0];
					}
				}
			});
			if(attName.name==""){
				yesbox.errMsg('获取附件名称出错，请确认！');
				return false;
			}else{
				return attName;
			}
		},
		verifyOK:function(cfgs){//验证转换html是否成功
			var ispath = cfgs.path.replace(/[^//]+$/,"");
			var htmlname = cfgs.path.replace(ispath,'');
			ispath = ispath.substring(0,ispath.length-1);
			var nfile = 'zhewen';
			var delname = '';
			
			if(cfg.hasgz||cfgs.editType=='G'){
				nfile = 'zwgz';
				if(cfg.hasgz){
					delname = 'zwgz';
				}
			}else if(cfg.hasth||cfgs.editType=='T'){
				nfile = 'zwungz';
				if(cfg.hasth){
					delname = 'zwungz';
				}
			}else if(cfg.haszw){
				delname = 'zhewen';
			}
					
			if(delname&&delname!=''){
				$('input[name="yes_akeys_del_'+delname+'"]').val(cfgs.docname||cfg.docname);
			}
			$('input[name="yes_auids_'+nfile+'"]').val(cfgs.unids);
			
			if(cfgs.editType=='T'){
				cfg.hasth = true;
				$('input[name="hastaohong"]').val("true");
			}else if(cfgs.editType=='G'){
				cfg.hasgz = true;
				$('input[name="hasgaizhang"]').val("true");
			}
			if(cfg.esave&&cfg.callback){
				cfg.callback();
			}
		}
	}
	
	this.doWork = function(editType){//底层操作正文:editType(O:打开,E:编辑,T:套红,G:盖章,S:显示正文,H:显示痕迹,P:套打)
		isSaveOpen = false;
		switch(editType){
			case 'S':doFun.showCon();break;
			case 'H':doFun.henjCon();break;
			case 'T':doFun.selThMuban(editType);break;
			case 'P':doFun.btmPrePCon();break;
			default:doFun.btmEditCon(editType);
		}
	}
	
	this.doUpWork = function(){//上传方法
		isSaveOpen = false;
		doFun.btmUpCon();
	}
	
	if(config){
		doFun.init();
	}
	return this;
}