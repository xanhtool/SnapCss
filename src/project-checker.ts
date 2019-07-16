import * as vscode from 'vscode';

export class ProjectChecker {

    constructor() {
        this.onFileOpen();
    }

    languageList = ['scss', 'css'];

    // onTextChange() {
    // vscode.workspace.onDidChangeTextDocument((event) => {
    // 	console.log("event", event);
    // 	const language = event.document.languageId;
    // 	if (this.languageList.includes(event.document.languageId)) {
    // 		console.log(`Nice, we will track this ${language} file`);
    // 	} else {
    // 		console.log(`Ops, ${language} file should not track`);
    // 	}
    // });
    // }



    onFileOpen() {
        console.log("onFileopen track");
        vscode.workspace.onDidOpenTextDocument((event) => {
            const language = event.languageId;
            if (this.languageList.includes(event.languageId)) {
                console.log("event", language, event);
                console.log(`Nice, we will track this ${language} file`);
                this.checkAngularFileType(event.fileName);
            } else {
                // console.log(`Ops, ${language} file should not track`);
            }
        });
    }

    getInfo() {
        return vscode.commands.registerCommand('extension.getInfo', () => {
            console.log("getInfo begin");
            this.workSpaceTrack();
        });
    }

    workSpaceTrack() {
        const isAngular = vscode.workspace.findFiles('angular.json');
        if (isAngular) { console.log("this is angular project", isAngular); }
    }

    async checkAngularFileType(fileName: string) {
        const fileExt = fileName.split('.')[fileName.split('.').length - 1];
        const componentOrDirective = fileName.includes('.component.') || fileName.includes('.directive.');
        console.log(`component ${fileName.includes('.component.')} directive ${fileName.includes('.directive.')} result ${componentOrDirective}`);

        if (componentOrDirective) {
            // console.log("this is component or directive file")
            fileName = fileName.replace(fileExt, 'ts');
            var openPath = vscode.Uri.parse("file:///" + fileName); //A request file path
            const doc = await vscode.workspace.openTextDocument(openPath);
            // vscode.window.showTextDocument(doc); // this will open in editor
            const data = doc.getText();
            // console.log("data", data);
            const searchList = (/(?:.*selector.*)(?:'|")(.*)(?:'|")(?:,)/g).exec(data);
            if (searchList && searchList.length) {
                const selector = searchList[1];
                // console.log('searched selector', selector);
                return {
                    fileName,
                    type: 'selectorStyle',
                    selector: selector,
                };
            } else {
                // console.log("sorry, cannot find selector");
                return {
                    fileName,
                    type: 'selectorStyle',
                    selector: null,
                    message: `sorry, cannot find selector`
                };
            }
        }
        return {
            fileName,
            type: 'basicStyle',
            selector: null
        };
    }
}
