const path = require('path');
const outDir = './src/assets/icons';

// Шаблон компонента с иконкой
const iconTemplate = (variables, { tpl }) => tpl`
${variables.imports};

${variables.interfaces};

const ${variables.componentName} = (${variables.props}) => (
  ${variables.jsx}
);
 
${variables.exports};
`;


function indexTemplate(files) {
    const compoundExportEntries = [];

    const importEntries = files.map(file => {
        const componentName = path.basename(file.path, path.extname(file.path));
        compoundExportEntries.push(componentName);

        return `import { default as ${componentName} } from './${componentName}';`;
    });

    return `${importEntries.join('\n')}

    export const Icons = {
      ${compoundExportEntries.join(',\n  ')}
    };
  `;
}

module.exports = {
    outDir,
    icon: true,
    typescript: true,
    replaceAttrValues: {
        '#000': 'currentColor',
    },
    indexTemplate,
    template: iconTemplate,
};

//npm run icons