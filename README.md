myFocus v2.0.4
=======

myFocus是一个专注于WEB端焦点图/轮换图的JS库

## 特点

* 原生JS编写，独立无依赖
* 性能卓越，同样效果比jQuery更流畅
* 简单易用，傻瓜式API和标准HTML结构
* 效果华丽，媲美Flash焦点图
* 功能强大，30多种风格切换，支持N种常用设置
* 体积小巧，仅5.93KB(minified & gzipped)
* 支持 IE6+ / Chrome / Firefox 等现代浏览器
* 支持自定义开发扩展

## 用法

#### HTML:

	<!-- 焦点图盒子 -->
	<div id="boxID">
	  <!-- 载入中的Loading图片(可选) -->
	  <div class="loading"><img src="img/loading.gif" alt="请稍候..." /></div>
	  <!-- 内容列表 -->
	  <div class="pic">
	  	<ul>
	        <li><a href="#"><img src="img/1.jpg" alt="标题1" /></a></li>
	        <li><a href="#"><img src="img/2.jpg" alt="标题2" /></a></li>
	        <li><a href="#"><img src="img/3.jpg" alt="标题3" /></a></li>
	        <li><a href="#"><img src="img/4.jpg" alt="标题4" /></a></li>
	        <li><a href="#"><img src="img/5.jpg" alt="标题5" /></a></li>
	        <!-- 你可以根据需要添加更多的列 -->
	  	</ul>
	  </div>
	</div>

#### JS:

	myFocus.set({id: 'boxID'});

[查看效果>> ](http://koen301.github.io/myfocus/demo/base.html)

当然，你可以使用更多自定义的设置，例如：

	myFocus.set({
	    id: 'boxID',//焦点图盒子ID
	    pattern: 'mF_tbhuabao',//焦点图风格的名称
	    time: 3,//切换时间间隔(秒)
	    trigger: 'mouseover',//触发切换模式:'click'(点击)/'mouseover'(悬停)
	    delay: 200,//'mouseover'模式下的切换延迟(毫秒)
	    txtHeight: 'default'//标题高度设置(像素),'default'为默认CSS高度，0为隐藏
	});

[查看效果>> ](http://koen301.github.io/myfocus/demo/custom.html)

更多效果/详细用法/API，请参考[百度“myfocus”>>](http://www.baidu.com/s?wd=myfocus)。

## 下载

请到 [dist](https://github.com/koen301/myfocus/tree/gh-pages/dist) 目录下载 myfocus 的min版(压缩)或full版(无压缩)，并在子目录“mf-pattern”选择风格下载。

注意：myfocus 运行时会自动寻找其子目录“mf-pattern”下相应的风格文件，所以“mf-pattern”文件夹一定要存在。

[打包下载 myfocus 及它的所有风格文件>>](http://koen301.github.io/myfocus/pack/myfocus.zip)

## 版本 & 问题

myFocus从v2.0.4开始转移到github，后续版本（如果有）也会在这里更新。

相关问题欢迎在[Issues](https://github.com/koen301/myfocus/issues)中提出。
