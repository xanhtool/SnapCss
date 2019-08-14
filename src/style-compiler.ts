var Sass = require('sass.js');
// var sass = require('node-sass');
// import * as sass from 'node-sass';
export interface StyleResult {
    files: any[];
    map: any;
    status: number;
    text: string;
}
export class StyleCompiler {

    options = {
        // Format output: nested, expanded, compact, compressed
        style: Sass.style.nested,
        // Decimal point precision for outputting fractional numbers
        // (-1 will use the libsass default, which currently is 5)
        precision: -1,
        // If you want inline source comments
        comments: false,
        // String to be used for indentation
        indent: '  ',
        // String to be used to for line feeds
        linefeed: '\n',
    };

    constructor() {
        Sass.options(this.options);
    }

    complieSass(scssString: string): Promise<StyleResult> {
        return new Promise(resolve => {
            Sass.compile(scssString,this.options, function (result: any) {
                resolve(result as StyleResult);
            });
        });
    }

    // constructor() {

    // }

    // complieNodeSass(scssString: string) {
    //     var result = sass.renderSync({
    //         data: scssString,
    //         outputStyle: 'compressed',
    //         sourceMap: true
    //     });

    //     return {
    //         ...result,
    //         text: result.css.toString()
    //     };
    // }

}