const Store = require('electron-store');

class DataStore extends Store {
    constructor(settings) {
        super(settings)
        this.prefs = this.get('prefs') || { "launchOnStart": "false", "autoCopy": "false"}
    }

    savePrefs() {
        this.set('prefs', this.prefs)
        return this
    }

    getPrefs() {
        this.prefs = this.get('prefs') || { "launchOnStart": "false", "autoCopy": "false" }
        return this
    }

    setLaunch(pref) {
        this.prefs.launchOnStart = pref;
        return this.savePrefs()
    }

    setCopy(pref) {
        this.prefs.autoCopy = pref;
        return this.savePrefs()
    }
}

module.exports = DataStore;