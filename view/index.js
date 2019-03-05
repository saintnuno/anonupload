window.$ = window.jQuery = require('../static/js/jquery.min.js')

require('../static/js/mousetrap.min.js')
require('../static/js/date.format.min.js')

    const cb = require('electron').clipboard;
    var request = require("request");
    var { app } = require("electron");
    var fs = require("fs");
    var s = document.getElementById("stats");
    var path;
    var count = 0;
    const DataStore = require('../data/DataStore');

    const data = new DataStore({ name: 'config' });

    s.style.display = "none";


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


    $(".up").on("click", upload);
    $(".slider").on("click", setLaunch);
    $(".sliderc").on("click", setCopy);