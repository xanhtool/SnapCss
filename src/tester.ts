
import * as vscode from 'vscode';

export function showHelloText() {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	return vscode.commands.registerCommand('extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		const message = "hello VS Code";
		// Display a message box to the user
		vscode.window.showInformationMessage(message);
	});
}

// The editor.action.addCommentLine command, for example, comments the currently selected lines in the active text editor:
export function commentLine() {
	return vscode.commands.registerCommand('extension.comment', () => {
		vscode.commands.executeCommand('editor.action.addCommentLine');
	});
}
