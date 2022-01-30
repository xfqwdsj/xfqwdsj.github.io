/**
 * Fontawesome icon.
 */
hexo.extend.tag.register('icon', function(args) {
    return `<i class="fas fa-${args.join(' ')}"></i>`;
});