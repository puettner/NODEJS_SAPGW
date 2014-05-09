/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2014 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
jQuery.sap.declare("sap.ui.commons.Toolbar");jQuery.sap.require("sap.ui.commons.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.ui.commons.Toolbar",{metadata:{library:"sap.ui.commons",properties:{"visible":{type:"boolean",group:"Behavior",defaultValue:true},"width":{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'auto'},"design":{type:"sap.ui.commons.ToolbarDesign",group:"Appearance",defaultValue:sap.ui.commons.ToolbarDesign.Flat},"standalone":{type:"boolean",group:"Appearance",defaultValue:true}},defaultAggregation:"items",aggregations:{"items":{type:"sap.ui.commons.ToolbarItem",multiple:true,singularName:"item"},"rightItems":{type:"sap.ui.commons.ToolbarItem",multiple:true,singularName:"rightItem"}}}});jQuery.sap.require("sap.ui.core.delegate.ItemNavigation");jQuery.sap.require("sap.ui.core.Popup");
sap.ui.commons.Toolbar.prototype.init=function(){this.bOpen=false;this.oDomRef=null;this.oInnerRef=null;this.oOverflowDomRef=null;this.bHasRightItems=false;this.bRtl=sap.ui.getCore().getConfiguration().getRTL();this._detectVisibleItemCountChangeTimer=null;var t=this;this.oItemDelegate={onAfterRendering:jQuery.proxy(t._itemRendered,t)}};
sap.ui.commons.Toolbar.prototype.onBeforeRendering=function(){sap.ui.commons.ToolbarRenderer.emptyOverflowPopup(this);this.cleanup();this.$("mn").unbind("keyup",this._handleKeyUp);this.bFirstTime=true};
sap.ui.commons.Toolbar.prototype.onAfterRendering=function(){this.oDomRef=this.getDomRef();this.oInnerRef=this.oDomRef.firstChild.firstChild;jQuery(this.oInnerRef).css("visibility","visible");var o=this.getId()+"-mn";this.oOverflowDomRef=jQuery.sap.domById(o);if(!this.oItemNavigation){this.oItemNavigation=new sap.ui.core.delegate.ItemNavigation();this.addDelegate(this.oItemNavigation)}this.$("mn").bind("keyup",jQuery.proxy(this._handleKeyUp,this));this.sResizeListenerId=sap.ui.core.ResizeHandler.register(this.oDomRef,jQuery.proxy(this.ontoolbarresize,this));var r=this.getRightItems().length;this.bHasRightItems=r>0;if(this.bHasRightItems){this.sRightSideResizeListenerId=sap.ui.core.ResizeHandler.register(this.oDomRef.lastChild,jQuery.proxy(this.onrightsideresize,this));this.updateAfterResize(true);this._observeVisibleItemCountChange(40)}else{this.updateAfterResize(true);this._observeVisibleItemCountChange(350)}};
sap.ui.commons.Toolbar.prototype._handleKeyUp=function(e){if((e.keyCode==jQuery.sap.KeyCodes.SPACE)&&(e.target.id===this.getId()+"-mn")){this.handleOverflowButtonTriggered();e.preventDefault();e.stopPropagation()}};
sap.ui.commons.Toolbar.prototype.exit=function(){this.cleanup();if(this.oItemNavigation){this.removeDelegate(this.oItemNavigation);this.oItemNavigation.destroy();delete this.oItemNavigation}this.oItemDelegate=undefined;jQuery(window).unbind("resize",this.onwindowresize)};
sap.ui.commons.Toolbar.prototype.updateAfterResize=function(c){var v=this.getVisibleItemInfo();this._oLastVisibleItem=v.oLastVisibleItem;this._oFirstInvisibleItem=v.oFirstInvisibleItem;this._iLastVisibleItemTop=v.iLastVisibleItemTop;this.updateItemNavigation(v.iAllItemsBeforeBreak,c);this.updateOverflowIcon(v.bOverflow);if(this.sUpdateItemNavigationTimer){jQuery.sap.clearDelayedCall(this.sUpdateItemNavigationTimer);this.sUpdateItemNavigationTimer=null}};
sap.ui.commons.Toolbar.prototype._detectVisibleItemCountChange=function(){if(!this.getDomRef()){if(this._detectVisibleItemCountChangeTimer){jQuery.sap.clearDelayedCall(this._detectVisibleItemCountChangeTimer);this._detectVisibleItemCountChangeTimer=null}return}if(this._oLastVisibleItem&&this._oFirstInvisibleItem){var l=this._oLastVisibleItem.offsetLeft;var f=this._oFirstInvisibleItem.offsetLeft;var a=this._oLastVisibleItem.offsetTop;var i=this.bRtl?(f<l):(f>l);if((a!=this._iLastVisibleItemTop)||(!this.bOpen&&i)){if(this.bOpen){this.closePopup(true)}this.updateAfterResize(false)}}else if(this._oLastVisibleItem&&!this._oFirstInvisibleItem){if(this._oLastVisibleItem.offsetTop!=this._iLastVisibleItemTop){this.updateAfterResize(false)}}else if(!this._oLastVisibleItem&&!this._oFirstInvisibleItem){}else{}this._observeVisibleItemCountChange(350);if(this.bFirstTime&&this.bHasRightItems){this.onrightsideresize();this.bFirstTime=false}};
sap.ui.commons.Toolbar.prototype._observeVisibleItemCountChange=function(i){this._detectVisibleItemCountChangeTimer=jQuery.sap.delayedCall(i,this,"_detectVisibleItemCountChange")};
sap.ui.commons.Toolbar.prototype.updateItemNavigation=function(a,c){this.oItemNavigation.setRootDomRef(this.oDomRef);var I=[];var l=this.getItems();for(var i=0;i<a;i++){var d=l[i].getFocusDomRef();if(d){I.push(d)}}I.push(this.oOverflowDomRef);this.iLeftItemDomRefCount=I.length;var r=this.getRightItems();for(var i=0;i<r.length;i++){var d=r[i].getFocusDomRef();if(d){I.push(d)}}this.oItemNavigation.setItemDomRefs(I);this.iItemDomRefCount=I.length;if(c){for(var i=a;i<l.length;i++){var d=l[i].getFocusDomRef();var $=jQuery(d);if(d&&($.attr("tabindex")=="0")){$.attr("tabIndex",-1)}}for(var i=0;i<r.length;i++){var d=r[i].getFocusDomRef();var $=jQuery(d);if(d&&($.attr("tabindex")=="0")){$.attr("tabIndex",-1)}}}};
sap.ui.commons.Toolbar.prototype.getVisibleItemInfo=function(){var v=0;if(this.oInnerRef){var e=this.oInnerRef.childNodes;this.bRtl=sap.ui.getCore().getConfiguration().getRTL();var o=this.getId()+"-mn";var l,E,c=0,a,b,d=0,L=null,f=null,g,A=0,O=false;for(var i=1,h=e.length;i<h;i++){E=e[i];a=E.offsetLeft;if(i==1){b=e[0].offsetWidth;d=e[0].offsetLeft}if(this.bRtl){c=E.offsetWidth;l=(a+c>=d+b)}else{l=(a<=d)&&(E.offsetTop>e[0].offsetTop)}if(l){v=i;L=e[i-1];f=E;g=L.offsetTop;O=true;break}else if(E.id==o){v=i;L=e[i-1];f=null;g=L.offsetTop;O=false;break}else{d=a;b=c}}var j=this.getItems();var k=j.length;for(var i=0;i<k;i++){if(j[i].getDomRef()===L){A=i+1;break}}}return{"count":v,"oLastVisibleItem":L,"oFirstInvisibleItem":f,"iLastVisibleItemTop":g,"iAllItemsBeforeBreak":A,"bOverflow":O}};
sap.ui.commons.Toolbar.prototype.updateOverflowIcon=function(o){this.oOverflowDomRef.style.display=o||this.bOpen?"block":"none"};
sap.ui.commons.Toolbar.prototype.onclick=function(e){if(e.target.id===this.getId()+"-mn"){this.handleOverflowButtonTriggered();e.preventDefault();e.stopPropagation()}};
sap.ui.commons.Toolbar.prototype.onsapdown=function(e){if(e.target.id===this.getId()+"-mn"){if(!this.bOpen){this.handleOverflowButtonTriggered();e.preventDefault();e.stopImmediatePropagation()}}};
sap.ui.commons.Toolbar.prototype.onsapup=function(e){if(e.target.id===this.getId()+"-mn"){if(this.bOpen){this.handleOverflowButtonTriggered();e.preventDefault();e.stopPropagation()}}};
sap.ui.commons.Toolbar.prototype.handleOverflowButtonTriggered=function(){if(!this.bPopupInitialized){this.popup=new sap.ui.core.Popup(new sap.ui.commons.ToolbarOverflowPopup(this),false,true,true);this.bPopupInitialized=true}if(this.bOpen){this.closePopup(false)}else{this.openPopup()}};
sap.ui.commons.Toolbar.prototype.openPopup=function(){this.getRenderer().setActive(this);sap.ui.commons.ToolbarRenderer.fillOverflowPopup(this);this.popup.attachEvent("opened",this.handlePopupOpened,this);this.popup.attachEvent("closed",this.handlePopupClosed,this);jQuery(window).bind("resize",jQuery.proxy(this.onwindowresize,this));var d=!!sap.ui.Device.browser.internet_explorer&&(sap.ui.Device.browser.version==7||sap.ui.Device.browser.version==8)?1:0;this.popup.open(d,sap.ui.core.Popup.Dock.EndTop,sap.ui.core.Popup.Dock.EndBottom,this.$("mn"));this.bOpen=true};
sap.ui.commons.Toolbar.prototype.handlePopupOpened=function(){var a=this.getItems();var I=a.length;var A=this.getVisibleItemInfo().iAllItemsBeforeBreak;var n=[];for(var i=A;i<I;i++){var d=a[i].getFocusDomRef();if(d){n.push(d)}}this.popup.getContent().initItemNavigation(n)};
sap.ui.commons.Toolbar.prototype.closePopup=function(r){this._bResetFocus=r;this.popup.close();jQuery(window).unbind("resize",this.onwindowresize)};
sap.ui.commons.Toolbar.prototype.handlePopupClosed=function(){this.getRenderer().unsetActive(this);this.bOpen=false;sap.ui.commons.ToolbarRenderer.emptyOverflowPopup(this);var a=this.getVisibleItemInfo().iAllItemsBeforeBreak;this.updateItemNavigation(a,true);if(this._bResetFocus){this.oItemNavigation.focusItem(this.iLeftItemDomRefCount-1)}this._bResetFocus=false};
sap.ui.commons.Toolbar.prototype.prepareFocusInfoRedirect=function(c){if(c&&!c._orig_getFocusInfo){var i=this.getId();c._orig_getFocusInfo=c.getFocusInfo;c.getFocusInfo=function(){return{id:i,childInfo:this._orig_getFocusInfo()}};var t=this;c._orig_applyFocusInfo=c.applyFocusInfo;c.applyFocusInfo=function(f){return t.applyFocusInfo(f.childInfo)}}return c};
sap.ui.commons.Toolbar.prototype.cleanupFocusInfoRedirect=function(c){if(c){c.getFocusInfo=c._orig_getFocusInfo;delete c._orig_getFocusInfo;delete c._orig_applyFocusInfo}return c};
sap.ui.commons.Toolbar.prototype.insertItem=function(i,I){this.insertAggregation("items",this.prepareFocusInfoRedirect(i),I);i.addDelegate(this.oItemDelegate);return this};
sap.ui.commons.Toolbar.prototype.addItem=function(i){this.addAggregation("items",this.prepareFocusInfoRedirect(i));i.addDelegate(this.oItemDelegate);return this};
sap.ui.commons.Toolbar.prototype.removeItem=function(e){var t=this.removeAggregation("items",e);t.removeDelegate(this.oItemDelegate);return this.cleanupFocusInfoRedirect(t)};
sap.ui.commons.Toolbar.prototype.removeAllItems=function(){var t=this.removeAllAggregation("items");for(var i=0,l=t.length;i<l;i++){t[i]=this.cleanupFocusInfoRedirect(t[i]);t[i].removeDelegate(this.oItemDelegate)}return t};
sap.ui.commons.Toolbar.prototype.insertRightItem=function(i,I){this.insertAggregation("rightItems",this.prepareFocusInfoRedirect(i),I);i.addDelegate(this.oItemDelegate);return this};
sap.ui.commons.Toolbar.prototype.addRightItem=function(i){this.addAggregation("rightItems",this.prepareFocusInfoRedirect(i));i.addDelegate(this.oItemDelegate);return this};
sap.ui.commons.Toolbar.prototype.removeRightItem=function(e){var t=this.removeAggregation("rightItems",e);t.removeDelegate(this.oItemDelegate);return this.cleanupFocusInfoRedirect(t)};
sap.ui.commons.Toolbar.prototype.removeAllRightItems=function(){var t=this.removeAllAggregation("rightItems");for(var i=0,l=t.length;i<l;i++){t[i]=this.cleanupFocusInfoRedirect(t[i]);t[i].removeDelegate(this.oItemDelegate)}return t};
sap.ui.commons.Toolbar.prototype.getFocusInfo=function(){var i=this.getId();if(this.bOpen){return{id:i,childId:i}}else{return{id:i}}};
sap.ui.commons.Toolbar.prototype.applyFocusInfo=function(f){if(f){var c=f.childId;if(this.bOpen&&c){if(c===this.getId()){return}var C=sap.ui.getCore().getControl(c);var o;if(C&&this.popup&&(o=this.popup.getContent())&&jQuery.sap.containsOrEquals(o.getDomRef(),C.getDomRef())){o.applyFocusInfo(f.childInfo);return}}}this.focus()};
sap.ui.core.Element.extend("sap.ui.commons.ToolbarOverflowPopup",{constructor:function(t){this.oToolbar=t;var i=t.getId()+"-pu";sap.ui.core.Element.call(this,i)},initItemNavigation:function(n){if(!this.oItemNavigation){this.oItemNavigation=new sap.ui.core.delegate.ItemNavigation();this.addDelegate(this.oItemNavigation)}this.oItemNavigation.setRootDomRef(sap.ui.commons.ToolbarRenderer.getPopupArea(this.oToolbar));this.oItemNavigation.setItemDomRefs(n);this.oItemNavigation.focusItem(0)},getDomRef:function(){var p=sap.ui.commons.ToolbarRenderer.getPopupArea(this.oToolbar);if(p){return p.parentNode}else{return null}},isActive:function(){return sap.ui.commons.ToolbarRenderer.getPopupArea(this.oToolbar)!=null},onsapescape:function(e){this.oToolbar.closePopup(true)},onsaptabnext:function(e){this.oToolbar.closePopup(true);e.preventDefault();e.stopPropagation()},onsaptabprevious:function(e){this.oToolbar.closePopup(true);e.preventDefault();e.stopPropagation()}});
sap.ui.commons.Toolbar.prototype._itemRendered=function(){if(this.oItemNavigation){this.updateAfterResize(true)}else{if(!this.sUpdateItemNavigationTimer){this.sUpdateItemNavigationTimer=jQuery.sap.delayedCall(0,this,"updateAfterResize",[true])}}};
sap.ui.commons.Toolbar.prototype.onwindowresize=function(e){if(this.bOpen){this.closePopup(true)}};
sap.ui.commons.Toolbar.prototype.ontoolbarresize=function(e){if(this.bOpen){this.closePopup(true)}};
sap.ui.commons.Toolbar.prototype.onrightsideresize=function(){if(!this.getDomRef()){this.cleanup();return}if(this.getRightItems().length>0){var r=this.oDomRef.lastChild;var R=r.offsetWidth;if(this.bRtl){jQuery(this.oInnerRef).css("margin-left",(R+10)+"px")}else{jQuery(this.oInnerRef).css("margin-right",(R+10)+"px")}var f=this.oDomRef.firstChild.firstChild.firstChild;var o=this.getDomRef("mn").offsetWidth;var m=f.offsetWidth+R+o+20;jQuery(this.oDomRef).css("min-width",m+"px");jQuery(this.oInnerRef).css("visibility","visible")}};
sap.ui.commons.Toolbar.prototype.cleanup=function(){if(this._detectVisibleItemCountChangeTimer){jQuery.sap.clearDelayedCall(this._detectVisibleItemCountChangeTimer);this._detectVisibleItemCountChangeTimer=null}if(this.sUpdateItemNavigationTimer){jQuery.sap.clearDelayedCall(this.sUpdateItemNavigationTimer);this.sUpdateItemNavigationTimer=null}if(this.sResizeListenerId){sap.ui.core.ResizeHandler.deregister(this.sResizeListenerId);this.sResizeListenerId=null}if(this.sRightSideResizeListenerId){sap.ui.core.ResizeHandler.deregister(this.sRightSideResizeListenerId);this.sRightSideResizeListenerId=null}};
