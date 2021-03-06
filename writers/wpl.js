const fs = require('fs');
const path = require('path');
const Entities = require('html-entities').XmlEntities;

entities = new Entities();

module.exports = function (collections, output) {
    collections.forEach((collection) => {
        const name = collection.name;
        const filepath = path.resolve(output, name + '.wpl');
        let content = '';
        collection.list.forEach((song, index) => {
            if (song.path) {
                const relative = path.relative(output, song.path);
                const fl = relative.replace(/\//ig, '\\');
                const ul = fl.normalize('NFC');
                const el = entities.encodeNonUTF(ul);
                content += `<media src="${el}"/>\n`;
            }
        });
        const tpl = `
        <?wpl version="1.0"?>
        <smil>
            <head>
                <meta name="Generator" content="Microsoft Windows Media Player -- 12.0.14393.953"/>
                <meta name="ItemCount" content="${collection.list.length}"/>
                <title>${name}</title>
            </head>
            <body>
                <seq>
                    ${content}
                </seq>
            </body>
        </smil>   
        `;
        fs.writeFileSync(filepath, tpl, { encoding: 'UTF-8' });
        console.log(`Writing ${filepath}`);
    });
}
