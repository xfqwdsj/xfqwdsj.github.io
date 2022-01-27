hexo.extend.tag.register('message', function(args, content){
    var iconAndTitle = args.splice(0, 1).split(',');
    var icon = iconAndTitle[0];
    var title = iconAndTitle[1];
    var classes = args;
    if (icon != null) icon = `<i class="fas fa-${icon} mr-2"></i>`
    if (title != null && title != "") title = `${title}\n`
    return `
    <article class="message message-immersive ${classes.join(' ')}">
        <div class="message-body">
            ${icon}${title}${hexo.render.renderSync({text: content, engine: 'markdown'})}
        </div>
    </article>
    `;
}, { ends: true });