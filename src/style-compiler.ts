
// var Sass = require('sass.js');
// import * as sass from 'node-sass';
import postcss from 'postcss';
import precss from 'precss';

export interface StyleResult {
    files: any[];
    map: any;
    status: number;
    text: string;
}
export class StyleCompiler {

    // options = {
    //     // Format output: nested, expanded, compact, compressed
    //     style: Sass.style.nested,
    //     // Decimal point precision for outputting fractional numbers
    //     // (-1 will use the libsass default, which currently is 5)
    //     precision: -1,
    //     // If you want inline source comments
    //     comments: false,
    //     // String to be used for indentation
    //     indent: '  ',
    //     // String to be used to for line feeds
    //     linefeed: '\n',
    // };

    // constructor() {
    //    try {
    //         Sass.options(this.options);
    //    } catch (error) {
    //        console.error('sass option error', error);
    //    }
    // }

    // complieSass(scssString: string): Promise<StyleResult> {
    //   try {
    //         return new Promise(resolve => {
    //         Sass.compile(scssString,this.options, function (result: any) {
    //             resolve(result as StyleResult);
    //         });
    //     });
    //   } catch (error) {
    //       console.error('error', error);
    //       return error;
    //   }
    // }

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


    async complie(scssString: string) {
        const result = await postcss([
            precss(/* options */)
        ]).process(scssString);
        const resultString = result.toString(); 
        // const result2 = await postcss.parse(scssString).toResult();
        // const result2String = result2;
        // console.log('complie result', resultString, result2String);
        return {
            text: resultString
        };
    }
}