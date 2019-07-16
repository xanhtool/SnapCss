// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ServerListener } from './server-listener';
import { showHelloText, commentLine } from './tester';
import { ProjectChecker } from './project-checker';
import { FileWatcher } from './file-watcher';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const serverListener = new ServerListener();
	const projectChecker = new ProjectChecker();
	const fileWatcher = new FileWatcher(serverListener, projectChecker);
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "fast-style" is now active!');
	projectChecker.getInfo();
	context.subscriptions.push(fileWatcher.trackingUserInput());
	// context.subscriptions.push(showHelloText());
	// context.subscriptions.push(commentLine());
	// context.subscriptions.push(fileWatcher.sendCode());
	// context.subscriptions.push(projectChecker.getInfo());
}

// this method is called when your extension is deactivated
export function deactivate() { }
