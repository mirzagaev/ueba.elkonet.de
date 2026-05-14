var formChanged = false;
var saveActive = false;
var frm = "";
var intervalTimer;

document.addEventListener("DOMContentLoaded", function(event) {
    doInitActions();
});

function doInitActions()
{
    frm = document.querySelectorAll('*[id^="formular_"]');

    resetIntervalTimer();

    window.addEventListener("beforeunload", function(event) {
        if(getFormChanged()==true)
        {
            event.returnValue = 'Sie haben ihre Eingaben noch nicht gespeichert. Sind Sie sicher, dass Sie das Fenster schließen wollen?';
        }
    });

    if(frm.length<1){return;}
    frm[0].addEventListener('input', () => setFormChanged(true));
}

function resetIntervalTimer()
{
    if(intervalTimer!==undefined)
    {
        clearInterval(intervalTimer);
    }
    intervalTimer = window.setInterval("AJAXPost()", 180000);
}

function versenden() {
    setFormChanged(false);
    frm[0].submit();
}

function savedStatus(status)
{
    var modalText = document.getElementById("modalText");
    var checkSuccess = document.getElementById("checkSuccess");
    var checkFail = document.getElementById("checkFail");
    var loader = document.getElementById("loader");
    setTimeout(function(){
        loader.style.display = "none";
        if(status==true)
        {
            checkSuccess.style.display = "block";
            modalText.innerHTML = "Erfolgreich!";
            setFormChanged(false);
            resetIntervalTimer(); // Nur bei erfolgreich wird später nochmal gespeichert.
        }
        else
        {
            checkFail.style.display = "block";
            modalText.innerHTML = "Fehlgeschlagen! Sind Sie noch angemeldet?";
        }
    }, 700);
    $( ".modal-content" ).delay(1750).fadeOut(150);
    setTimeout(function(){
        modalText.innerHTML = "Speichern...";
        checkSuccess.style.display = "none";
        checkFail.style.display = "none";
        loader.style.display = "block";
        $( "#saveModal" ).fadeOut(150);
    }, 2250);
}

function showModal()
{
    $( "#saveModal" ).fadeIn(150);
    $( ".modal-content" ).delay(250).fadeIn(150);
}

function resetForm()
{
    if (confirm("Ihre Angaben werden vollständig unwiderruflich gelöscht, sind Sie sicher?")) {
        $("#formular_kundenkartei")[0].reset();
        AJAXPost();
    }
}

function AJAXPost() {
    if(saveActive==true){return;}
    if(frm.length<1){return;}

    saveActive=true;
    showModal();
    
    var elem   = frm[0].elements;
    var url    = frm[0].action;    
    var params = "";
    var value;
    var found = false;

    for (var i = 0; i < elem.length; i++) {
        found = false;

        if (elem[i].tagName == "SELECT") {
            value = elem[i].options[elem[i].selectedIndex].value;
            found = true;
        }

        if (elem[i].tagName == "INPUT") {
            if (elem[i].type == "checkbox") {
                if (elem[i].checked == true) {
                    value = elem[i].value;
                } else {
                    value = "";
                }
            }
            else
            {
                value = elem[i].value;
            }
            found = true;
        }

        if(found == false)
        {
            value = elem[i].value;     
        }
        if (elem[i].name) {
            params += elem[i].name + "=" + encodeURIComponent(value) + "&";           
        }
    }

    // NOTIZEN
    let editorContent = JSON.stringify(editor.getJSON());
    // console.info("editor=",editorContent);
    if(editorContent.length > 47){
        params += "Notizen=" + encodeURIComponent(editorContent) + "&";
    }

    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    } else { 
        // code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.open("POST",url,false);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {savedStatus(true);}else{savedStatus(false);}
    };
    xmlhttp.send(params);

    saveActive=false;
    return xmlhttp.responseText;
}

function setFormChanged(value)
{
    formChanged = value;

    if(value==false)
    {
        $( "#saveFail" ).hide();
        $( "#saveSuccess" ).fadeIn(150);
    }
    else
    {
       $( "#saveSuccess" ).hide();
       $( "#saveFail" ).fadeIn(150);
    }
}

function getFormChanged()
{
    return formChanged;
}