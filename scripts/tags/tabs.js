/**
 * Bulma Tabs Tag, see {@link https://bulma.io/documentation/components/tabs/}.
 * 
 * The format of each tab is: <!-- <active>tab [id] [<icon>] '[title]' --> [content] <!-- endtab -->
 * 
 * @param {string} id           The unique id of this tab, should match: /\w/.
 * @param {string} behavior     The behavior of this tab, can not be set. Usable: centered, right, fullwidth. The
 *                              default behavior is to display on the left.
 * @param {string} size         The size of this tab, can not be set. Usable: small, medium, large. The default
 *                              size is between small and medium.
 * @param {string} style        The style of this tab, can not be set. Usable: boxed, toggle, toggle-rounded.
 * 
 * @example
 * {% tabs behavior:fullwidth size:small style:toggle-rounded %}
 *     <!-- tab info info 'Info' -->This is info.<!-- endtab -->
 *     <!-- activetab hello 'Hello' -->This is hello.<!-- endtab -->
 * {% endmessage %}
 */
 hexo.extend.tag.register('tabs', function(args, content) {
    var id = '';
    var behavior = '';
    var size = '';
    var style = '';
    var contentEl = content;
    args.forEach(element => {
        var key = element.split(':')[0].trim();
        var value = element.split(':')[1].trim();
        if (value != null && value != undefined && value != '') {
            switch (key) {
                case 'id':
                    id = value;
                    break;
                case 'behavior':
                    behavior = ` is-${value}`;
                    break;
                case 'size':
                    size = ` is-${value}`;
                    break;
                case 'style':
                    if (value == 'toggle-rounded') {
                        style = ' is-toggle is-toggle-rounded';
                    } else {
                        style = ` is-${value}`;
                    }
                    break;
            }
        }
    });

    var blockRegExp = /<!--\s*(active)?tab( \w+)( \w+)?( '.*?')\s*-->([\s\S]*?)<!--\s*endtab\s*-->/g;
    var match;
    var tabsEl = '';
    var contentEl = '';

    while((match = blockRegExp.exec(content)) !== null) {
        var active = '';
        var hidden = ' is-hidden';
        if (match[1] != undefined) {
            active = ' class="is-active"';
            hidden = '';
        }
        var icon = '';
        if (match[3] != undefined && match[3].substring(1) != '') icon = `<span class="icon is-small"><i class="fas fa-${match[3].substring(1)}" aria-hidden="true"></i></span>`;
        tabsEl += `
        <li id="${match[2].substring(1)}"${active}">
            <a onclick="switchTab(this)">${hexo.render.renderSync({text: icon + match[4].substring(2, match[4].length - 1), engine: 'markdown'})}</a>
        </li>
        `;
        contentEl += `
        <div id="${match[2].substring(1)}" class="tab-content${hidden}">
            ${hexo.render.renderSync({text: match[5].replace(/^[ \n\t]*|[ \n\t]*$/g, '').replace(/\n {1,4}|\n\t{1}/g, '\n'), engine: 'markdown'})}
            <div>${match[5].replace(/^[ \n\t]*|[ \n\t]*$/g, '').replace(/\n {1,4}|\n\t{1}/g, '\n')}</div>
            <div>${match[5]}</div>
        </div>
        `;
    }
    
    return `
    <div>
        <div class="tabs my-3${behavior}${size}${style}">
            <ul class="mx-0 my-0">
                ${tabsEl}
            </ul>
        </div>
        <div>
            ${contentEl}
        </div>
    </div>
    `;
}, { ends: true });

hexo.extend.injector.register(
    "head_end",
    `
    <script>
        function switchTab(element) {
            var id = element.parentElement.id;
            var tabElements = element.parentElement.parentElement.children;
            var contentElements = element.parentElement.parentElement.parentElement.parentElement.children[1].children;
            for (var i = 0; i < tabElements.length; i++) {
                var $tab = tabElements[i];
                var $content = contentElements[i];
                if ($tab.id == id) {
                    $tab.classList.add('is-active');
                } else {
                    $tab.classList.remove('is-active');
                }
                if ($content.id == id) {
                    $content.classList.remove('is-hidden');
                } else {
                    $content.classList.add('is-hidden');
                }
            }
        }
    </script>
    `
  );