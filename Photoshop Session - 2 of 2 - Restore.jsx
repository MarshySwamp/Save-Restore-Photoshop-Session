/*
Photoshop Session - 2 of 2 - Restore.jsx
v1.0 - 11th November 2023, Stephen Marsh
https://community.adobe.com/t5/photoshop-ecosystem-ideas/please-session-saving/idc-p/14169472
https://community.adobe.com/t5/photoshop-ecosystem-ideas/restore-previous-session/idc-p/14189928
*/

#target photoshop

try {
    var theLogFilePath = readPref(app.preferencesFolder + "/" + "Photoshop Session Document Paths.log");
    if (File(app.preferencesFolder + "/" + "Photoshop Session Document Paths.log").exists && File(app.preferencesFolder + "/" + "Photoshop Session Document Paths.log").length > 0) {
        //alert(app.preferencesFolder.fsName + "/" + "Photoshop Session Document Paths.log");
        for (var m = 0; m < theLogFilePath.length; m++) {
            open(File(theLogFilePath[m]));
        }
    } else {
        alert("The Desktop log file 'Photoshop Session Document Paths.log' doesn't exist or is empty!");
    }
} catch (e) { }

//app.runMenuItem(stringIDToTypeID('consolidateAllTabs'));
//app.runMenuItem(stringIDToTypeID('floatAllWindows'));
//app.runMenuItem(stringIDToTypeID('tileVertically'));
//app.runMenuItem(stringIDToTypeID('tileHorizontally'));

try {
    if (File(app.preferencesFolder + "/" + "Photoshop Session Active Document.log").exists && File(app.preferencesFolder + "/" + "Photoshop Session Active Document.log").length > 0) {
        //alert(app.preferencesFolder + "/" + "Photoshop Session Active Document.log");
        var theActDocLogFile = new File(app.preferencesFolder + "/" + "Photoshop Session Active Document.log");
        theActDocLogFile.open('r');
        var theActiveDocName = theActDocLogFile.readln(1);
        theActDocLogFile.close();
        activeDocument = documents.getByName(theActiveDocName);
    } else {
        alert("The Desktop log file 'Photoshop Session Active Document.log' doesn't exist or is empty!");
    }
} catch (e) {}

function readPref(thePath) {
    /*
    Based on:
    https://community.adobe.com/t5/photoshop-ecosystem-discussions/script-to-open-multiple-docs-from-a-text-file/td-p/14148443
    by c.pfaffenbichler
    */
    if (File(thePath).exists === true) {
        var logFile = File(thePath);
        logFile.open("r");
        logFile.encoding = "UTF-8";
        var theString = new String;
        for (var m = 0; m < logFile.length; m++) {
            theString = theString.concat(logFile.readch());
        }
        logFile.close();
        return theString.split("\n");
        //return String(theString);
    }
}
