myFocus v2.0.4
=======

myFocus是一个专注于WEB端焦点图/轮换图的JS库

### 特点

* 原生JS编写，独立无依赖
* 性能卓越，同样效果比jQuery更流畅
* 简单易用，傻瓜式API和标准HTML结构
* 效果华丽，媲美Flash焦点图
* 功能强大，20多种效果切换，支持N种常用设置

这一切，在5.93KB(gzip)中实现

### 用法

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
	        <!-- 你可以根据你的需要增加更多的列 -->
	  	</ul>
	  </div>
	</div>

#### JS:

	myFocus.set({id: 'boxID'});

[查看演示>> ](http://koen301.github.io/myfocus/demo/base.html)
