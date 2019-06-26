/ **
* DD_belatedPNG：添加IE6支持：CSS背景图像和HTML <IMG />的PNG图像。
*作者：Drew Diller
*电子邮件：drew.diller@gmail.com
*网址：http：//www.dillerdesign.com/experiment/DD_belatedPNG/
*版本：0.0.8a
*根据麻省理工学院许可证获得许可：http：//dillerdesign.com/experiment/DD_belatedPNG/#license
*
*用法示例：
* DD_belatedPNG.fix（'。png_bg'）; //参数是一个CSS选择器
* DD_belatedPNG.fixPng（someNode）; //参数是HTMLDomElement
** /

/ *
请阅读：
这个脚本中的所有内容都是SILLY。我知道这个。IE渲染某些像素没有意义，所以这段代码也没有！
* /

var DD_belatedPNG = {
	ns：'DD_belatedPNG'，
	imgSize：{}，
	延迟：10，
	nodesFixed：0，
	createVmlNameSpace：function（）{/ * enable VML * /
		if（document.namespaces &&！document.namespaces [this.ns]）{
			document.namespaces.add（this.ns，'urn：schemas-microsoft-com：vml'）;
		}
	}，
	createVmlStyleSheet：function（）{/ * style VML，启用行为* /
		/ *
			以防许多其他开发人员添加
			许多其他样式表使用document.createStyleSheet
			并达到31限制标记，让我们不要使用那种方法！
			进一步阅读：http：//msdn.microsoft.com/en-us/library/ms531194（VS.85）.aspx
		* /
		var screenStyleSheet，printStyleSheet;
		screenStyleSheet = document.createElement（'style'）;
		screenStyleSheet.setAttribute（'media'，'screen'）;
		document.documentElement.firstChild.insertBefore（screenStyleSheet，document.documentElement.firstChild.firstChild）;
		if（screenStyleSheet.styleSheet）{
			screenStyleSheet = screenStyleSheet.styleSheet;
			screenStyleSheet.addRule（this.ns +'\\：*'，'{behavior：url（＃default＃VML）}'）;
			screenStyleSheet.addRule（this.ns +'\\：shape'，'position：absolute;'）;
			screenStyleSheet.addRule（'img。'+ this.ns +'_ sizeFinder'，'behavior：none; border：none; position：absolute; z-index：-1; top：-10000px; visibility：hidden;'）; / *大型负顶值，用于避免大型图像的垂直滚动条，由James O'Brien建议，http：//www.thanatopsic.org/hendrik/ * /
			this.screenStyleSheet = screenStyleSheet;
			
			/ *添加打印介质样式表，以防止VML工件显示在打印（包括预览）中。* /
			/ *感谢RémiPrévost实现自动化！* /
			printStyleSheet = document.createElement（'style'）;
			printStyleSheet.setAttribute（'media'，'print'）;
			document.documentElement.firstChild.insertBefore（printStyleSheet，document.documentElement.firstChild.firstChild）;
			printStyleSheet = printStyleSheet.styleSheet;
			printStyleSheet.addRule（this.ns +'\\：*'，'{display：none！important;}'）;
			printStyleSheet.addRule（'img。'+ this.ns +'_ sizefinder'，'{display：none！important;}'）;
		}
	}，
	readPropertyChange：function（）{
		var el，display，v;
		el = event.srcElement;
		if（！el.vmlInitiated）{
			返回;
		}
		if（event.propertyName.search（'background'）！= -1 || event.propertyName.search（'border'）！= -1）{
			DD_belatedPNG.applyVML（EL）;
		}
		if（event.propertyName =='style.display'）{
			display =（el.currentStyle.display =='none'）？'none'：'阻止';
			for（v in el.vml）{
				if（el.vml.hasOwnProperty（v））{
					el.vml [v] .shape.style.display = display;
				}
			}
		}
		if（event.propertyName.search（'filter'）！= -1）{
			DD_belatedPNG.vmlOpacity（EL）;
		}
	}，
	vmlOpacity：function（el）{
		if（el.currentStyle.filter.search（'lpha'）！= -1）{
			var trans = el.currentStyle.filter;
			trans = parseInt（trans.substring（trans.lastIndexOf（'='）+ 1，trans.lastIndexOf（'）'）），10）/ 100;
			el.vml.color.shape.style.filter = el.currentStyle.filter; / *完成猜测* /
			el.vml.image.fill.opacity = trans; / *完成猜测* /
		}
	}，
	handlePseudoHover：function（el）{
		如果没有setTimeout * /，setTimeout（function（）{/ *将无法正常工作
			DD_belatedPNG.applyVML（EL）;
		}，1）;
	}，
	/ **
	*这是在文档中使用的方法。
	* @param {String} selector  -  REQUIRED  - 一个CSS选择器，例如'#doc .container'
	** /
	修复：function（selector）{
		if（this.screenStyleSheet）{
			var选择器，i;
			selectors = selector.split（'，'）; / *支持多个选择器，不再需要多次调用* /
			for（i = 0; i <selectors.length; i ++）{
				this.screenStyleSheet.addRule（selectors [i]，'behavior：expression（DD_belatedPNG.fixPng（this））'）; / *似乎执行该函数而不将其添加到样式表 - 有趣... * /
			}
		}
	}，
	applyVML：function（el）{
		el.runtimeStyle.cssText ='';
		this.vmlFill（EL）;
		this.vmlOffsets（EL）;
		this.vmlOpacity（EL）;
		if（el.isImg）{
			this.copyImageBorders（EL）;
		}
	}，
	attachHandlers：function（el）{
		var self，handlers，handler，moreForAs，a，h;
		self = this;
		handlers = {resize：'vmlOffsets'，move：'vmlOffsets'};
		if（el.nodeName =='A'）{
			moreForAs = {mouseleave：'handlePseudoHover'，mouseenter：'handlePseudoHover'，focus：'handlePseudoHover'，blur：'handlePseudoHover'};
			for（a in moreForAs）{			
				if（moreForAs.hasOwnProperty（a））{
					处理程序[a] = moreForAs [a];
				}
			}
		}
		for（h in handlers）{
			if（handlers.hasOwnProperty（h）​​）{
				handler = function（）{
					自[处理程序并[h]]（EL）;
				};
				el.attachEvent（'on'+ h，handler）;
			}
		}
		el.attachEvent（'onpropertychange'，this.readPropertyChange）;
	}，
	giveLayout：function（el）{
		el.style.zoom = 1;
		if（el.currentStyle.position =='static'）{
			el.style.position ='relative';
		}
	}，
	copyImageBorders：function（el）{
		var styles，s;
		styles = {'borderStyle'：true，'borderWidth'：true，'borderColor'：true};
		for（s in styles）{
			if（styles.hasOwnProperty（s））{
				el.vml.color.shape.style [s] = el.currentStyle [s];
			}
		}
	}，
	vmlFill：function（el）{
		if（！el.currentStyle）{
			返回;
		} else {
			var elStyle，noImg，lib，v，img，imgLoaded;
			elStyle = el.currentStyle;
		}
		for（v in el.vml）{
			if（el.vml.hasOwnProperty（v））{
				el.vml [v] .shape.style.zIndex = elStyle.zIndex;
			}
		}
		el.runtimeStyle.backgroundColor ='';
		el.runtimeStyle.backgroundImage ='';
		noImg = true;
		if（elStyle.backgroundImage！='none'|| el.isImg）{
			if（！el.isImg）{
				el.vmlBg = elStyle.backgroundImage;
				el.vmlBg = el.vmlBg.substr（5，el.vmlBg.lastIndexOf（'“）'） -  5）;
			}
			其他{
				el.vmlBg = el.src;
			}
			lib = this;
			if（！lib.imgSize [el.vmlBg]）{/ *确定加载图像的大小* /
				img = document.createElement（'img'）;
				lib.imgSize [el.vmlBg] = img;
				img.className = lib.ns +'_ sizeFinder';
				img.runtimeStyle.cssText ='behavior：none; 位置：绝对的; 左：-10000px; 顶部：-10000px; 边界：无; 余量：0; 填充：0;'; / *确保将行为设置为none以防止辅助元素的意外匹配！* /
				imgLoaded = function（）{
					this.width = this.offsetWidth; / *奇怪的缓存破坏要求！* /
					this.height = this.offsetHeight;
					lib.vmlOffsets（EL）;
				};
				img.attachEvent（'onload'，imgLoaded）;
				img.src = el.vmlBg;
				img.removeAttribute（ '宽度'）;
				img.removeAttribute（ '高度'）;
				document.body.insertBefore（img，document.body.firstChild）;
			}
			el.vml.image.fill.src = el.vmlBg;
			noImg = false;
		}
		el.vml.image.fill.on =！noImg;
		el.vml.image.fill.color ='none';
		el.vml.color.shape.style.backgroundColor = elStyle.backgroundColor;
		el.runtimeStyle.backgroundImage ='none';
		el.runtimeStyle.backgroundColor ='transparent';
	}，
	/ * IE无法弄清楚当offsetLeft和clientLeft加起来为1时会发生什么，并且VML最终会变得模糊...所以我们必须将事物推/放大1个像素然后剪掉多余的* /
	vmlOffsets：function（el）{
		var thisStyle，size，fudge，makeVisible，bg，bgR，dC，altC，b，c，v;
		thisStyle = el.currentStyle;
		size = {'W'：el.clientWidth + 1，'H'：el.clientHeight + 1，'w'：this.imgSize [el.vmlBg] .width，'h'：this.imgSize [el.vmlBg] .height，'L'：el.offsetLeft，'T'：el.offsetTop，'bLW'：el.clientLeft，'bTW'：el.clientTop};
		fudge =（size.L + size.bLW == 1）？1：0;
		/ * vml形状，左，顶部，宽度，高度，原点* /
		makeVisible = function（vml，l，t，w，h，o）{
			vml.coordsize = w +'，'+ h;
			vml.coordorigin = o +'，'+ o;
			vml.path ='m0,0l'+ w +'，0l'+ w +'，'+ h +'l0，'+ h +'xe';
			vml.style.width = w +'px';
			vml.style.height = h +'px';
			vml.style.left = l +'px';
			vml.style.top = t +'px';
		};
		makeVisible（el.vml.color.shape，（size.L +（el.isImg？0：size.bLW）），（size.T +（el.isImg？0：size.bTW）），（size.W -1），（size.H-1），0）;
		makeVisible（el.vml.image.shape，（size.L + size.bLW），（size.T + size.bTW），（size.W），（size.H），1）;
		bg = {'X'：0，'Y'：0};
		if（el.isImg）{
			bg.X = parseInt（thisStyle.paddingLeft，10）+ 1;
			bg.Y = parseInt（thisStyle.paddingTop，10）+ 1;
		}
		其他{
			for（b in bg）{
				if（bg.hasOwnProperty（b））{
					this.figurePercentage（bg，size，b，thisStyle ['backgroundPosition'+ b]）;
				}
			}
		}
		el.vml.image.fill.position =（bg.X / size.W）+'，'+（bg.Y / size.H）;
		bgR = thisStyle.backgroundRepeat;
		dC = {'T'：1，'R'：size.W + fudge，'B'：size.H，'L'：1 + fudge}; / *这些是重复任何类型的默认值* /
		altC = {'X'：{'b1'：'L'，'b2'：'R'，'d'：'W'}，'Y'：{'b1'：'T'，'b2'： 'B'，'d'：'H'}};
		if（bgR！='repeat'|| el.isImg）{
			c = {'T':( bg.Y），'R':( bg.X + size.w），'B':( bg.Y + size.h），'L':( bg.X） }; / *这些是无重复的默认值 - 剪辑到图像位置* /
			if（bgR.search（'repeat-'）！= -1）{/ *现在让我们回复到dC for repeat-x或repeat-y * /
				v = bgR.split（'repeat  - '）[1] .toUpperCase（）;
				c [altC [v] .b1] = 1;
				c [altC [v] .b2] = size [altC [v] .d];
			}
			if（cB> size.H）{
				cB = size.H;
			}
			el.vml.image.shape.style.clip ='rect（'+ c.T +'px'+（c.R + fudge）+'px'+ c.B +'px'+（c.L + fudge） + '像素）';
		}
		其他{
			el.vml.image.shape.style.clip ='rect（'+ dC.T +'px'+ dC.R +'px'+ dC.B +'px'+ dC.L +'px）';
		}
	}，
	figurePercentage：function（bg，size，axis，position）{
		var horizo​​ntal，fraction;
		fraction = true;
		horizo​​ntal =（axis =='X'）;
		开关（位置）{
			案例'左'：
			案例'顶部'：
				bg [轴] = 0;
				打破;
			案例'中心'：
				bg [轴] = 0.5;
				打破;
			案件'正确'：
			案件'底部'：
				bg [轴] = 1;
				打破;
			默认：
				if（position.search（'％'）！= -1）{
					bg [axis] = parseInt（position，10）/ 100;
				}
				其他{
					fraction = false;
				}
		}
		bg [轴] = Math.ceil（分数？（（大小[水平？'W'：'H'] * bg [轴]） - （大小[水平？'w'：'h'] * bg [轴] ））：parseInt（position，10））;
		if（bg [axis]％2 === 0）{
			BG [轴] ++;
		}
		返回bg [轴];
	}，
	fixPng：function（el）{
		el.style.behavior ='none';
		var lib，els，nodeStr，v，e;
		if（el.nodeName =='BODY'|| el.nodeName =='TD'|| el.nodeName =='TR'）{/ *不支持的元素* /
			返回;
		}
		el.isImg = false;
		if（el.nodeName =='IMG'）{
			if（el.src.toLowerCase（）。search（/ \ .png $ /）！= -1）{
				el.isImg = true;
				el.style.visibility ='hidden';
			}
			其他{
				返回;
			}
		}
		else if（el.currentStyle.backgroundImage.toLowerCase（）。search（'。png'）== -1）{
			返回;
		}
		lib = DD_belatedPNG;
		el.vml = {color：{}，image：{}};
		els = {shape：{}，填充：{}};
		for（v in el.vml）{
			if（el.vml.hasOwnProperty（v））{
				for（e in els）{
					if（els.hasOwnProperty（e））{
						nodeStr = lib.ns +'：'+ e;
						el.vml [v] [e] = document.createElement（nodeStr）;
					}
				}
				el.vml [v] .shape.stroked = false;
				el.vml [V] .shape.appendChild（el.vml [V] .fill伪）;
				el.parentNode.insertBefore（el.vml [v] .shape，el）;
			}
		}
		el.vml.image.shape.fillcolor ='none'; / *等待图像加载时，不要显示空白的shapeangle。* /
		el.vml.image.fill.type ='tile'; / *使图像显示出来。* /
		el.vml.color.fill.on = false; / *实际上要应用vml元素的style.backgroundColor，所以隐藏白度。* /
		lib.attachHandlers（EL）;
		lib.giveLayout（EL）;
		lib.giveLayout（el.offsetParent）;
		el.vmlInitiated = true;
		lib.applyVML（EL）; / *渲染！* /
	}
};
尝试{
	document.execCommand（“BackgroundImageCache”，false，true）; / * TredoSoft多个IE不喜欢这个，所以试试{}它* /
} catch（r）{}
DD_belatedPNG.createVmlNameSpace（）;
DD_belatedPNG.createVmlStyleSheet（）;