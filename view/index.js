window.$ = window.jQuery = require('../static/js/jquery.min.js')

require('../static/js/mousetrap.min.js')
require('../static/js/date.format.min.js')

const cb = require('electron').clipboard;
var request = require("request");
var {
    app
} = require("electron");
var fs = require("fs");
var s = document.getElementById("stats");
var up = document.getElementsByClassName("up");
var tl = document.getElementsByClassName("tablinks");
var tc = document.getElementsByClassName("tabcontent");
var t = document.getElementsByClassName("tab");
var h = document.getElementById("holder");
var path;
var count = 0;
const DataStore = require('../data/DataStore');

const data = new DataStore({
    name: 'config'
});

s.style.display = "none";

// Holder for the files
const holder = document.getElementById('holder');
holder.ondragover = () => {
    return false;
};
holder.ondragleave = holder.ondragend = () => {
    return false;
};
holder.ondrop = (e) => {
    e.preventDefault();
    for (let f of e.dataTransfer.files) {
        path = f.path;
        const fs = require("fs");
        const stats = fs.statSync(path);
        const size = stats.size / 1073741824;
        if (size >= 10) {
            document.getElementById("holder").innerHTML = "File is too large";
        } else {
            document.getElementById("holder").innerHTML = path.split("\\").join("/");
        }
    }
    return false;
};

// Slider check
if (data.getPrefs().prefs.launchOnStart === "true") {
    document.getElementById("check").checked = true;
} else {
    document.getElementById("check").checked = false;
}

if (data.getPrefs().prefs.autoCopy === "true") {
    document.getElementById("checkc").checked = true;
} else {
    document.getElementById("checkc").checked = false;
}

if (data.getPrefs().prefs.theme === "light") {

    document.getElementById("checkt").checked = true;
    tc[0].style.backgroundColor = "white";
    tc[0].style.color = "black";
    tc[1].style.backgroundColor = "white";
    tc[1].style.color = "black";
    up[0].style.color = "black";
    up[0].style.backgroundColor = "rgb(224, 224,224)";
    t[0].style.backgroundColor = "rgb(224, 224,224)";
    tl[0].style.color = "black";
    tl[1].style.color = "black";
    s.style.color = "black";
    s.style.border = "1px solid black";
} else {
    document.getElementById("checkt").checked = false;
    tc[0].style.backgroundColor = "rgb(0, 0, 0, 0.1)";
    tc[0].style.color = "white";
    tc[1].style.backgroundColor = "rgb(0, 0, 0, 0.1)";
    tc[1].style.color = "white";
    up[0].style.color = "white";
    up[0].style.backgroundColor = "#444";
    t[0].style.backgroundColor = "rgba(0, 0, 0, 0.2)";
    tl[0].style.color = "white";
    tl[1].style.color = "white";
    s.style.color = "white";
    s.style.border = "1px solid white";
}



function upload() {
    var req = request.post('https://anonfile.com/api/upload', function (err, resp, body) {
        if (err) {
            alert(err);
        } else {
            body = JSON.parse(body);
            if (data.getPrefs().prefs.autoCopy === "true") {
                cb.clear();
                cb.writeText(body.data.file.url.full);
            }
            var x = document.getElementById("stats");
            x.setAttribute("value", body.data.file.url.full);
            if (count < 1) {
                if (x.style.display === "none") {
                    x.style.display = "block";
                }
            }
        }
    });
    var form = req.form();
    form.append('file', fs.createReadStream(path.split("\\").join("/")));

};

function setLaunch() {
    try {
        if (data.getPrefs().prefs.launchOnStart === "false") {
            data.setLaunch('true');
        } else {
            data.setLaunch('false');
        }
    } catch (err) {
        alert(err)
    }
}

function setCopy() {
    try {
        if (data.getPrefs().prefs.autoCopy === "false") {
            data.setCopy('true');
        } else {
            data.setCopy('false');
        }
    } catch (err) {
        alert(err)
    }
}

function setTheme() {
    try {
        if (data.getPrefs().prefs.theme === "dark") {
            data.setTheme('light');
            tc[0].style.backgroundColor = "white";
            tc[0].style.color = "black";
            tc[1].style.backgroundColor = "white";
            tc[1].style.color = "black";
            up[0].style.color = "black";
            up[0].style.backgroundColor = "rgb(224, 224,224)";
            t[0].style.backgroundColor = "rgb(224, 224,224)";
            tl[0].style.color = "black";
            tl[1].style.color = "black";
            s.style.color = "black";
            s.style.border = "1px solid black";
        } else {
            data.setTheme('dark');
            tc[0].style.backgroundColor = "rgb(0, 0, 0, 0.1)";
            tc[0].style.color = "white";
            tc[1].style.backgroundColor = "rgb(0, 0, 0, 0.1)";
            tc[1].style.color = "white";
            up[0].style.color = "white";
            up[0].style.backgroundColor = "#444";
            t[0].style.backgroundColor = "rgba(0, 0, 0, 0.2)";
            tl[0].style.color = "white";
            tl[1].style.color = "white";
            s.style.color = "white";
            s.style.border = "1px solid white";
        }
    } catch (err) {
        alert(err)
    }
}


$(".up").on("click", upload);
$(".slider").on("click", setLaunch);
$(".sliderc").on("click", setCopy);
$(".slidert").on("click", setTheme);