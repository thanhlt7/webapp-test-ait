//position contents
function stickContents(){
    var doc = document;
    doc.getElementsByClassName("contents")[0].style.position = 'absolute';
    doc.getElementsByClassName("contents")[0].style.top = 
        doc.getElementById("apps").offsetTop + doc.getElementById("apps").clientHeight + 4;
    doc.getElementsByClassName("contents")[0].style.left = 
        doc.getElementById("apps").offsetLeft;

    doc.getElementsByClassName("appsHistory")[0].style.position = 'absolute';
    doc.getElementsByClassName("appsHistory")[0].style.top = doc.getElementById("apps").offsetTop + 
    doc.getElementById("apps").clientHeight + 420;
    doc.getElementsByClassName("appsHistory")[0].style.left = 
    doc.getElementById("apps").offsetLeft;

}

stickContents();

window.addEventListener('resize', stickContents);

function findApps(){
    document.getElementsByClassName("contents")[0].style.display = "block";
}

document.getElementsByName("apps")[0].onfocus = function(){
    var input = document.getElementsByName("apps")[0].value.trim();
    var result = searchApps(input);
    generateAppsTable(result);
    document.getElementsByClassName("contents")[0].style.display = "block";
}

// Get the element, add a click listener...
document.getElementsByClassName("contents")[0].addEventListener("click", function(e) {
    var lst = document.getElementsByClassName("contents")[0].firstElementChild.children;
    for(var i = 0; i < lst.length; i++){
        lst[i].classList.remove("active");
    }
	if(e.target && e.target.nodeName == "LI") {
        e.target.classList = "active";
    }
    if(e.target && e.target.nodeName == "SPAN"){
        e.target.parentNode.classList = "active";
    }
    if(e.target && e.target.nodeName == "IMG"){
        e.target.parentNode.parentNode.classList = "active";
    }

    document.getElementsByName("apps")[0].value = e.target.innerText;
});

document.getElementsByName("apps")[0].addEventListener("keydown", function(e){
    if (e.keyCode === 40) {       
       document.getElementsByClassName("contents")[0].firstElementChild.children[0].classList
        = "active";
        document.getElementsByClassName("contents")[0].firstElementChild.children[0].focus();
        return false;
    } else if (e.keyCode === 38) {        
        return false;
    }
});

document.getElementsByName("apps")[0].addEventListener("keyup", function(e){
    var input = document.getElementsByName("apps")[0].value.trim();
    if(input[input.length-1] === ","){
       input = input.substr(0, input.length -1);
    }

    var result = searchApps(input.trim());
    generateAppsTable(result);
});

function searchApps(input){
    var result = [];
    var newInput;
    input.indexOf(",") !== -1 ? newInput = input.split(",") : input ;

      if(Array.isArray(newInput)){
          //handle multipe input
        for(var i = 0; i < TABLE_DATA.length; i++){
             if(TABLE_DATA[i].name.indexOf("<") !==-1){
                 TABLE_DATA[i].name = "iTunes";
             }
            for(var j = 0; j < newInput.length; j++){
                if(TABLE_DATA[i].name.toLowerCase().indexOf(newInput[j].trim().toLowerCase()) !== -1){
                    result.push(TABLE_DATA[i]);
                    break;
                }
            }
       }
      }else{
          // handle one input
        for(var i = 0; i < TABLE_DATA.length; i++){
             if(TABLE_DATA[i].name.indexOf("<") !==-1){
                 TABLE_DATA[i].name = "iTunes";
             }
            if(TABLE_DATA[i].name.toLowerCase().indexOf(input.toLowerCase()) !== -1){
                result.push(TABLE_DATA[i]);
            }
         }            
       } 

    return result;
}

function generateAppsTable(input){
    var content = "<ul>";
    for(var i = 0; i < input.length; i++){
        if(input[i].name.indexOf("\<") == -1){
            content += "<li tabindex=\"1\">";
            content += "<span><img src=\"" + input[i].thumbnailUrl + "\" class=\"img-small\"></span>";
            content += "<span>" + input[i].name + "</span>";
            content += "</li>";
        } else{
        // since json has silly name for Itunes app so i handle here instead of changing Json file
            content += "<li tabindex=\"1\">";
            content += "<span><img src=\"" + input[i].thumbnailUrl + "\" class=\"img-small\"></span>";
            content += "<span>iTunes</span>";
            content += "</li>";
        }
        
    }
    content += "</ul>";
    document.getElementsByClassName("contents")[0].innerHTML = content;
}

