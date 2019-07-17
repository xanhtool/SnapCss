import * as vscode from 'vscode';
import * as path from 'path';
import { StyleCompiler } from './style-compiler';
import { ServerListener } from './server-listener';
import { Subject } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { ProjectChecker } from './project-checker';
import { Prefixer } from './prefixer';

const editor = vscode.window.activeTextEditor;
const styleCompiler = new StyleCompiler();

export class FileWatcher {
    listener$ = new Subject();
// let lastModifyDate: number = 0;

    constructor(
        public serverListener: ServerListener,
        public projectChecker: ProjectChecker,
        public prefixer: Prefixer,
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
                // tap(value => console.log("value", value)),
            )
            .subscribe((value: any) => this.prepareDataToSend(value.document));
    }

    sendCode() {
        return vscode.commands.registerCommand('extension.sendCode', () => {
            if (editor) {
                this.prepareDataToSend(editor.document);
            } else {
                console.log('text editor not exist');
            }
        });
    }

    async prepareDataToSend(document:vscode.TextDocument) {
        // console.log("filePath", document);
        if (!editor) { return; }
        const fileNameFull = path.basename(document.fileName);
        const fileName = fileNameFull.split('.')[0];
        const textAll = document.getText();
        const selectorResult = await this.projectChecker.checkAngularFileType(document.fileName);
        const angularAtribute = await this.serverListener.requestAngularAtribute(selectorResult);
        let styleData;
        let styleMixedText;
        const selector = angularAtribute ? `${selectorResult.selector}[${angularAtribute}]`:selectorResult.selector;
        // const selector = selectorResult.selector;
        try {
            styleData = await styleCompiler.complieSass(textAll);
            // styleData = await styleCompiler.sass(textAll);
            styleMixedText = this.prefixer.prefixCssSelectors(styleData.text, selector);
        } catch (error) {
            console.error(error);
            return;
        }
        console.log("complie text result: ",selectorResult, angularAtribute, selector, styleMixedText);
        // console.log("complie text result: ",selector, selectorResult, styleData, styleMixedText);
        const modifyDate = Date.now();
        this.serverListener.io.emit('message', {
            // data: `${selectorResult.selector} {${styleData.text}}`,
            // data: styleData.text,
            data: styleMixedText,
            styleData,
            selectorResult,
            fileName: fileName,
            modifyDate: fileName + '-' + modifyDate,
            // lastModifyDate: fileName + '-' + lastModifyDate,
        });
        // lastModifyDate = modifyDate;
    }

 
}