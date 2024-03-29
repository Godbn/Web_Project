
var screenAnimateElements = {
	'.screen-1' : [
		'.screen-1__heading',
		'.screen-1__phone',
		'.screen-1__shadow',
	]
};

function setScreenAnimate(screenCls){
	var screen = document.querySelector(screenCls);	//获取当前屏的元素
	var AnimateElements = screenAnimateElements[screenCls];	// 需要设置动画的元素

	var isSetAnimateClass = false;	// 是否有初始化子元素的样式
	var isAnimateDone = false;	// 当前屏幕下所有子元素的状态是Done?

	screen.onclick = function(){


		// 初始化样式。增加init
		if (isSetAnimateClass === false){
			for(var i = 0; i = AnimateElements.length; i++){
				var element = document.querySelector(AnimateElements[i]);
				var baseCls = element.getAttribute('class');
				element.setAttribute('class', baseCls + ' ' + AnimateElements[i].substr(1) + '_animate_init');
			}
			isSetAnimateClass = true;
			return ;
		}
		// 切换所有 animateElements 的 init -> done
		if (isAnimateDone === false){
			for(var i = 0; i = AnimateElements.length; i++){
				var element = document.querySelector(screenAnimateElements[i]);
				var baseCls = element.getAttribute('class');
				element.setAttribute('class', baseCls.replace('_animate_init','_animate_done'));
			}
			isAnimateDone = true;
			return ;
		}


		// 切换所有 annimateElements 的 done -> init
		if (isAnimateDone === true){
			for(var i = 0; i = AnimateElements.length; i++){
				var element = document.querySelector(screenAnimateElements[i]);
				var baseCls = element.getAttribute('class');
				element.setAttribute('class', baseCls.replace('_animate_done','_animate_init'));
			}
			isAnimateDone = false;
			return ;
		}


	}


}
setScreenAnimate('.screen-1'); 