//handle keyboard arrows, up and down
document.getElementsByClassName("contents")[0].addEventListener("keydown", function(e){
    if (e.keyCode === 40) {       
        e.target.classList.remove("active")
        if(e.target.nextSibling){
            e.target.nextSibling.classList = "active";
            e.target.nextSibling.focus();
        }  
        return false;
    } else if (e.keyCode === 38) {    
        if(e.target.previousSibling){
            e.target.classList.remove("active");
            e.target.previousSibling.classList = "active";
            e.target.previousSibling.focus();
        }
       
        return false;
    }
    else if (e.keyCode === 13) {        
        var lstHistory = localStorage.getItem("appsHistory")
        ? localStorage.getItem("appsHistory") : "" ;
        document.getElementsByName("apps")[0].value = e.target.children[1].innerText;
        if(lstHistory.indexOf(",") !== -1){
            lstHistory += "," +  e.target.children[1].innerText;
            var tempHistory = lstHistory.split(",");
            if(tempHistory.length > 10){
                tempHistory.splice(0, 1);
                lstHistory = tempHistory.toString();
            }
        }         
        else{
            lstHistory = lstHistory !== "" ? lstHistory + "," +  e.target.children[1].innerText 
            : lstHistory + e.target.children[1].innerText;
        }
        localStorage.setItem("appsHistory", lstHistory);
        showAppsHistory();
        return false;
    }
})

//show history selected apps, maximum 10
function showAppsHistory(){
    if(localStorage.getItem("appsHistory")){
        var historyContent = "<p>Recent History</p>";
        historyContent += "<ul>";
        if(localStorage.getItem("appsHistory").indexOf(",") !== -1){
            var historyApps = localStorage.getItem("appsHistory").split(",");
            var lengthApps = historyApps.length;
            if(lengthApps > 0){              
                for(var i = lengthApps - 1; i >= 0; i--){
                    historyContent += "<li>"
                    historyContent += historyApps[i];
                    historyContent += "<span class=\"removeHistory\">x</span></li>";
                }
            }
        }else{
            historyContent += "<li>"
            historyContent += localStorage.getItem("appsHistory");
            historyContent += "<span class=\"removeHistory\">x</span></li>";
        }
        historyContent += "</ul>";
        document.getElementsByClassName("appsHistory")[0].innerHTML = 
        historyContent;
    }else{
        document.getElementsByClassName("appsHistory")[0].innerHTML = 
        "";
    }
}
showAppsHistory();

function clickedOutsideElement(elemId) {
    var theElem = getEventTarget(window.event);
    while(theElem != null) {
      if(theElem.id == elemId)
        return false;
      theElem = theElem.offsetParent;
    }
    return true;
}

function getEventTarget(evt) {
    var targ = (evt.target) ? evt.target : evt.srcElement;
    if(targ != null) {
      if(targ.nodeType == 3)
        targ = targ.parentNode;
    }
    return targ;
}
// handle click outside main content, hide suggested layer
document.onclick = function() {
    if(clickedOutsideElement('apps') & clickedOutsideElement('contentApps')){
        document.getElementsByClassName("contents")[0].style.display = "none";
        stickContents();
    }
  }

document.getElementsByClassName("appsHistory")[0].addEventListener("click", function(e) {
	if(e.target && e.target.nodeName == "SPAN") {
        deleteHistory(e.target.parentNode.innerText.replace("x",""));
        showAppsHistory();
    }
});

function deleteHistory(input){
    if(localStorage.getItem("appsHistory").indexOf(",") !== -1){
        var currentHistory = localStorage.getItem("appsHistory").split(",");
        var lengthApps = currentHistory.length;
        for(var i = lengthApps - 1; i >= 0 ; i--){
            var index = currentHistory[i].indexOf(input)
            if(index !== -1){
                currentHistory.splice(i, 1);
                break;
            }
        }
        localStorage.setItem("appsHistory", currentHistory.toString());
    }else{
        localStorage.clear();
    }
}