/*! scripts/tumblr.js */
(typeof Tumblr!=="undefined")||(Tumblr={});
/*! scripts/application/glass.js */
(function(c,a){var b=new (Backbone.View.extend({id:"glass_overlay",events:{click:"click"},locked:false,visible:false,initialize:function(){},render:function(){c(document.body).prepend(this.$el);this.rendered=true;Tumblr.Events.on("DOMEventor:escape",_.bind(this.keydown,this))},click:function(){if(this.locked){return}this.hide()},keydown:function(d){if(this.locked){return}if(this.visible){this.hide()}},show:function(e,d){if(_.isObject(Tumblr.KeyCommands)&&!Tumblr.KeyCommands.suspended){Tumblr.KeyCommands.suspend();this.glass_suspended_keys=true}if(!this.rendered){this.render()}d=d||"";this.on_close=e||function(){};this.visible=true;Tumblr.Events.trigger("Glass:show",this);this.$el.addClass("show");setTimeout(_.bind(function(){this.$el.addClass(d)},this),0)},hide:function(){this.visible=false;Tumblr.Events.trigger("Glass:hide",this);this.$el.removeClass("show");this.on_close();if(this.glass_suspended_keys){if(_.isObject(Tumblr.KeyCommands)){Tumblr.KeyCommands.resume()}this.glass_suspended_keys=false}},lock:function(){this.locked=true},unlock:function(){this.locked=false}}))();a.Glass=b})(jQuery,Tumblr);
/*! scripts/application/popover.js */
(function(d,b){var a=Backbone.View.extend({events:{click:"click"},initialize:function(e){this.button=d(e.el||this.$el);this.popover=e.popover||this.$el.find(".popover");this.on_hide=e.on_hide||function(){};this.on_show=e.on_show||function(){};this.auto_show=e.auto_show||false;this.prevent_default_click=e.prevent_default_click||false;if(this.auto_show){this.show()}a.register(this)},click:function(f){if(this.prevent_default_click){f.preventDefault()}this.toggle()},is_showing:false,show:function(){Tumblr.Glass.show(_.bind(function(){this.hide();this.on_hide()},this));this.popover.show();this.on_show();this.is_showing=true},hide:function(){if(!this.is_showing){return}Tumblr.Glass.on_close=_.bind(function(){if(this.is_showing){this.popover.hide();this.on_hide()}},this);Tumblr.Glass.hide();this.is_showing=false},toggle:function(){return this.is_showing?this.hide():this.show()}});a.instances=[];a.register=function(e){this.instances.push(e)};a.hide_all=function(){for(var e=0;e<this.instances.length;e++){this.instances[e].hide()}};a.hide_all_after=function(e){e=(e)?e:100;setTimeout(_.bind(function(){for(var f=0;f<this.instances.length;f++){this.instances[f].hide()}},this),e)};var c=a.extend({initialize:function(e){Tumblr.BasePopover.prototype.initialize.apply(this,arguments);this.skip_glass=e.skip_glass||false;this.skip_offset=e.skip_offset||false;this.direction=e.direction||"down";this.align=e.align||"left";this.glassless=e.glassless||false;if(this.glassless){this.skip_glass=true;this.glassless_options=e.glassless_options||{};var f={prevent_clicks:true,click_root:false};_.defaults(this.glassless_options,f);this.on("click:outside",this.__onClickOutside,this);this.on("click:inside",this.__onClickInside,this)}this.options=e||{};this.options.left=e.left||0;this.options.right=e.right||0;this.options.top=e.top||0;this.options.bottom=e.bottom||0},click:function(f){if(this.options.prevent_default_click){f.preventDefault()}if(!this.options.disable_auto_show){this.show()}return},__bindOutsideClick:function(){this.__outsideClickFn=_.bind(this.__onOutsideClick,this);document.addEventListener("click",this.__outsideClickFn,true);this.listenToOnce(Tumblr.Events,"popover:hide",function(){document.removeEventListener("click",this.__outsideClickFn,true);this.__outsideClickFn=null})},__onOutsideClick:function(i){var g=this.glassless_options;var f=false;var h=function(e){if(e.jquery){e=e[0]}if(!(e&&e.nodeType)){return false}return e};var j=[".ui_dialog"];j.push(this.popover);if(g.click_root){if(_.isArray(g.click_root)){j.concat(g.click_root)}else{j.push(g.click_root)}}if(g.dynamic_ignore_selectors){if(_.isArray(g.dynamic_ignore_selectors)){_.each(g.dynamic_ignore_selectors,function(e){j.push(d(e))})}else{j.push(d(g.dynamic_ignore_selectors))}}_.each(j,_.bind(function(e){clean_el=h(e);if(!clean_el&&_.isString(e)){clean_el=d(e).get(0)}if(!clean_el){return}if(i.target===clean_el||d.contains(clean_el,i.target)){f=true}},this));if(f){this.trigger("click:inside")}else{if(this.glassless_options.prevent_clicks){i.preventDefault();i.stopPropagation()}this.trigger("click:outside")}},__onClickOutside:function(){if(!this.is_showing){return}this.hide()},__onClickInside:function(){},show:function(){if(!this.skip_glass){Tumblr.Glass.show(_.bind(function(){this.hide();this.on_hide()},this))}if(!this.$el.is(this.popover.parent())){var f={top:0,left:0};var e={};if(!this.skip_offset){f=this.button.position()}if(this.direction!=="up"){e.top=(this.options.top+f.top)+"px"}else{e.bottom=(this.options.bottom-f.top-this.button.height())+"px"}if(this.align!=="right"){e.left=(this.options.left+f.left)+"px"}else{e.right=(this.options.right-f.left-this.button.width())+"px"}this.popover.css(e)}this.popover.show();this.on_show();this.is_showing=true;Tumblr.Events.trigger("popover:show",this);if(this.glassless&&!this.__outsideClickFn){this.__bindOutsideClick()}},hide:function(){if(!this.is_showing){return}if(!this.skip_glass){Tumblr.Glass.on_close=_.bind(function(){if(this.is_showing){this.popover.hide()}},this);Tumblr.Glass.hide()}else{this.popover.hide()}this.on_hide();this.is_showing=false;Tumblr.Events.trigger("popover:hide")},position:function(){this.popover.show();var i=d(window);var e={top:i.scrollTop(),left:i.scrollLeft()};this.popover.removeClass("up nipple_on_bottom");e.right=e.left+i.width();e.bottom=e.top+i.height();var h=this.popover.offset();var g=this.popover.outerHeight();var f=i.height();h.right=h.left+this.popover.outerWidth();h.bottom=h.top+g;if(f>g&&e.bottom<h.bottom){this.popover.addClass("up nipple_on_bottom")}}});b.BasePopover=a;b.Popover=c})(jQuery,Tumblr);
/*! scripts/loader.js */
(function(c,b,a){var d={zIndex:2000000000,color:"inherit",top:"50%",left:"50%",position:"absolute",className:"leviathan"};function e(f){if(!this.start){return new e(f)}this.created=false;this.opts=this.opts||{};b.extend(this.opts,e.defaults,d,f)}e.defaults={};e.prototype={start:function(f){if(typeof f!=="object"){f=false}if(f&&f instanceof jQuery){f=f[0]}if(!this.created&&!f){return false}if(!f){f=this.$target[0]}this.destroy();this.uid=this._uid();this.$target=c(f);this.$target.data("loader-uid",this.uid);this.el=this._html();this.$target.append(this.el);this.$loader=c("#loader_"+this.uid);this._init();return this},stop:function(){if(typeof this.$loader!=="undefined"){this.$loader.hide();this.$loader.removeClass("animate")}return this},destroy:function(){this.stop();if(typeof this.$loader!=="undefined"){this.$loader.remove()}if(typeof this.$target!=="undefined"){this.$target.removeData("loader-uid")}return this},_init:function(){this.created=true;if(this.opts.color!=="auto"){c(".Knight-Rider-bar",this.$loader).css("background-color",this.opts.color)}this.$loader.css("position",this.opts.position);this.$loader.css("z-index",this.opts.zIndex);this.$loader.css("top",this.opts.top);this.$loader.css("left",this.opts.left);this.$loader.show()},_uid:function(){return Math.floor(Math.random()*10000000)},_html:function(){return'<div id="loader_'+this.uid+'" class="Knight-Rider-loader centered animate '+this.opts.className+'"><div class="Knight-Rider-bar"></div><div class="Knight-Rider-bar"></div><div class="Knight-Rider-bar"></div></div>'}};a.Loader=e})(jQuery,_,Tumblr);
/*! scripts/archive/archive_view.js */
var Tumblr=Tumblr||{};(function(b,a){var c=Backbone.View.extend({el:"body",events:{"click #jump_to_month":"onMonthSelectorClick","click .year_navigation a":"onYearNavigationClick"},initialize:function(d){this.loading=true;this.current_month=0;this.month_selector_label="Month";this.loaded_url="";this.columnWidth=150;this.gutterWidth=10;this.loader=new Tumblr.Loader({color:"#D9D9D9",position:"absolute",top:"100%"});this.container=b(".l-content");this.month_selector=b("#jump_to_month .month");this.months_popover=new Tumblr.Popover({el:b("#jump_to_month"),popover:b("#browse_months_widget"),left:-85,top:33});b(window).one("load",_.bind(this.onFirstWindowLoad,this));b(window).on("load",_.bind(this.onWindowLoad,this));b(window).on("ghostscroll",_.bind(this.onWindowScroll,this));b(window).on("ghostbeforeresize",_.bind(this.onWindowResize,this));b(window).on("ghostafterresize",_.bind(this.onAfterResize,this));(function(){var h=b(window);var g=b(".l-content");var e="no-pointer-events";function f(){var j;var m;function i(){j=Math.floor(Math.random()*Math.pow(10,6));g.addClass(e);setTimeout(l,60);h.one("scroll",k);h.on("scroll."+j,_.debounce(n,80))}function n(){m=false;g.removeClass(e);h.off("scroll."+j);f()}function k(){m=true}function l(){if(!m){n()}}h.one("scroll",i)}h.load(function(){setTimeout(f,2000)})})();this.loader.start(this.container);this.__cache={cols:0,containerHeight:b(this.container).height(),windowHeight:b(window).height(),heading:[],currentMonth:""}},loadPosts:function(){if(b("a#next_page_link").length<1||b("a#next_page_link").attr("href")===this.loaded_url){return}this.loading=true;this.loader.start(this.container);this.loaded_url=b("a#next_page_link").attr("href");b.ajax({url:this.loaded_url,type:"GET",success:_.bind(function(f){var d=b(b.trim(f));var h=d.filter(".l-content"),g=d.filter("#pagination"),e=d.filter("script:contains(impixu)");(new Function(e.text()))();b("#pagination").html(g.html());this.addPosts(h);this.trackAjaxCalls(this.loaded_url)},this),error:function(){Tumblr.Dialog.alert("Sorry, something went wrong.")}})},trackAjaxCalls:function(e){var f={};var d=document.createElement("a");(function(){var i=document.getElementById("ga_target");if(!i){return true}d.href=e;e=d.href;var h="unknown_archive_route";if(d.pathname.match(/^\/archive/)){h="/archive"}if(d.pathname.match(/^\/archive\/\d{4}\/\d+/)){h="/archive/:year/:month"}try{var g=true;i.contentWindow.postMessage(["tick_google_analytics",g,e,h].join(";"),i.src.split("/analytics.html")[0]);if(typeof COMSCORE!="undefined"){i.contentWindow.postMessage("tick_comscore;"+e,i.src.split("/analytics.html")[0])}}catch(j){}return true})();(function(){return true})()},addPosts:function(e){var d=[];b(e).children().each(b.proxy(function(g,h){var l=h.id;b(h).children(".post").each(function(){d.push(this.getAttribute("data-id"))});if(l&&this.container.find("#"+l).length>0){var f=b(h).children();b("#"+l).append(f).masonry("appended",f)}else{var j=b.trim(b(".date",h).text());var k=_.find(this.__cache.heading,function(i){return i.month===j});if(k){return}this.container.append(b(h));this.__cache.heading.push({top:b(h).offset().top-120,month:b(h).text()});_.sortBy(this.__cache.heading,function(i){return i.top})}},this));this.updateLikeButtons(d);this.onWindowLoad()},updateLikeButtons:function(d){},updateLayout:function(){b(".posts:not(.masonry)").masonry({itemSelector:".post",gutterWidth:this.gutterWidth,columnWidth:this.columnWidth,ghoster:{}})},onAfterResize:function(d){this.__cache.windowHeight=b(window).height();this.__cache.containerHeight=b(this.container).outerHeight(true)},resizeContainer:function(f){var d=this.columnWidth+this.gutterWidth;var e=this.container.parent().width();var g=Math.floor(e/d);if(this.__cache.cols!==g){this.container.width(g*d)}},onMonthSelectorClick:function(d){d.preventDefault();this.months_popover.show()},onYearNavigationClick:function(g){g.preventDefault();var f=b(g.currentTarget),d=f.closest(".year");if(f.hasClass("next_year")&&d.prev().length>0){d.hide();d.prev().show()}else{if(f.hasClass("previous_year")&&d.next().length>0){d.hide();d.next().show()}}},onBackToTopClick:function(d){d.preventDefault();b("body,html").animate({scrollTop:0},200,_.bind(this.onWindowScroll,this))},onFirstWindowLoad:function(d){this.container.children("section, header").show()},onWindowLoad:function(){this.loading=false;this.loader.stop();b(".loading").removeClass("loading");this.resizeContainer();this.updateLayout();var d=b("header.heading .date");this.__cache.heading=this.__cache.heading.concat(_.map(d,function(f){var e=b(f);return{top:e.offset().top-120,month:e.text()}}));_.sortBy(this.__cache.heading,function(e){return e.top});this.__cache.containerHeight=b(this.container).outerHeight(true);this.__cache.windowHeight=b(window).height();if(this.__cache.containerHeight<this.__cache.windowHeight){this.loadPosts()}},onWindowResize:function(f,d){this.resizeContainer(d)},onWindowScroll:function(j,f){var h=f.scrollTop||0;var l=f.windowHeight||0;var g=this.__cache.containerHeight;var k=(g-l*2);for(var d=this.__cache.heading.length-1;d>=0;d--){if(h>this.__cache.heading[d].top){if(this.__cache.currentMonth==this.__cache.heading[d].month){}else{this.__cache.currentMonth=this.__cache.heading[d].month;this.month_selector.text(this.__cache.currentMonth)}break}}if(!this.loading){if(h>=k){this.loadPosts()}}}});b(function(){new c()})})(jQuery,Tumblr);
/*! scripts/archive/archive.js */
