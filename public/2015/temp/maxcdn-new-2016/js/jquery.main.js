// page init
jQuery(function(){
	initStickyBlock();
	initMobileNav();
});

// initialize fixed blocks on scroll
function initFixedScrollBlock() {
	jQuery('#wrapper').fixedScrollBlock({
		slideBlock: '#header'
	});
}

// init sticky header
function initStickyBlock() {
	jQuery('#header').StickyBlock({
		fixedClass : 'fixed-position',
		heightRatio: 1
	});
}

// mobile menu init
function initMobileNav() {
	jQuery('body').mobileNav({
		hideOnClickOutside: true,
		menuActiveClass: 'nav-active',
		menuOpener: '.nav-opener',
		menuDrop: '.nav-bar'
	});
}

/*
 * Simple Mobile Navigation
 */
;(function($) {
	function MobileNav(options) {
		this.options = $.extend({
			container: null,
			hideOnClickOutside: false,
			menuActiveClass: 'nav-active',
			menuOpener: '.nav-opener',
			menuDrop: '.nav-drop',
			toggleEvent: 'click',
			outsideClickEvent: 'click touchstart pointerdown MSPointerDown'
		}, options);
		this.initStructure();
		this.attachEvents();
	}
	MobileNav.prototype = {
		initStructure: function() {
			this.page = $('html');
			this.container = $(this.options.container);
			this.opener = this.container.find(this.options.menuOpener);
			this.drop = this.container.find(this.options.menuDrop);
		},
		attachEvents: function() {
			var self = this;

			if(activateResizeHandler) {
				activateResizeHandler();
				activateResizeHandler = null;
			}

			this.outsideClickHandler = function(e) {
				if(self.isOpened()) {
					var target = $(e.target);
					if(!target.closest(self.opener).length && !target.closest(self.drop).length) {
						self.hide();
					}
				}
			};

			this.openerClickHandler = function(e) {
				e.preventDefault();
				self.toggle();
			};

			this.opener.on(this.options.toggleEvent, this.openerClickHandler);
		},
		isOpened: function() {
			return this.container.hasClass(this.options.menuActiveClass);
		},
		show: function() {
			this.container.addClass(this.options.menuActiveClass);
			if(this.options.hideOnClickOutside) {
				this.page.on(this.options.outsideClickEvent, this.outsideClickHandler);
			}
		},
		hide: function() {
			this.container.removeClass(this.options.menuActiveClass);
			if(this.options.hideOnClickOutside) {
				this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
			}
		},
		toggle: function() {
			if(this.isOpened()) {
				this.hide();
			} else {
				this.show();
			}
		},
		destroy: function() {
			this.container.removeClass(this.options.menuActiveClass);
			this.opener.off(this.options.toggleEvent, this.clickHandler);
			this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
		}
	};

	var activateResizeHandler = function() {
		var win = $(window),
			doc = $('html'),
			resizeClass = 'resize-active',
			flag, timer;
		var removeClassHandler = function() {
			flag = false;
			doc.removeClass(resizeClass);
		};
		var resizeHandler = function() {
			if(!flag) {
				flag = true;
				doc.addClass(resizeClass);
			}
			clearTimeout(timer);
			timer = setTimeout(removeClassHandler, 500);
		};
		win.on('resize orientationchange', resizeHandler);
	};

	$.fn.mobileNav = function(options) {
		return this.each(function() {
			var params = $.extend({}, options, {container: this}),
				instance = new MobileNav(params);
			$.data(this, 'MobileNav', instance);
		});
	};
}(jQuery));

/*
 * sticky block plugin
 */
;(function($) {
	function StickyBlock(options) {
		this.options = $.extend({
			holder: null,
			fixedClass : 'fixed',
			compareBlock: 'div',
			blockHeight: false,
			blockTop: false,
			heightRatio: false
		}, options);
		this.init();
	}
	StickyBlock.prototype = {
		init: function() {
			if(this.options.holder) {
				this.findElements();
				this.attachEvents();
			}
		},
		findElements: function() {
			this.holder = jQuery(this.options.holder);
			this.compareBlock = jQuery(this.options.compareBlock);
			this.win = jQuery(window);

			if (this.options.blockHeight){
				this.scrollHeight  = this.compareBlock.innerHeight();
			}

			if (this.options.blockTop){
				this.scrollHeight  = this.compareBlock.offset().top;
			}

			if (this.options.heightRatio){
				this.scrollHeight  = this.options.heightRatio;
			}
		},
		attachEvents: function() {
			// bind handlers scope
			var self = this;
			this.bindHandlers(['onScroll']);
			$(window).bind('scroll resize load', this.onScroll);
		},
		onScroll: function() {
			var self = this;
			self.scrollTop = self.win.scrollTop();
			if (self.scrollTop > self.scrollHeight){
				self.holder.addClass(self.options.fixedClass);
			} else {
				self.holder.removeClass(self.options.fixedClass);
			}
		},
		bindHandlers: function(handlersList) {
			var self = this;
			$.each(handlersList, function(index, handler) {
				var origHandler = self[handler];
				self[handler] = function() {
					return origHandler.apply(self, arguments);
				};
			});
		},
		makeCallback: function(name) {
			if(typeof this.options[name] === 'function') {
				var args = Array.prototype.slice.call(arguments);
				args.shift();
				this.options[name].apply(this, args);
			}
		}
	};

	// jQuery plugin interface
	$.fn.StickyBlock = function(opt) {
		return this.each(function() {
			new StickyBlock($.extend(opt, {holder: this}));
		});
	};
}(jQuery));
