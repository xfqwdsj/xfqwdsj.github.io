hexo.extend.tag.register('icon', function(args) {
    return `<i class="fas ${args.join(' ')}"></i>`;
});

/**
 * Bulma Message Tag, see {@link https://bulma.io/documentation/components/message/}.
 * @param {string} color The color of this message. Usable: dark, primary, link, info, success, warning, danger.
 * @param {string} icon The icon of this message.
 * @param {string} title The header of this message, can not be set, supported Markdown.
 * @example
 * {% message color:danger icon:info-circle 'title:Very danger!' %}
 *     **You are in danger.**
 * {% endmessage %}
 */
hexo.extend.tag.register('message', function(args, content) {
    var color = 'dark';
    var icon = '';
    var title = '';
    var header = '';
    args.forEach(element => {
        var key = element.split(':')[0];
        var value = element.split(':')[1];
        if (value != null && value != undefined && value != '') {
            switch (key) {
                case 'color':
                    color = value;
                    break;
                case 'icon':
                    icon = `<i class="fas fa-${icon} mr-2"></i>`;
                    break;
                case 'title':
                    title = value;
                    break;
            }
        }
    });
    if (icon != '' || title != '') {
        header = `
        <div class="message-header">
            ${hexo.render.renderSync({text: icon + title, engine: 'md'})}
        </div>
        `
    }
    return `
    <article class="message is-${color}">
        ${header}
        <div class="message-body">
        ${hexo.render.renderSync({text: content, engine: 'md'})}
        </div>
    </article>
    `;
}, { ends: true });