/*!
 * myFocus JavaScript Library v2.0.4
 * https://github.com/koen301/myfocus
 * 
 * Copyright 2012, Koen Lee
 * Released under the MIT license
 * 
 * Date: 2012/10/28
 */
(function(){
	//DOM基础操作函数
	var $id=function(id){
			return typeof id==='string'?document.getElementById(id):id;
		},
		$tag=function(tag,parentNode){
			return ($id(parentNode)||document).getElementsByTagName(tag);
		},
		$tag_=function(tag,parentNode){
			return $getChild(tag,parentNode,'tag');
		},
		$class=function(className,parentNode){
			var doms=$tag('*',parentNode),arr=[];
			for(var i=0,l=doms.length;i<l;i++){
				if(hasClass(className,doms[i])){
					arr.push(doms[i]);
				}
			}
			return arr;
		},
		$class_=function(className,parentNode){
			return $getChild(className,parentNode);
		},
		$getChild=function(selector,parentNode,type){
			var arr=[],fn=type==='tag'?$tag:$class,doms=fn(selector,parentNode),len=doms.length;
			for(var i=0;i<len;i++){
				if(doms[i].parentNode===parentNode) arr.push(doms[i]);
				i+=fn(selector,doms[i]).length;
			}
			return arr;
		},
		hasClass=function(className,node){
			return eval('/(^|\\s)'+className+'(\\s|$)/').test(node.className);
		};
	//定义myFocus全局变量
	myFocus=function(settings){
		return new myFocus.constr(settings);
	};
	//扩展
	myFocus.extend=function(){
		var arg=arguments,len=arg.length;
		if(this===myFocus){//作为方法扩展，如果只有一个参数扩展本身
			if(len===1) dest=myFocus,i=0;//扩展myFocus类
			else dest=arg[0],i=1;
		}else{//扩展引用对象本身
			dest=this,i=0;
		}
		for(i;i<len;i++){
			for(var p in arg[i]){
				dest[p]=arg[i][p];//dest属性最低
			}
		}
		return dest;
	};
	myFocus.extend({
		defConfig:{//全局默认设置
			pattern:'mF_fancy',//风格样式
			trigger:'click',//触发切换模式['click'(鼠标点击)|'mouseover'(鼠标悬停)]
			txtHeight:'default',//文字层高度设置[num(数字,单位像素,0表示隐藏文字层,省略设置即为默认高度)]
			wrap:true,//是否需要让程序添加焦点图的外围html(wrap)元素(目的是为了添加某些风格的边框)[true|false]
			auto:true,//是否自动播放(切换)[true|false]
			time:4,//每次停留时间[num(数字,单位秒)]
			index:0,//开始显示的图片序号(从0算起)[num(数字)]
			loadingShow:true,//是否显示Loading画面[true(显示，即等待图片加载完)|false(不显示，即不等待图片加载完)]
			delay:100,//触发切换模式中'mouseover'模式下的切换延迟[num(数字,单位毫秒)]
			autoZoom:false,//是否允许图片自动缩放居中[true|false]
			onChange:null,//切换图片的时候执行的自定义函数，带有一个当前图索引的参数
			xmlFile:'',//myfocus图片的xml配置文件路径,留空即不读取xml文件
			__focusConstr__:true//程序构造参数
		},
		constr:function(settings){//构造函数
			var e=settings,len=e&&e.length;
			if(e instanceof myFocus.constr) return e;//myFocus::[]
			this.length=0;
			if(!e||(e.sort&&!len)||(e.item&&!len)){//null/array::[]/nodeList::[]
				Array.prototype.push.call(this);
			}else if(e.__focusConstr__){//new myFocus
				e=$id(e.id);
				Array.prototype.push.call(this,e);
				this.settings=settings;
				this.HTMLUList=$tag('li',$tag('ul',e)[0]);
				this.HTMLUListLength=this.HTMLUList.length;
			}else if(len){//nodeList/Array/字符串
				for(var i=0;i<len;i++) Array.prototype.push.call(this,e[i]);
			}else{//node
				Array.prototype.push.call(this,e);
			}
			return this;
		},
		fn:{splice:[].splice},//原形
		pattern:{},//风格集
		config:{}//参数集
	});
	myFocus.constr.prototype=myFocus.fn;
	myFocus.fn.extend=myFocus.pattern.extend=myFocus.config.extend=myFocus.extend;
	myFocus.fn.extend({//DOM
		find:function(selector){//选择器只应用基本查找,暂不考虑用querySelectorAll
			var parent=this,isChild=false,$=myFocus;
			var arr=this.parseSelector(selector);
			if(this.length) for(var i=0,len=arr.length;i<len;i++){
				var dom=[],s=arr[i];
				switch(s.charAt(0)){
					case '>'://children
						isChild=true;
						break;
					case '.'://class
						var cls=s.slice(1);
						var fn=isChild?$class_:$class;
						$(parent).each(function(){
							dom=dom.concat(fn(cls,this));
						});
						isChild=false;
						break;
					case '#'://id
						var id=s.slice(1),e=$id(id);
						if(e) dom.push($id(id));
						isChild=false;
						break;
					default://tag(支持'tag.class'寻找,不支持也不建议用'tag#id'寻找,请用'#id')
						var fn=isChild?$tag_:$tag,sArr=s.split('.');
						var tag=sArr[0],cls=sArr[1];
						$(parent).each(function(){
							var arr=fn(tag,this);
							for(var i=0,len=arr.length;i<len;i++){
								if(cls&&!hasClass(cls,arr[i])) continue;
								dom.push(arr[i]);
							}
						});
						isChild=false;
				}
				if(!isChild) parent=dom;//循环赋值父元素
			}
			return $(parent);
		},
		parent:function(){
			return myFocus(this[0].parentNode);
		},
		html:function(s){
			if(typeof s!=='undefined'){this[0].innerHTML=s;return this;}
			else return this[0].innerHTML;
		},
		each:function(fn){
			var doms=this;
			for(var i=0,len=doms.length;i<len;i++){
				var flag=fn.call(doms[i],i);
				if(flag===false) break;
				if(flag===true) continue;
			}
			return this;
		},
		eq:function(n){
			return myFocus(this[n]);
		},
		parseSelector:function(selector){
			var chunker=/(([^[\]'"]+)+\]|\\.|([^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?/g;
			var parts=[],m;
			while((m = chunker.exec(selector)) !== null ) {
				parts.push( m[1] );//存储匹配的字符串信息
			}
			return parts;
		},
		wrap:function(html){//每次只wrap一个元素,多个请用each
			var o=this[0],e=document.createElement('div');
			e.innerHTML=html;
			var wrap=e.firstChild;
			o.parentNode.replaceChild(wrap,o);
			wrap.appendChild(o);
			return this;
		},
		addHtml:function(html){
			var parent=this[0];
			var e=document.createElement('div');
			e.innerHTML=html;
			var dom=e.childNodes[0];
			parent.appendChild(dom);
			return myFocus(dom);
		},
		addList:function(className,type){
			var li=this.HTMLUList,n=this.HTMLUListLength;
			var strArr=['<div class="'+className+'"><ul>'];
			for(var i=0;i<n;i++){
				var img=$tag('img',li[i])[0],html;
				switch(type){
					case 'num'  :html='<a>'+(i+1)+'</a><b></b>';break;//b标签主要是为了做透明背景,下同
					case 'txt'  :html=img?li[i].innerHTML.replace(/\<img(.|\n|\r)*?\>/i,img.alt)+'<p>'+img.getAttribute("text")+'</p><b></b>':'';break;
					case 'thumb':html=img?'<a><img src='+(img.getAttribute("thumb")||img.src)+' /></a><b></b>':'';break;
					default     :html='<a></a><b></b>';
				}
				strArr.push('<li>'+html+'</li>');
			}
			strArr.push('</ul></div>');
			return this.addHtml(strArr.join(''));
		},
		addListNum:function(className){
			return this.addList(className||'num','num');//默认class=num
		},
		addListTxt:function(className){
			return this.addList(className||'txt','txt');//默认class=txt
		},
		addListThumb:function(className){
			return this.addList(className||'thumb','thumb');//默认class=thumb
		},
		remove:function(){
			var o=this[0];
			if(o) o.parentNode.removeChild(o);
		},
		repeat:function(n){
			var n=n||2,pNode=this[0].parentNode,html=pNode.innerHTML,s=[];
			for(var i=0;i<n;i++) s.push(html);
			pNode.innerHTML=s.join('');
			return myFocus(pNode).find(this[0].nodeName);
		}
	});
	myFocus.fn.extend({//CSS
		css:function(css){//可获值或设值
			var o=this[0],value,arr=[';'],isIE=myFocus.isIE;
			if(!o) return this;
			if(typeof css==='string'){//获得css属性值,返回值不带单位
				if(css==='float') css=isIE?'styleFloat':'cssFloat';
				if(!(value=o.style[css])) value=(isIE?o.currentStyle:getComputedStyle(o,''))[css];
				if(css==='opacity'&&value===undefined) value=1;//仅为在IE中得到默认值1
				if(value==='auto'&&(css==='width'||css==='height')) value=o['offset'+css.replace(/\w/i,function(a){return a.toUpperCase()})];
				var numVal=parseFloat(value);
				return isNaN(numVal)?value:numVal;
			}else{//设置css属性值,不支持('height','300px')形式,请变成-->({height:'300px'}),可以不带单位px
				for(var p in css){
					if(typeof css[p]==='number'&&!this.cssNumber[p]) css[p]+='px';
					arr.push(p.replace(/([A-Z])/g,'-$1')+':'+css[p]+';');
					if(p==='opacity') arr.push('filter:alpha(opacity='+css[p]*100+')');
				}
				o.style.cssText+=arr.join('');
				return this;
			}
		},
		setOpacity:function(value){//仅用于animate要求高效的核心算法中,其它情况可用css()代替
			this[0].style.opacity=value,this[0].style.filter='alpha(opacity='+value*100+')';
		},
		setAnimateStyle:function(value,prop,m){//仅用于animate要求高效的核心算法中,其它情况可用css()代替
			this[0].style[prop]=Math[m](value)+'px';
		},
		addClass:function(className){
			this[0].className+=' '+className;
			return this;
		},
		removeClass:function(className){
			var o=this[0],cls=className&&o.className,reg="/\\s*\\b"+className+"\\b/g";
			o.className=cls?cls.replace(eval(reg),''):'';
			return this;
		},
		cssNumber:{fillOpacity:true,fontWeight:true,lineHeight:true,opacity:true,orphans:true,widows:true,zIndex:true,zoom:true}//不加px的css,参考jQuery
	});
	myFocus.fn.extend({//Animate
		animate:function(attr,value,time,type,funcBefore,funcAfter){//value支持相对增值'+=100',相对减值'-=100'形式
			var $o=this,o=$o[0],isOpacity=attr==='opacity',diffValue=false;
			funcBefore&&funcBefore.call(o);
			if(typeof value==='string'){
				if(/^[+-]=\d+/.test(value)) value=value.replace('=',''),diffValue=true;
				value=parseFloat(value);
			}
			var	oriVal=$o.css(attr),//原始属性值
				b=isNaN(oriVal)?0:oriVal,//开始值,无值时为0
				c=diffValue?value:value-b,//差值
				d=time,//总运行时间
				e=this.easing[type],//缓动类型
				m=c>0?'ceil':'floor',//取最大绝对值
				timerId='__myFocusTimer__'+attr,//计数器id
				setProperty=$o[isOpacity?'setOpacity':'setAnimateStyle'],//属性设置方法
				origTime=(new Date)*1;//原始时间值
			o[timerId]&&clearInterval(o[timerId]);
			o[timerId]=setInterval(function(){
				var t=(new Date)-origTime;//已运行时间
				if(t<=d){
					setProperty.call($o,e(t,b,c,d),attr,m);
				}else{
					setProperty.call($o,b+c,attr,m);//设置最终值
					clearInterval(o[timerId]),o[timerId]=null;
					funcAfter&&funcAfter.call(o);
				}
			},13);
			return this;
		},
		fadeIn:function(time,type,fn){
			if(typeof time!=='number') fn=time,time=400;//默认400毫秒
			if(typeof type==='function') fn=type,type='';
			this.animate('opacity',1,time,type||'linear',function(){
				myFocus(this).css({display:'block',opacity:0});
			},fn);
			return this;
		},
		fadeOut:function(time,type,fn){
			if(typeof time!=='number') fn=time,time=400;//默认400毫秒
			if(typeof type==='function') fn=type,type='';
			this.animate('opacity',0,time,type||'linear',null,function(){
				this.style.display='none';
				fn&&fn.call(this);
			});
			return this;
		},
		slide:function(params,time,type,fn){
			if(typeof time!=='number') fn=time,time=800;//默认800毫秒
			if(typeof type==='function') fn=type,type='';
			for(var p in params) this.animate(p,params[p],time,type||'easeOut',null,fn);
			return this;
		},
		stop:function(){//停止所有运动
			var o=this[0];
			for(var p in o) if(p.indexOf('__myFocusTimer__')!==-1) o[p]&&clearInterval(o[p]);
			return this;
		},
		easing:{
			linear:function(t,b,c,d){return c*t/d + b;},
			swing:function(t,b,c,d) {return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;},
			easeIn:function(t,b,c,d){return c*(t/=d)*t*t*t + b;},
			easeOut:function(t,b,c,d){return -c*((t=t/d-1)*t*t*t - 1) + b;},
			easeInOut:function(t,b,c,d){return ((t/=d/2) < 1)?(c/2*t*t*t*t + b):(-c/2*((t-=2)*t*t*t - 2) + b);}
		}
	});
	myFocus.fn.extend({//Method(fn)
		bind:function(type,fn){
			myFocus.addEvent(this[0],type,fn);
			return this;
		},
		play:function(funcLastFrame,funcCurrentFrame,seamless){
			var	this_=this,p=this_.settings,n=this_.HTMLUListLength,t=p.time*1000,seamless=seamless||false,//是否无缝
				float=myFocus(this_.HTMLUList).css('float'),isLevel=float==='left',//仅支持'left'方向和'top'方向
				direction=isLevel?'left':'top',distance=isLevel?p.width:p.height,//运动距离
				indexLast=0,indexCurrent=p.index;//帧索引值,默认0
			this_.find('.loading').remove();//删除loading...
			this_.run=function(value){//循环运动函数,支持+-=value
				funcLastFrame&&funcLastFrame(indexLast,n);//运行前一帧
				indexCurrent=typeof value==='string'?indexLast+parseInt(value.replace('=','')):value;//fixed index
				if(indexCurrent<=-1){//prev run
					indexCurrent=n-1;//转到最后一帧
					if(seamless) this_.HTMLUList[0].parentNode.style[direction]=-n*distance+'px';//无缝的UL定位
				}
				if(indexCurrent>=n){//next run
					if(!seamless) indexCurrent=0;//非无缝时转到第一帧
					if(indexCurrent>=2*n){//无缝
						this_.HTMLUList[0].parentNode.style[direction]=-(n-1)*distance+'px';//无缝的UL定位
						indexCurrent=n;
					}
				}
				if(seamless&&indexLast>=n&&indexCurrent<n) indexCurrent+=n;//无缝时的按钮点击(保持同一方向)
				funcCurrentFrame&&funcCurrentFrame(indexCurrent,n,indexLast);//运行当前帧
				this_.runIndex=indexLast=indexCurrent;//保存已运行的帧索引
				//增加自定义回调函数@10.27
				p.onChange&&p.onChange.call(this_,indexCurrent);
			};
			//运行...(try是为了兼容风格js中play比bindControl先执行)
			try{this_.run(indexCurrent)}catch(e){setTimeout(function(){this_.run(indexCurrent)},0)};
			if(p.auto&&n>1){//自动切换
				this_.runTimer=setInterval(function(){this_.run('+=1')},t);//默认递增运行每帧
				this_.bind('mouseover',function(){//绑定事件
					clearInterval(this_.runTimer);
					this_.runTimer='pause';//标记以防止执行两次this_.runTimer
				}).bind('mouseout',function(){
					if(!this_.isStop&&this_.runTimer==='pause') this_.runTimer=setInterval(function(){this_.run('+=1')},t);
				});
			}
			this_.find('a').each(function(){//去除IE链接虚线
				this.onfocus=function(){this.blur();}
			});
		},
		bindControl:function($btnList,params){//params={thumbShowNum(略缩图显示数目(如果有)):num,isRunning(运行中的标记(当需要判断时)):boolean}
			var this_=this,p=this_.settings,type=p.trigger,delay=p.delay,par=params||{},tsNum=par.thumbShowNum||p.thumbShowNum;
			var run=function(){
				if(this.index!==this_.runIndex&&!par.isRunning){
					this_.run(this.index);
					return false;//阻止冒泡&默认事件
				}
			};
			$btnList.each(function(i){
				this.index=i;//记录自身索引
				var o=this,$o=myFocus(o);
				if(type==='click'){
					$o.bind('mouseover',function(){
						$o.addClass('hover');
					}).bind('mouseout',function(){
						$o.removeClass('hover');
					}).bind('click',run);
				}else if(type==='mouseover'){
					$o.bind('mouseover',function(){
						if(delay===0) run.call(o);
						else $btnList.mouseoverTimer=setTimeout(function(){run.call(o)},delay);
					}).bind('mouseout',function(){
						$btnList.mouseoverTimer&&clearTimeout($btnList.mouseoverTimer);
					});
				}else{
					alert('myFocus Error Setting(trigger) : \"'+type+'\"');
					return false;
				};
			});
			if(tsNum){//thumb
				var float=$btnList.css('float'),isLevel=float==='left'||float==='right';
				$btnList.dir=isLevel?'left':'top';//方向
				$btnList.n=this_.HTMLUListLength;//总数
				$btnList.showNum=tsNum;//显示数目
				$btnList.showStart=p.index;//显示的开始索引
				$btnList.showEnd=$btnList.showStart+tsNum-1;//显示的结尾索引
				$btnList.distance=$btnList.css(isLevel?'width':'height');//运动距离
				$btnList.slideBody=$btnList.parent();//运动对象(ul)
			}
		},
		scrollTo:function(i,time){
			var n=this.n,dir=this.dir,$ul=this.slideBody,css={};//总数/方向/滑动body(ul)/样式
			if(i>=this.showEnd){//next
				this.showEnd=i<n-1?i+1:i;

				this.showStart=this.showEnd-this.showNum+1;
			}else if(i<=this.showStart){//prev
				this.showStart=i>0?i-1:0;
				this.showEnd=this.showStart+this.showNum-1;
			}
			css[dir]=-this.showStart*this.distance;
			$ul.slide(css,time||500,'easeOut');
			return this;
		}
	});
	myFocus.extend({//Init
		set:function(p,callback){
			var F=this,id=p.id,oStyle=F.initBaseCSS(id);
			p.pattern=p.pattern||F.defConfig.pattern;
			p.__clsName=p.pattern+'_'+id;
			F.addEvent(window,'load',function(){F.onloadWindow=true});
			F.loadPattern(p,function(){
				p=F.extend({},F.defConfig,F.config[p.pattern],p);//收集完整参数
				F.getBoxReady(p,function(){
					var $o=F($id(id));
					p.$o=$o;//保存node
					//xml load
					p.xmlFile&&F.loadXML(p);
					p.pic=$class('pic',$o[0])[0];//保存node for是否标准风格的判断及是否需要initcss
					p.width=p.width||$o.css('width'),p.height=p.height||$o.css('height');//获得box高/宽
					F.initCSS(p,oStyle);//css
					$o.addClass(p.pattern+' '+p.__clsName);//+className
					F.getIMGReady(p,function(arrSize){
						if(p.autoZoom) F.zoomIMG(p,arrSize);//缩放图片
						F.pattern[p.pattern](p,F);//运行pattern代码
						callback&&callback();
					});
				});
			});
		},
		onloadWindow:false,
		loadPattern:function(p,callback){
			if(this.pattern[p.pattern]){callback();return;}//如果已加载pattern
			var path=this.getFilePath()+'mf-pattern/'+p.pattern;
			var js= document.createElement("script"),css=document.createElement("link"),src=path+'.js',href=path+'.css'; 
			js.type = "text/javascript",js.src=src;
			css.rel = "stylesheet",css.href=href;
			var head=$tag('head')[0],isSuccess=false,timeout=10*1000;//超时10秒
			head.appendChild(css);
			head.appendChild(js);
			js.onload=js.onreadystatechange=function(){
				if(isSuccess) return;//防止IE9+重复执行
				if(!js.readyState||js.readyState=="loaded"||js.readyState=="complete"){
					isSuccess=true;
					callback();
					js.onload=js.onreadystatechange=null;
				}
			};
			setTimeout(function(){if(!isSuccess) $id(p.id).innerHTML='加载失败: '+src;},timeout);
		},
		getFilePath:function(){
			var path='';
			var scripts=$tag("script");
			for(var i=0,len=scripts.length;i<len;i++){
				var src=scripts[i].src;
				if(src&&/myfocus([\.-].*)?\.js/i.test(src)){//兼容myfocus.js/myfocus.min.js/myfocus-2.x.js
					path=src;
					break;
				}
			};
			return path.slice(0,path.lastIndexOf('/')+1);
		},
		getBoxReady:function(p,fn){
			var F=this;
			(function(){
				try{
					if(F.isIE) $id(p.id).doScroll();
					else $id(p.id).innerHTML;
					fn();
				}catch(e){
					if(!F.onloadWindow) setTimeout(arguments.callee,0);
				}
			})();
		},
		getIMGReady:function(p,callback){
			var isShow=p.loadingShow;
			var box=$id(p.id),img=$tag('img',p.pic),len=img.length,
				count=0,done=false,arrSize=new Array(len);
			if(!isShow||!len){callback();return;}//无延迟
			for(var i=0;i<len;i++){
				var IMG=new Image();
				IMG.i=i;//标记前后顺序
				IMG.onload=function(){
					count+=1;
					arrSize[this.i]={w:this.width,h:this.height};//储存for zoomIMG
					if(count==len&&!done){done=true,callback(arrSize);}
				};
				IMG.src=img[i].src;
			};
		},
		zoomIMG:function(p,arrSize){
			var imgs=$tag('img',p.pic),len=imgs.length,boxWidth=p.width,boxHeight=p.height;
			for(var i=0;i<len;i++){
				var w=arrSize[i].w,h=arrSize[i].h;
				if(w == boxWidth && h == boxHeight) continue;
				if(w < boxWidth && h < boxHeight){
					var width=w,height=h,top=(boxHeight-height)/2;
				}else if(w / h >= boxWidth / boxHeight){
					var width=boxWidth,height=boxWidth/w*h,top=(boxHeight-height)/2;
				}else{
					var width=boxHeight/h*w,height=boxHeight,top=0;
				}
				imgs[i].style.cssText=';width:'+width+'px;height:'+height+'px;margin-top:'+top+'px;';
			};
		},
		initCSS:function(p,oStyle){
			var css=[],w=p.width||'',h=p.height||'';
			if(p.pic){
				css.push('.'+p.__clsName+' *{margin:0;padding:0;border:0;list-style:none;}.'+p.__clsName+'{position:relative;width:'+w+'px;height:'+h+'px;overflow:hidden;font:12px/1.5 Verdana;text-align:left;background:#fff;visibility:visible!important;}.'+p.__clsName+' .pic{position:relative;width:'+w+'px;height:'+h+'px;overflow:hidden;}.'+p.__clsName+' .txt li{width:'+w+'px;height:'+p.txtHeight+'px!important;overflow:hidden;}');
				if(p.wrap) p.$o.wrap('<div class="'+p.pattern+'_wrap"></div>');
				if(p.autoZoom) css.push('.'+p.__clsName+' .pic li{text-align:center;width:'+w+'px;height:'+h+'px;}');//缩放图片居中
			}
			try{oStyle.styleSheet.cssText=css.join('')}catch(e){oStyle.innerHTML=css.join('')}
		},
		initBaseCSS:function(id){
			var s='#'+id+' *{display:none}',oStyle=document.createElement('style');
			oStyle.type='text/css';
			try{oStyle.styleSheet.cssText=s}catch(e){oStyle.innerHTML=s}
			var oHead = $tag('head',document)[0];
			oHead.insertBefore(oStyle,oHead.firstChild);
			return oStyle;
		}
	});
	myFocus.extend({//Method(myFocus)
		isIE:!!(document.all&&navigator.userAgent.indexOf('Opera')===-1),//!(+[1,]) BUG IN IE9+
		addEvent:function(o,type,fn){
			var ie=this.isIE,e=ie?'attachEvent':'addEventListener',t=(ie?'on':'')+type;
			o[e](t,function(e){
				var e=e||window.event,flag=fn.call(o,e);
				if(flag===false){
					if(ie) e.cancelBubble=true,e.returnValue=false;
					else e.stopPropagation(),e.preventDefault();
				}
			},false);
		},
		loadXML:function(p){
			var xmlhttp = window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLDOM");
			xmlhttp.open("GET", p.xmlFile + "?" + Math.random(), false);
			xmlhttp.send(null);
			this.appendXML(xmlhttp.responseXML,p);
		},
		appendXML:function(xml,p){
			var items=xml.documentElement.getElementsByTagName("item"),len=items.length;
			var html=['<div class="loading"></div><div class="pic"><ul>'];
			for(var i=0;i<len;i++){
				html.push('<li><a href="'+items[i].getAttribute('href')+'"><img src="'+items[i].getAttribute('image')+'" thumb="'+items[i].getAttribute('thumb')+'" alt="'+items[i].getAttribute('title')+'" text="'+items[i].getAttribute('text')+'" /></a></li>');
			}
			html.push('</ul></div>');
			p.$o[0].innerHTML=html.join('');
		}
	});
	//支持JQ
	if(typeof jQuery!=='undefined'){
		jQuery.fn.extend({
			myFocus:function(p,fn){
				if(!p) p={};
				p.id=this[0].id;
				if(!p.id) p.id=this[0].id='mF__ID__';
				myFocus.set(p,fn);
			}
		});
	}
})();