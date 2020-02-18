import * as vscode from 'vscode';
import * as path from 'path';
import { StyleCompiler, StyleResult } from './style-compiler';
import { ServerListener } from './server-listener';
import { Subject } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { ProjectChecker, SelectorResult } from './project-checker';
import { Prefixer } from './prefixer';

export class FileWatcher {
    listener$ = new Subject();
    editor: vscode.TextEditor | undefined;
    // let lastModifyDate: number = 0;

    constructor(
        public serverListener: ServerListener,
        public projectChecker: ProjectChecker,
        public prefixer: Prefixer,
        public styleCompier: StyleCompiler
    ) {
        this.startListener();
        this.trackingUserInput();
    }

    trackingUserInput() {
        console.log("trakingUserInput begin", !!this.editor);
        // console.log('Snap Style sending data:', !!this.editor);
        this.editor = vscode.window.activeTextEditor;
        vscode.workspace.onDidChangeTextDocument((event) => this.listener$.next(event));
    }

    tracker() {
        return vscode.commands.registerCommand('extension.trakingUserInput', () => {
            this.trackingUserInput();
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

    // sendCode() {
    //     return vscode.commands.registerCommand('extension.sendCode', () => {
    //         if (editor) {
    //             this.prepareDataToSend(editor.document);
    //         } else {
    //             console.log('text editor not exist');
    //         }
    //     });
    // }

    async prepareDataToSend(document: vscode.TextDocument) {
        // console.log('Snap Style sending data:', !!this.editor);
        if (!this.editor) { return; }
        const fileNameFull = path.basename(document.fileName);
        const fileName = fileNameFull.split('.')[0];
        const textAll = document.getText();
        const isAngular = this.projectChecker.isAngular();
        let selectorResult;
        if (isAngular) {
            selectorResult = await this.projectChecker.checkAngularFileType(document.fileName);
        } else {
            selectorResult = await this.projectChecker.resultGenerator(document.fileName);
        }

        if (!selectorResult) { return; }

        const angularAtribute = await this.serverListener.requestAngularAtribute(selectorResult);
        let styleData;
        let styleMixedText;
        const selector = angularAtribute ? `${selectorResult.selector}[${angularAtribute}]` : selectorResult.selector;
        try {
            // styleData = await this.styleCompier.complieSass(textAll);
            // styleData = this.styleCompier.complieNodeSass(textAll);
            styleData = await this.styleCompier.complie(textAll);
            // console.log("style data", styleData);
            styleMixedText = this.prefixer.prefixCssSelectors(styleData.text, selector);
            if (!styleMixedText) { return; }
        } catch (error) {
            console.error('error while complie sass', error);
            return;
        }
        this.emitDataToChrome(fileName, selectorResult, selector, angularAtribute, styleMixedText, styleData);
    }

    emitDataToChrome(fileName: string, selectorResult: SelectorResult, selector: any, angularAtribute: string | null | undefined, styleMixedText: string, styleData: any) {
        const modifyDate = Date.now();
        const message = {
            data: styleMixedText,
            styleData,
            selector,
            selectorResult,
            fileName: fileName,
            modifyDate: fileName + '-' + modifyDate,
        };

        console.log("payload", message);
        if (this.serverListener && this.serverListener.io) {this.serverListener.io.emit('message', message);}
    }


}