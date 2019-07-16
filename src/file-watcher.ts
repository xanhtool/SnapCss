import * as vscode from 'vscode';
import * as path from 'path';
import { StyleCompiler } from './style-compiler';
import { ServerListener } from './server-listener';
import { Subject } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { ProjectChecker } from './project-checker';

const editor = vscode.window.activeTextEditor;
const styleCompiler = new StyleCompiler();
let lastModifyDate: number = 0;

export class FileWatcher {
    listener$ = new Subject();

    constructor(
        public serverListener: ServerListener,
        public projectChecker: ProjectChecker,
    ) {
        this.startListener();
    }

    trackingUserInput() {
        return vscode.commands.registerCommand('extension.trakingUserInput', () => {
            console.log("trakingUserInput begin");
            vscode.workspace.onDidChangeTextDocument((event) => this.listener$.next(event));
        });
    }

    startListener() {
        this.listener$
            .pipe(
                debounceTime(500),
                tap(value => console.log("value", value)),
            )
            .subscribe((value: any) => this.prepareDataToSend(value.document.fileName));
    }

    sendCode() {
        return vscode.commands.registerCommand('extension.sendCode', () => {
            if (editor) {
                this.prepareDataToSend(editor.document.fileName);
            } else {
                console.log('text editor not exist');
            }
        });
    }

    async prepareDataToSend(filePath: string) {
        console.log("filePath", filePath);
        if (!editor) { return; }
        const fileNameFull = path.basename(filePath);
        const fileName = fileNameFull.split('.')[0];
        const textAll = editor.document.getText();
        const selectorResult = await this.projectChecker.checkAngularFileType(filePath);
        const styleData = await styleCompiler.complieSass(textAll);
        // console.log("complie text result: ", selectorResult, styleData);
        const modifyDate = Date.now();
        this.serverListener.io.emit('message', {
            styleData,
            selectorResult,
            fileName: fileName,
            modifyDate: fileName + '-' + modifyDate,
            lastModifyDate: fileName + '-' + lastModifyDate,
        });
        lastModifyDate = modifyDate;
    }

}