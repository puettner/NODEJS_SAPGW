/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2014 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
jQuery.sap.declare("sap.m.Carousel");jQuery.sap.require("sap.m.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.m.Carousel",{metadata:{publicMethods:["next","previous"],library:"sap.m",properties:{"height":{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'100%'},"width":{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'100%'},"loop":{type:"boolean",group:"Misc",defaultValue:false},"visible":{type:"boolean",group:"Appearance",defaultValue:true},"showPageIndicator":{type:"boolean",group:"Appearance",defaultValue:true},"pageIndicatorPlacement":{type:"sap.m.PlacementType",group:"Appearance",defaultValue:sap.m.PlacementType.Bottom},"showBusyIndicator":{type:"boolean",group:"Appearance",defaultValue:true,deprecated:true},"busyIndicatorSize":{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'6em',deprecated:true}},defaultAggregation:"pages",aggregations:{"pages":{type:"sap.ui.core.Control",multiple:true,singularName:"page"}},associations:{"activePage":{type:"sap.ui.core.Control",multiple:false}},events:{"loadPage":{deprecated:true},"unloadPage":{deprecated:true},"pageChanged":{}}}});sap.m.Carousel.M_EVENTS={'loadPage':'loadPage','unloadPage':'unloadPage','pageChanged':'pageChanged'};jQuery.sap.require("sap.ui.thirdparty.mobify-carousel");sap.m.Carousel._INNER_SELECTOR=".sapMCrslInner";sap.m.Carousel._PAGE_INDICATOR_SELECTOR=".sapMCrslBulleted";sap.m.Carousel._HUD_SELECTOR=".sapMCrslHud";sap.m.Carousel._ITEM_SELECTOR=".sapMCrslItem";sap.m.Carousel._LEFTMOST_CLASS="sapMCrslLeftmost";sap.m.Carousel._RIGHTMOST_CLASS="sapMCrslRightmost";sap.m.Carousel._LATERAL_CLASSES="sapMCrslLeftmost sapMCrslRightmost";sap.m.Carousel._bIE9=(sap.ui.Device.browser.internet_explorer&&sap.ui.Device.browser.version<10);
sap.m.Carousel.prototype.init=function(){this._aScrollContainers=[];this._fnAdjustAfterResize=jQuery.proxy(function(){var $=this.$().find(sap.m.Carousel._INNER_SELECTOR);this._oMobifyCarousel.resize($)},this)};
sap.m.Carousel.prototype.exit=function(){if(this._oMobifyCarousel){this._oMobifyCarousel.destroy();delete this._oMobifyCarousel}if(this._oArrowLeft){this._oArrowLeft.destroy();delete this._oArrowLeft}if(this._oArrowRight){this._oArrowRight.destroy();delete this._oArrowRight}if(this._sResizeListenerId){sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);this._sResizeListenerId=null}this.$().off('afterSlide');this._cleanUpScrollContainer();this._fnAdjustAfterResize=null;this._aScrollContainers=null;if(!sap.m.Carousel._bIE9&&this._$InnerDiv){jQuery(window).off("resize",this._fnAdjustAfterResize)}this._$InnerDiv=null};
sap.m.Carousel.prototype._cleanUpScrollContainer=function(){var s;while(this.length>0){s=this._aScrollContainers.pop();s.removeAllContent();if(s&&typeof s.destroy==='function'){s.destroy()}}};
sap.m.Carousel.prototype.onBeforeRendering=function(){var a=this.getActivePage();if(!a&&this.getPages().length>0){this.setAssociation("activePage",this.getPages()[0].getId(),true)}if(this._sResizeListenerId){sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);this._sResizeListenerId=null}if(!sap.m.Carousel._bIE9&&this._$InnerDiv){jQuery(window).off("resize",this._fnAdjustAfterResize)}return this};
sap.m.Carousel.prototype.onAfterRendering=function(){if(this._oMobifyCarousel){this._oMobifyCarousel.destroy()}this.$().carousel();this._oMobifyCarousel=this.getDomRef()._carousel;this._oMobifyCarousel.setLoop(this.getLoop());this._oMobifyCarousel.setRTL(sap.ui.getCore().getConfiguration().getRTL());var a=this.getActivePage();if(a){var i=this._getPageNumber(a);if(isNaN(i)){if(this.getPages().length>0){this.setAssociation("activePage",this.getPages()[0].getId(),true)}}else{this._oMobifyCarousel.changeAnimation('sapMCrslNoTransition');this._oMobifyCarousel.move(i+1)}}this._fnAdjustHUDVisibility(a?(this._getPageNumber(a)+1):1);this.$().on('afterSlide',jQuery.proxy(function(e,p,n){if(n>0){this._fnAdjustHUDVisibility(n);var o=this.getActivePage();var N=this.getPages()[n-1].getId();this.setAssociation("activePage",N,true);jQuery.sap.log.debug("sap.m.Carousel: firing pageChanged event: old page: "+o+", new page: "+N);this.firePageChanged({oldActivePageId:o,newActivePageId:N})}},this));this._$InnerDiv=this.$().find(sap.m.Carousel._INNER_SELECTOR)[0];if(sap.m.Carousel._bIE9){this._sResizeListenerId=sap.ui.core.ResizeHandler.register(this._$InnerDiv,this._fnAdjustAfterResize)}else{jQuery(window).on("resize",this._fnAdjustAfterResize)}};
sap.m.Carousel.prototype._fnAdjustHUDVisibility=function(n){if(sap.ui.Device.system.desktop&&!this.getLoop()&&this.getPages().length>1){var h=this.$().find(sap.m.Carousel._HUD_SELECTOR);h.removeClass(sap.m.Carousel._LATERAL_CLASSES);if(n===1){h.addClass(sap.m.Carousel._LEFTMOST_CLASS)}else if(n===this.getPages().length){h.addClass(sap.m.Carousel._RIGHTMOST_CLASS)}}};
sap.m.Carousel.prototype.onsaptabprevious=function(e){this._bTabPrevious=true};
sap.m.Carousel.prototype.onsaptabnext=function(e){this._bTabNext=true};
sap.m.Carousel.prototype.onfocusin=function(e){if(sap.ui.Device.system.desktop){var s=e.target,p=s.getAttribute('pageIndex'),n,N;if(s.className==='sapMCrslFirstFE'&&this._bTabPrevious){if(p>0){p--}else if(this.getLoop()){p=this.getPages().length-1}N=this.getPages()[p];n=N.$().parent().lastFocusableDomRef()}else if(s.className==='sapMCrslLastFE'&&this._bTabNext){if(p<this.getPages().length-1){p++}else if(this.getLoop()){p=0}N=this.getPages()[p];n=N.$().parent().firstFocusableDomRef()}if(n&&N){var r=function(){n.focus()};this._oMobifyCarousel.changeAnimation('',r,this);this.setActivePage(N.getId())}this._bTabPrevious=false;this._bTabNext=false}};
sap.m.Carousel.prototype.setActivePage=function(p){var P=null,h=false;if(typeof(p)=='string'){P=p}else if(p instanceof sap.ui.core.Control){P=p.getId()}if(P){if(this._oMobifyCarousel){var i=this._getPageNumber(P);if(!isNaN(i)){this._oMobifyCarousel.move(i+1);h=true}}}if(h||!this._oMobifyCarousel){this.setAssociation("activePage",P,true)}else{jQuery.sap.log.warning("sap.m.Carousel.prototype.setActivePage: Cannot set active page "+"because it is neither of type 'string' nor a 'sap.ui.core.Control'")}return this};
sap.m.Carousel.prototype.setHeight=function(h){this.setProperty("height",h,true);this.$().css("height",h);return this};
sap.m.Carousel.prototype.setWidth=function(w){this.setProperty("width",w,true);this.$().css("width",w);return this};
sap.m.Carousel.prototype.setPageIndicatorPlacement=function(p){if(sap.m.PlacementType.Top!=p&&sap.m.PlacementType.Bottom!=p){p=sap.m.PlacementType.Bottom}this.setProperty("pageIndicatorPlacement",p,true);var P=this.$().find(sap.m.Carousel._PAGE_INDICATOR_SELECTOR);if(sap.m.PlacementType.Top===p){this.$().prepend(P);P.removeClass('sapMCrslBottomOffset');this.$().find(sap.m.Carousel._ITEM_SELECTOR).removeClass('sapMCrslBottomOffset')}else{this.$().append(P);P.addClass('sapMCrslBottomOffset');this.$().find(sap.m.Carousel._ITEM_SELECTOR).addClass('sapMCrslBottomOffset')}return this};
sap.m.Carousel.prototype.setShowPageIndicator=function(s){var p=this.$().find(sap.m.Carousel._PAGE_INDICATOR_SELECTOR);s?p.show():p.hide();this.setProperty("showPageIndicator",s,true);return this};
sap.m.Carousel.prototype.setLoop=function(l){this.setProperty("loop",l,true);if(this._oMobifyCarousel){this._oMobifyCarousel.setLoop(l)}return this};
sap.m.Carousel.prototype._getNavigationArrow=function(n){jQuery.sap.require("sap.ui.core.IconPool");var p={src:"sap-icon://navigation-"+n+"-arrow"};if(n==="left"){if(!this._oArrowLeft){this._oArrowLeft=sap.m.ImageHelper.getImageControl(this.getId()+"-arrowScrollLeft",this._oArrowLeft,this,p)}return this._oArrowLeft}else if(n==="right"){if(!this._oArrowRight){this._oArrowRight=sap.m.ImageHelper.getImageControl(this.getId()+"-arrowScrollRight",this._oArrowRight,this,p)}return this._oArrowRight}};
sap.m.Carousel.prototype._createScrollContainer=function(p){var c=p instanceof sap.m.Image?"sapMCrslItemTableCell sapMCrslImg":"sapMCrslItemTableCell",C=new sap.ui.core.HTML({content:"<div class='sapMCrslItemTable'>"+"<div class='"+c+"'></div>"+"</div>",afterRendering:function(e){var r=sap.ui.getCore().createRenderManager();r.render(p,this.getDomRef().firstChild);r.destroy()}});var s=new sap.m.ScrollContainer({horizontal:false,vertical:false,content:[C],width:'100%',height:'100%',});s.setParent(this,null,true);this._aScrollContainers.push(s);return s};
sap.m.Carousel.prototype.previous=function(){if(this._oMobifyCarousel){this._oMobifyCarousel.prev()}else{jQuery.sap.log.warning("Unable to execute sap.m.Carousel.previous: carousel must be rendered first.")}return this};
sap.m.Carousel.prototype.next=function(){if(this._oMobifyCarousel){this._oMobifyCarousel.next()}else{jQuery.sap.log.warning("Unable to execute sap.m.Carousel.next: carousel must be rendered first.")}return this};
sap.m.Carousel.prototype._getPageNumber=function(p){var i,r;for(i=0;i<this.getPages().length;i++){if(this.getPages()[i].getId()==p){r=i;break}}return r};
sap.m.Carousel.prototype.setShowBusyIndicator=function(){jQuery.sap.log.warning("sap.m.Carousel: Deprecated function 'setShowBusyIndicator' called. "+"Does nothing.");return this};
sap.m.Carousel.prototype.getShowBusyIndicator=function(){jQuery.sap.log.warning("sap.m.Carousel: Deprecated function 'getShowBusyIndicator' called. "+"Does nothing.");return false};
sap.m.Carousel.prototype.setBusyIndicatorSize=function(){jQuery.sap.log.warning("sap.m.Carousel: Deprecated function 'setBusyIndicatorSize' called. "+"Does nothing.");return this};
sap.m.Carousel.prototype.getBusyIndicatorSize=function(){jQuery.sap.log.warning("sap.m.Carousel: Deprecated function 'getBusyIndicatorSize' called. "+"Does nothing.");return""};
