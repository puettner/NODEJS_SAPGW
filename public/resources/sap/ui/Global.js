/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2014 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
if(window.OpenAjax&&window.OpenAjax.hub){OpenAjax.hub.registerLibrary("sap","http://www.sap.com/","0.1",{})}sap.ui.define(['jquery.sap.global','jquery.sap.dom'],function(q){"use strict";if(typeof window.sap!=="object"&&typeof window.sap!=="function"){window.sap={}}if(typeof window.sap.ui!=="object"){window.sap.ui={}}sap.ui=q.extend(sap.ui,{version:"1.20.4",buildinfo:{lastchange:"${ldi.scm.revision}",buildtime:"20140423-1633"}});sap.ui.namespace=function(n){return q.sap.getObject(n,0)};sap.ui.lazyRequire=function(c,m,M){var f=c.replace(/\//gi,"\."),l=f.lastIndexOf("."),p=f.substr(0,l),C=f.substr(l+1),P=q.sap.getObject(p,0),o=P[C],a=(m||"new").split(" "),b=q.inArray("new",a);M=M||f;if(!o){if(b>=0){o=function(){q.sap.log.debug("lazy stub for '"+f+"' (constructor) called.");q.sap.require(M);var r=P[C];if(r._sapUiLazyLoader){throw new Error("lazyRequire: stub '"+f+"'has not been replaced by module '"+M+"'")}var i=q.sap.newObject(r.prototype);var R=r.apply(i,arguments);if(R&&(typeof R==="function"||typeof R==="object")){i=R}return i};o._sapUiLazyLoader=true;a.splice(b,1)}else{o={}}P[C]=o}q.each(a,function(i,s){if(!o[s]){o[s]=function(){q.sap.log.debug("lazy stub for '"+f+"."+s+"' called.");q.sap.require(M);var r=P[C];if(r[s]._sapUiLazyLoader){throw new Error("lazyRequire: stub '"+f+"."+s+"' has not been replaced by loaded module '"+M+"'")}return r[s].apply(r,arguments)};o[s]._sapUiLazyLoader=true}})};sap.ui.resource=function(l,r){var m=r.match(/^themes\/([^\/]+)\//);if(m){l+=".themes."+m[1];r=r.substr(m[0].length)}return q.sap.getModulePath(l,'/')+r};sap.ui.localResources=function(n){q.sap.registerModulePath(n,"./"+n.replace(/\./g,"/"))};return sap.ui},true);
