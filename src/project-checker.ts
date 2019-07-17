import * as vscode from 'vscode';
import { ServerListener } from './server-listener';

export interface SelectorResult {
    fileName: string;
    type: string;
    selector: string | null;
    message: string;
}

export class ProjectChecker {
    languageList = ['scss', 'css'];
    constructor(
        // public serverListener: ServerListener
    ) {
        this.onFileOpen();
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


    onFileOpen() {
        console.log("onFileopen track");
        vscode.workspace.onDidOpenTextDocument(async (event) => {
            const language = event.languageId;
            if (this.languageList.includes(event.languageId)) {
                // console.log("event", language, event);
                const fileResult = await this.checkAngularFileType(event.fileName);
                console.log(`onFileopen, we will track this ${language} file, ${fileResult}`);
            } else {
                // console.log(`Ops, ${language} file should not track`);
            }
        });
    }

    private resultGenerator(fileName: string, type: string = 'basicStyle', selector: any = null, message = '') {
        return {
            fileName,
            type: type,
            selector: selector,
            message
        };
    }

    async checkAngularFileType(fileName: string) {
        const componentOrDirective = fileName.includes('.component.') || fileName.includes('.directive.');
        if (componentOrDirective) {
            return await this.selectorParser(fileName);
        } else {
            return await this.resultGenerator(fileName);
        }

        
    }

    private async selectorParser(fileName: string) {
        const doc = await vscode.workspace.openTextDocument(this.getTSFilePath(fileName));
        // vscode.window.showTextDocument(doc); // this will open in editor
        const data = doc.getText();
        const searchList = (/(?:.*selector.*)(?:'|")(.*)(?:'|")(?:,)/g).exec(data);
        if (searchList && searchList.length) {
            const selector = searchList[1];
            return this.resultGenerator(fileName, 'selectorStyle', selector);
        } else {
            return this.resultGenerator(fileName, 'selectorStyle', null, `sorry, cannot find selector`);
        }
    }

    private getTSFilePath(fileName: string) {
        const fileExt = fileName.split('.')[fileName.split('.').length - 1];
        fileName = fileName.replace(fileExt, 'ts');
        var openPath = vscode.Uri.parse("file:///" + fileName); //A request file path
        return openPath;
    }
}
