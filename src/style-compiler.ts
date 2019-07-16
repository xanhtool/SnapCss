var Sass = require('sass.js');

export class StyleCompiler {
    
    complieSass(scssString: string) {
        return new Promise(resolve => {
            Sass.compile(scssString, function (result: any) {
                resolve(result);
            });
        });
    }

}