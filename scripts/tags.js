hexo.extend.tag.register('message', function(args, content){
    var type = args[0];
    var icon = args[1];
    var iconEl = '';
    if (icon != null) iconEl = `<i class="fas fa-${icon} mr-2"></i>`
    return `
    <article class="message message-immersive is-${type}">
        <div class="message-body">
            ${iconEl}
            ${content}
        </div>
    </article>
    `;
}, { ends: true });