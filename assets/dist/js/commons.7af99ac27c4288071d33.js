!function(e){function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=349)}({349:function(e,t,n){"use strict";function o(){var e=baffle("#logo").start().set({characters:"░█▓ ▓▒░<>/",speed:60}).text(function(e){return"Jared Dillard"});setTimeout(function(){e.reveal(500)},500)}function r(){var e=["farmer of bits","web developer"],t=baffle("#logo").start().set({characters:"░█▓ ▓▒░<>/",speed:60}).text(function(t){return e[Math.floor(Math.random()*e.length)]});setTimeout(function(){t.reveal(500)},500)}window.onload=function(){o()},document.getElementById("logo").onmouseover=function(){r()},document.getElementById("logo").onmouseleave=function(){o()};var c=document.getElementById("openNav"),l=document.getElementById("closeNav"),a=document.getElementById("sm-nav-container");c.addEventListener("click",function(){a.style.display="block",a.classList.toggle("onscreen")}),l.addEventListener("click",function(){a.style.display="none",a.classList.toggle("onscreen")})}});