window.everyTime = {};
window.everyTimeHistory = [];
window.everyTime = function(everyTime, everyTimeHistory){
	var aElements = document.querySelectorAll("a");
	for(var i=0;i<aElements.length;i++){
		try {
			if(typeof aElements[i].href !== "undefined" && typeof aElements[i].href === "string" && aElements[i].href.indexOf(window.location.protocol + '//' + window.location.hostname) === 0){
				aElements[i].onclick = function(event){
					var requestedHref = this.href;
					event.preventDefault();
					var xhttp = new XMLHttpRequest();
					var everyTimeLocal = everyTime;
					var everyTimeHistoryLocal = everyTimeHistory;
					xhttp.onreadystatechange = function() {
						if (this.readyState == 4 && this.status == 200) {
							everyTimeHistoryLocal[window.location.href] = {
								"head": document.querySelector("head").innerHTML,
								"body": document.querySelector("body").innerHTML,
								"bodyClasses": document.querySelector("body").className,
								"title": document.querySelector("title").innerHTML
							};
							var start = this.responseText.split("<head")[1];
							start = start.substring(start.indexOf(">")+1);
							document.querySelector("head").innerHTML = start.split("</head>")[0];
							var start = this.responseText.split("<body")[1];
							var endOfTag = start.indexOf(">")+1;
							var classes = start.substring(0, endOfTag);
							var foundChar = false;
							if(classes.indexOf('"') !== -1){
								foundChar = '"';
							} else if (classes.indexOf("'") !== -1){
								foundChar = "'";
							}
							if(foundChar !== false){
								classes = classes.split("class=" + foundChar);
								if(classes.length > 0){
									classes = classes[1].substring(0,classes[1].indexOf(foundChar));
								}else{
									classes = "";
								}
							} else {
								classes = "";
							}
							start = start.substring(endOfTag);
							document.querySelector("body").className = classes;
							document.querySelector("body").innerHTML = start.split("</body>")[0];
							everyTimeHistoryLocal[requestedHref] = {
								"head": document.querySelector("head").innerHTML,
								"body": document.querySelector("body").innerHTML,
								"bodyClasses": document.querySelector("body").className,
								"title": document.querySelector("title").innerHTML
							};
							window.history.pushState(null,null,requestedHref);
							window.scroll(0,0);
							window.everyTime = everyTimeLocal;
							window.eventTimeHistory = everyTimeHistoryLocal;
							window.everyTime(window.everyTime, window.eventTimeHistory);
							setTimeout(function(){
								var evt = document.createEvent('Event');  
								evt.initEvent('load', false, false);  
								window.dispatchEvent(evt);
							}, 100);
						}
					};
					xhttp.open("GET", requestedHref, true);
					xhttp.send();
				}.bind(aElements[i]);
			}
		} catch (e) {
	            debugger;
		}
	}
	window.onpopstate = function(e){
		if(typeof window.everyTimeHistory[window.location.href] !== "undefined") {
			document.querySelector("head").innerHTML = window.everyTimeHistory[window.location.href].head;
			document.querySelector("body").className = window.everyTimeHistory[window.location.href].bodyClasses;
			document.querySelector("body").innerHTML = window.everyTimeHistory[window.location.href].body;
			document.querySelector("title").innerHTML = window.everyTimeHistory[window.location.href].title;
			window.everyTime = this.everyTime;
			window.eventTimeHistory = this.everyTimeHistory;
			window.everyTime(window.everyTime, window.eventTimeHistory);
		}
	}.bind({"everyTime":everyTime,"everyTimeHistory":everyTimeHistory});
};
window.everyTime(window.everyTime,window.everyTimeHistory);
