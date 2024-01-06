/*
Photoshop Session - 1 of 2 - Save.jsx
v1.0 - 11th November 2023, Stephen Marsh
https://community.adobe.com/t5/photoshop-ecosystem-ideas/please-session-saving/idc-p/14169472
https://community.adobe.com/t5/photoshop-ecosystem-ideas/restore-previous-session/idc-p/14189928
*/

#target photoshop

try {
    if (app.documents.length > 0) {

        if (confirm("Log all open session files and save close all documents?", false)) {
            var logFile = new File(app.preferencesFolder + "/" + "Photoshop Session Document Paths.log");
            if (logFile.exists)
                logFile.remove();
            //alert(logFile.fsName);
            var actDocLogFile = new File(app.preferencesFolder + "/" + "Photoshop Session Active Document.log");
            if (actDocLogFile.exists)
                actDocLogFile.remove();
            writeActiveDocToLog();
            //alert(actDocLogFile.fsName);
            while (app.documents.length > 0) {

                app.activeDocument = app.documents[0]; // Force the write to log from left to right document tabs, comment out to reverse the open order

                try {
                    activeDocument.path;

                    if (ExternalObject.AdobeXMPScript === undefined) ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript');
                    var xmp = new XMPMeta(activeDocument.xmpMetadata.rawData);
                    var crsMeta = xmp.getProperty(XMPConst.NS_CAMERA_RAW, "Version");

                    if ((/\.(RAF|CR2|CR3|NRW|ERF|RW2|NEF|ARW|RWZ|EIP|DNG|BAY|DCR|RAW|CRW|3FR|K25|KC2|MEF|DNG|CS1|ORF|ARI|SR2|MOS|CR3|GPR|SRW|MFW|FFF|SRF|KDC|MRW|J6I|RWL|X3F|PEF|IIQ|CXI|NKSC|MDC)$/i).test(activeDocument.fullName) === true && crsMeta !== undefined) {
                        saveAsDefault();
                        writePathToLog();
                        activeDocument.close(SaveOptions.DONOTSAVECHANGES);

                    } else if (activeDocument.path) {
                        writePathToLog();
                        activeDocument.close(SaveOptions.SAVECHANGES);
                    }

                } catch (e) {
                    executeAction(stringIDToTypeID("save"), undefined, DialogModes.ALL);
                    writePathToLog();
                    activeDocument.close(SaveOptions.SAVECHANGES);
                }
            }
        }
    } else {
        alert('A document must be open when running this script!');
    }
} catch (e) {}


///// FUNCTIONS /////

function writePathToLog() {
    var os = $.os.toLowerCase().indexOf("mac") >= 0 ? "mac" : "windows";
    if (os === "mac") {
        var logFileLF = "Unix";
    } else {
        logFileLF = "Windows";
    }
    logFile.open("a");
    logFile.encoding = "UTF-8";
    logFile.lineFeed = logFileLF;
    logFile.writeln(activeDocument.path + "/" + activeDocument.name);
    logFile.close();
}

function writeActiveDocToLog() {
    var os = $.os.toLowerCase().indexOf("mac") >= 0 ? "mac" : "windows";
    if (os === "mac") {
        var logActDocLogLF = "Unix";
    } else {
        logActDocLogLF = "Windows";
    }
    actDocLogFile.open("a");
    actDocLogFile.encoding = "UTF-8";
    actDocLogFile.lineFeed = logActDocLogLF;
    actDocLogFile.writeln(activeDocument.name);
    actDocLogFile.close();
}

function saveAsDefault() {
    function s2t(s) {
        return app.stringIDToTypeID(s);
    }
    var descriptor = new ActionDescriptor();
    descriptor.putObject(s2t("as"), s2t("photoshop35Format"), descriptor);
    descriptor.putPath(s2t("in"), new File("~/Desktop" + "/" + activeDocument.name));
    descriptor.putBoolean(s2t("lowerCase"), true);
    executeAction(s2t("save"), descriptor, DialogModes.ALL);
}
