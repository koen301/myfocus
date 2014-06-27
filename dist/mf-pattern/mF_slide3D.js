myFocus.pattern.extend({//*********************mF_slide3D******************
	'mF_slide3D':function(settings,$){
		var $focus=$(settings);
		var $picUl=$focus.find('.pic ul');
		$picUl[0].innerHTML+=$picUl[0].innerHTML;
		var $numList=$focus.addListNum().find('li');
		var $picList=$picUl.find('li');
		var $m11=$focus.addHtml('<div class="mask11"></div>');
		var $m12=$focus.addHtml('<div class="mask12"></div>');
		var $m21=$focus.addHtml('<div class="mask21"></div>');
		var $m22=$focus.addHtml('<div class="mask22"></div>');
		var $nextBtn=$focus.addHtml('<div class="next"><a href="javascript:;">NEXT</a></div>');
		//PLAY
		var w=settings.width,
			h=settings.height,
			d=Math.ceil(settings.height/6),//立体深度
			halfW=w/2;
		$focus.play(function(i){
			$m11[0].style.cssText=$m12[0].style.cssText='border-width:0px '+halfW+'px;';
			$m21[0].style.cssText=$m22[0].style.cssText='border-width:'+d+'px 0px;';
			$numList[i].className='';
		},function(next,n,prev){
			$picList[n].innerHTML=$picList[prev].innerHTML;
			$picList[n+1].innerHTML=$picList[next].innerHTML;
			$picList.eq(n).find('img').css({width:w,height:h}).slide({width:0});
			$picList.eq(n+1).find('img').css({width:0,height:h}).slide({width:w});
			$m11.slide({borderLeftWidth:0,borderRightWidth:0,borderTopWidth:d,borderBottomWidth:d});
			$m12.slide({borderLeftWidth:0,borderRightWidth:0,borderTopWidth:d,borderBottomWidth:d});
			$m21.slide({borderLeftWidth:halfW,borderRightWidth:halfW,borderTopWidth:0,borderBottomWidth:0});
			$m22.slide({borderLeftWidth:halfW,borderRightWidth:halfW,borderTopWidth:0,borderBottomWidth:0});
			$numList[next].className='current';
		});
		//Control
		$focus.bindControl($numList);
		//Next
		$nextBtn.bind('click',function(){$focus.run('+=1')});
	}
});