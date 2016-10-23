// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
let vscode = require('vscode');
var request = require('request');

var userEmail = '';
var runningTotalLines = 0;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('codeometer-ext is now active!');

    var lineCounter = new LineCounter();

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.startCodeometer', function () {
        // The code you place here will be executed every time your command is executed
        
        var setEmail = vscode.window.activeTextEditor.selection;

        var newEmail = vscode.window.activeTextEditor.document.getText(setEmail)

        console.log(setEmail);
        if(setEmail){
            userEmail = newEmail;
        } else {
            vscode.window.showInformationMessage('Try again while highlighting your twitter handle');
            return;
        }

        // Display a message box to the user
        if(!vscode.window.activeTextEditor){
            return;
        }

        runningTotalLines = lineCounter.totalLines;

        vscode.window.showInformationMessage('Codeometer started for handle: ' + userEmail);

        //create the user's account
        request
            .post('http://codeometer.com/api/user/create')
            .form({email: userEmail})
            .on('response', function(response) {
                //console.log(response);
            });

        lineCounter.updateLineCount(false);


    });

    context.subscriptions.push(lineCounter);
    context.subscriptions.push(disposable);
}
exports.activate = activate;

class LineCounter {

    updateLineCount(report) {
        if(!this._statusBarItem){
            this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        }

        this.startTimeOut();

        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }

        let doc = editor.document;


        let lineCt = Math.abs(this.totalLines - runningTotalLines);

        // Update the status bar
        this._statusBarItem.text = lineCt !== 1 ? `${lineCt} Logged Lines` : '1 Logged Line';
        this._statusBarItem.show();

        if(report){
            request
                .post('http://codeometer.com/api/user/report')
                .form({email: userEmail, report: lineCt});
        }

        runningTotalLines = this.totalLines;

    }

    get totalLines() {
        var newTotalLines = 0;
        
        var allDocs = vscode.workspace.textDocuments;

        vscode.workspace.textDocuments.forEach((element) => {
            newTotalLines += element.lineCount;
        });

        return newTotalLines;
    }

    startTimeOut() {
        var that = this;

        if(this._timer == null){
            this._timer = true;
            console.log('Timer started');
            setTimeout(function() {
                that.updateLineCount(true);
            }, 10000);//100 secs
        } else if(this._timer){
            console.log('Report sent');
            setTimeout(function() {
                that.updateLineCount(true);
            }, 10000);

        }
    }

    dispose() {
        this._statusBarItem.dispose();
        this._timer = false;
    }


}

// this method is called when your extension is deactivated
function deactivate() {
}


exports.deactivate = deactivate;