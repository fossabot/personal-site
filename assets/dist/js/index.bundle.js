webpackJsonp([1],{

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function($) {\n\n/* contact form */\nvar URL = 'https://3381kqxhs7.execute-api.us-west-2.amazonaws.com/Production/message';\n\n$('#contact-form').submit(function (event) {\n  event.preventDefault();\n\n  var data = {\n    name: $('#name-input').val(),\n    email: $('#email-input').val(),\n    description: $('#description-input').val()\n  };\n\n  $.ajax({\n    type: 'POST',\n    url: URL,\n    dataType: 'json',\n    contentType: 'application/json',\n    data: JSON.stringify(data),\n    success: function success() {\n      alert('success');\n    },\n    error: function error() {\n      alert('fail');\n      console.log(data);\n    }\n  });\n});\n\n/* header animation */\nfunction LogoBaffleOut() {\n  var b = baffle('#logo').start().set({\n    characters: '░█▓ ▓▒░<>/',\n    speed: 60\n  }).text(function (currentText) {\n    return \"Jared Dillard\";\n  });\n\n  setTimeout(function () {\n    b.reveal(500);\n  }, 500);\n}\n\nfunction LogoBaffleIn() {\n  var names = ['farmer of bits', 'web developer'];\n  var b = baffle('#logo').start().set({\n    characters: '░█▓ ▓▒░<>/',\n    speed: 60\n  }).text(function (currentText) {\n    return names[Math.floor(Math.random() * names.length)];\n  });\n\n  setTimeout(function () {\n    b.reveal(500);\n  }, 500);\n}\n\nwindow.onload = function () {\n  LogoBaffleOut();\n};\n\ndocument.getElementById('logo').onmouseover = function () {\n  LogoBaffleIn();\n};\ndocument.getElementById('logo').onmouseleave = function () {\n  LogoBaffleOut();\n};\n\n/* parallax on blog posts with cover image */\nvar parallaxImage = document.getElementById('ParallaxImage');\nvar windowScrolled;\n\nwindow.addEventListener('scroll', function windowScroll() {\n  windowScrolled = window.pageYOffset || document.documentElement.scrollTop;\n  parallaxImage.style.transform = 'translate3d(0, ' + windowScrolled / 4 + 'px, 0)';\n});\n/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvanMvaW5kZXguanM/ZTIxNSJdLCJuYW1lcyI6WyJVUkwiLCIkIiwic3VibWl0IiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImRhdGEiLCJuYW1lIiwidmFsIiwiZW1haWwiLCJkZXNjcmlwdGlvbiIsImFqYXgiLCJ0eXBlIiwidXJsIiwiZGF0YVR5cGUiLCJjb250ZW50VHlwZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJzdWNjZXNzIiwiYWxlcnQiLCJlcnJvciIsImNvbnNvbGUiLCJsb2ciLCJMb2dvQmFmZmxlT3V0IiwiYiIsImJhZmZsZSIsInN0YXJ0Iiwic2V0IiwiY2hhcmFjdGVycyIsInNwZWVkIiwidGV4dCIsInNldFRpbWVvdXQiLCJyZXZlYWwiLCJMb2dvQmFmZmxlSW4iLCJuYW1lcyIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImxlbmd0aCIsIndpbmRvdyIsIm9ubG9hZCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJvbm1vdXNlb3ZlciIsIm9ubW91c2VsZWF2ZSIsInBhcmFsbGF4SW1hZ2UiLCJ3aW5kb3dTY3JvbGxlZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJ3aW5kb3dTY3JvbGwiLCJwYWdlWU9mZnNldCIsImRvY3VtZW50RWxlbWVudCIsInNjcm9sbFRvcCIsInN0eWxlIiwidHJhbnNmb3JtIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0EsSUFBSUEsTUFBTSwyRUFBVjs7QUFFQUMsRUFBRSxlQUFGLEVBQW1CQyxNQUFuQixDQUEwQixVQUFVQyxLQUFWLEVBQWlCO0FBQ3pDQSxRQUFNQyxjQUFOOztBQUVBLE1BQUlDLE9BQU87QUFDVEMsVUFBTUwsRUFBRSxhQUFGLEVBQWlCTSxHQUFqQixFQURHO0FBRVRDLFdBQU9QLEVBQUUsY0FBRixFQUFrQk0sR0FBbEIsRUFGRTtBQUdURSxpQkFBYVIsRUFBRSxvQkFBRixFQUF3Qk0sR0FBeEI7QUFISixHQUFYOztBQU1BTixJQUFFUyxJQUFGLENBQU87QUFDTEMsVUFBTSxNQUREO0FBRUxDLFNBQUtaLEdBRkE7QUFHTGEsY0FBVSxNQUhMO0FBSUxDLGlCQUFhLGtCQUpSO0FBS0xULFVBQU1VLEtBQUtDLFNBQUwsQ0FBZVgsSUFBZixDQUxEO0FBTUxZLGFBQVMsbUJBQVk7QUFDbkJDLFlBQU0sU0FBTjtBQUNELEtBUkk7QUFTTEMsV0FBTyxpQkFBWTtBQUNqQkQsWUFBTSxNQUFOO0FBQ0FFLGNBQVFDLEdBQVIsQ0FBWWhCLElBQVo7QUFDRDtBQVpJLEdBQVA7QUFjRCxDQXZCRDs7QUF5QkE7QUFDQSxTQUFTaUIsYUFBVCxHQUF5QjtBQUN2QixNQUFJQyxJQUFJQyxPQUFPLE9BQVAsRUFBZ0JDLEtBQWhCLEdBQXdCQyxHQUF4QixDQUE0QjtBQUNsQ0MsZ0JBQVksWUFEc0I7QUFFbENDLFdBQU87QUFGMkIsR0FBNUIsRUFHTEMsSUFISyxDQUdBO0FBQUEsV0FBZSxlQUFmO0FBQUEsR0FIQSxDQUFSOztBQUtBQyxhQUFXLFlBQVk7QUFDckJQLE1BQUVRLE1BQUYsQ0FBUyxHQUFUO0FBQ0QsR0FGRCxFQUVHLEdBRkg7QUFHRDs7QUFFRCxTQUFTQyxZQUFULEdBQXdCO0FBQ3RCLE1BQUlDLFFBQVEsQ0FBQyxnQkFBRCxFQUFtQixlQUFuQixDQUFaO0FBQ0EsTUFBSVYsSUFBSUMsT0FBTyxPQUFQLEVBQWdCQyxLQUFoQixHQUF3QkMsR0FBeEIsQ0FBNEI7QUFDbENDLGdCQUFZLFlBRHNCO0FBRWxDQyxXQUFPO0FBRjJCLEdBQTVCLEVBR0xDLElBSEssQ0FHQTtBQUFBLFdBQWVJLE1BQU1DLEtBQUtDLEtBQUwsQ0FBV0QsS0FBS0UsTUFBTCxLQUFjSCxNQUFNSSxNQUEvQixDQUFOLENBQWY7QUFBQSxHQUhBLENBQVI7O0FBS0FQLGFBQVcsWUFBWTtBQUNyQlAsTUFBRVEsTUFBRixDQUFTLEdBQVQ7QUFDRCxHQUZELEVBRUcsR0FGSDtBQUdEOztBQUVETyxPQUFPQyxNQUFQLEdBQWMsWUFBVTtBQUFDakI7QUFBaUIsQ0FBMUM7O0FBRUFrQixTQUFTQyxjQUFULENBQXdCLE1BQXhCLEVBQWdDQyxXQUFoQyxHQUE0QyxZQUFVO0FBQUNWO0FBQWdCLENBQXZFO0FBQ0FRLFNBQVNDLGNBQVQsQ0FBd0IsTUFBeEIsRUFBZ0NFLFlBQWhDLEdBQTZDLFlBQVU7QUFBQ3JCO0FBQWlCLENBQXpFOztBQUVBO0FBQ0EsSUFBSXNCLGdCQUFnQkosU0FBU0MsY0FBVCxDQUF3QixlQUF4QixDQUFwQjtBQUNBLElBQUlJLGNBQUo7O0FBRUFQLE9BQU9RLGdCQUFQLENBQXdCLFFBQXhCLEVBQWtDLFNBQVNDLFlBQVQsR0FBd0I7QUFDeERGLG1CQUFpQlAsT0FBT1UsV0FBUCxJQUFzQlIsU0FBU1MsZUFBVCxDQUF5QkMsU0FBaEU7QUFDQU4sZ0JBQWNPLEtBQWQsQ0FBb0JDLFNBQXBCLEdBQWdDLG9CQUFvQlAsaUJBQWlCLENBQXJDLEdBQXlDLFFBQXpFO0FBQ0QsQ0FIRCxFIiwiZmlsZSI6IjQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBjb250YWN0IGZvcm0gKi9cbnZhciBVUkwgPSAnaHR0cHM6Ly8zMzgxa3F4aHM3LmV4ZWN1dGUtYXBpLnVzLXdlc3QtMi5hbWF6b25hd3MuY29tL1Byb2R1Y3Rpb24vbWVzc2FnZSdcblxuJCgnI2NvbnRhY3QtZm9ybScpLnN1Ym1pdChmdW5jdGlvbiAoZXZlbnQpIHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG4gIHZhciBkYXRhID0ge1xuICAgIG5hbWU6ICQoJyNuYW1lLWlucHV0JykudmFsKCksXG4gICAgZW1haWw6ICQoJyNlbWFpbC1pbnB1dCcpLnZhbCgpLFxuICAgIGRlc2NyaXB0aW9uOiAkKCcjZGVzY3JpcHRpb24taW5wdXQnKS52YWwoKVxuICB9XG5cbiAgJC5hamF4KHtcbiAgICB0eXBlOiAnUE9TVCcsXG4gICAgdXJsOiBVUkwsXG4gICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGFsZXJ0KCdzdWNjZXNzJyk7XG4gICAgfSxcbiAgICBlcnJvcjogZnVuY3Rpb24gKCkge1xuICAgICAgYWxlcnQoJ2ZhaWwnKTtcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgIH1cbiAgfSlcbn0pXG5cbi8qIGhlYWRlciBhbmltYXRpb24gKi9cbmZ1bmN0aW9uIExvZ29CYWZmbGVPdXQoKSB7XG4gIHZhciBiID0gYmFmZmxlKCcjbG9nbycpLnN0YXJ0KCkuc2V0KHtcbiAgICBjaGFyYWN0ZXJzOiAn4paR4paI4paTIOKWk+KWkuKWkTw+LycsXG4gICAgc3BlZWQ6IDYwXG4gIH0pLnRleHQoY3VycmVudFRleHQgPT4gXCJKYXJlZCBEaWxsYXJkXCIpO1xuXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIGIucmV2ZWFsKDUwMCk7XG4gIH0sIDUwMCk7XG59XG5cbmZ1bmN0aW9uIExvZ29CYWZmbGVJbigpIHtcbiAgdmFyIG5hbWVzID0gWydmYXJtZXIgb2YgYml0cycsICd3ZWIgZGV2ZWxvcGVyJ107XG4gIHZhciBiID0gYmFmZmxlKCcjbG9nbycpLnN0YXJ0KCkuc2V0KHtcbiAgICBjaGFyYWN0ZXJzOiAn4paR4paI4paTIOKWk+KWkuKWkTw+LycsXG4gICAgc3BlZWQ6IDYwXG4gIH0pLnRleHQoY3VycmVudFRleHQgPT4gbmFtZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKm5hbWVzLmxlbmd0aCldKTtcblxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICBiLnJldmVhbCg1MDApO1xuICB9LCA1MDApO1xufVxuXG53aW5kb3cub25sb2FkPWZ1bmN0aW9uKCl7TG9nb0JhZmZsZU91dCgpO307XG5cbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2dvJykub25tb3VzZW92ZXI9ZnVuY3Rpb24oKXtMb2dvQmFmZmxlSW4oKTt9O1xuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvZ28nKS5vbm1vdXNlbGVhdmU9ZnVuY3Rpb24oKXtMb2dvQmFmZmxlT3V0KCk7fTtcblxuLyogcGFyYWxsYXggb24gYmxvZyBwb3N0cyB3aXRoIGNvdmVyIGltYWdlICovXG52YXIgcGFyYWxsYXhJbWFnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdQYXJhbGxheEltYWdlJyk7XG52YXIgd2luZG93U2Nyb2xsZWQ7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBmdW5jdGlvbiB3aW5kb3dTY3JvbGwoKSB7XG4gIHdpbmRvd1Njcm9sbGVkID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XG4gIHBhcmFsbGF4SW1hZ2Uuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZTNkKDAsICcgKyB3aW5kb3dTY3JvbGxlZCAvIDQgKyAncHgsIDApJztcbn0pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYXNzZXRzL2pzL2luZGV4LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///4\n");

/***/ })

},[4]);