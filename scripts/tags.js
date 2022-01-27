hexo.extend.tag.register('message', function(args, content){
    var iconAndTitle = args.splice(0, 1)[0].split(',');
    var icon = iconAndTitle[0];
    var title = iconAndTitle[1];
    var classes = args;
    var iconEl = '';
    var titleEl = '';
    if (icon != undefined && icon != null && icon != '') iconEl = `<i class="fas fa-${icon} mr-2"></i>`
    if (title != undefined && title != null && title != '') titleEl = `**${title}**\n`
    return `
    <article class="message message-immersive ${classes.join(' ')}">
        <div class="message-body">
            ${iconEl}${hexo.render.renderSync({text: titleEl, engine: 'markdown'}).replace(/^\n+|\n+$/g, '')}${hexo.render.renderSync({text: content, engine: 'markdown'}).replace(/^\n+|\n+$/g, '')}
        </div>
    </article>
    `;
}, { ends: true });