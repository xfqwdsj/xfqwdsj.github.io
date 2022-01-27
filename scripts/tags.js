hexo.extend.tag.register('message', function(args, content){
    var icon = args.splice(0, 1);
    var classes = args;
    if (icon != null) iconEl = `<i class="fas fa-${icon} mr-2"></i>`
    return `
    <article class="message message-immersive ${type.join(' ')}">
        <div class="message-body">
            ${iconEl}
            ${hexo.render.renderSync({text: content, engine: 'markdown'}).split('\n').join('')}
        </div>
    </article>
    `;
}, { ends: true });