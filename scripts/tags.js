hexo.extend.tag.register('message', function(args, content){
    var iconAndTitle = args.splice(0, 1)[0].split(',');
    var icon = iconAndTitle[0];
    var title = iconAndTitle[1];
    var iconEl = '';
    var titleEl = '';
    if (icon != undefined && icon != null && icon != '') iconEl = `<i class="fas fa-${icon} mr-2"></i>`
    if (title != undefined && title != null && title != '') titleEl = `**${title}**  \n`
    return `
    <article class="message message-immersive ${args.join(' ')}">
        <div class="message-body">
            ${hexo.render.renderSync({text: iconEl + titleEl + content, engine: 'markdown'})}
        </div>
    </article>
    `;
}, { ends: true });