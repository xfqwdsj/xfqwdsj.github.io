/**
 * Bulma Message Tag, see {@link https://bulma.io/documentation/components/tabs/}.
 * The format of each tab is: <!-- <active>tab [id] [<icon>] [title] --> [content] <!-- endtab -->
 * @param {string} behavior The behavior of this tab, can not be set. Usable: centered, right, fullwidth. The default behavior is to display on the left.
 * @param {string} size The size of this tab, can not be set. Usable: small, medium, large. The default size is between small and medium.
 * @param {string} style The style of this tab, can not be set. Usable: boxed, toggle, toggle-rounded.
 * @example
 * {% tabs behavior:fullwidth size:small style:toggle-rounded %}
 *     <!-- tab info info Info -->This is info.<!-- endtab -->
 *     <!-- activetab hello Hello hello -->This is hello.<!-- endtab -->
 * {% endmessage %}
 */
 hexo.extend.tag.register('tabs', function(args, content) {
    var behavior = '';
    var size = '';
    var style = '';
    var contentEl = content;
    args.forEach(element => {
        var key = element.split(':')[0];
        var value = element.split(':')[1];
        if (value != null && value != undefined && value != '') {
            switch (key) {
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

    var blockRegExp = /<!--\s*(active)?tab( \w+)( \w+)?( .+?)\s*-->([\s\S]*?)<!--\s*endtab\s*-->/g;
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
        <li${active}>
            <a href="#${match[2].substring(1)}">${hexo.render.renderSync({text: icon + match[4].substring(1), engine: 'markdown'})}</a>
        </li>
        `;
        contentEl += `
        <div id="${match[2].substring(1)}" class="tab-content${hidden}">
            ${hexo.render.renderSync({text: match[5], engine: 'markdown'})}
        </div>
        `;
    }
    
    return `
    <div class="tabs my-3${behavior}${size}${style}">
        <ul class="mx-0 my-0">
            ${tabsEl}
        </ul>
    </div>
    ${contentEl}
    `;
}, { ends: true });

hexo.extend.injector.register(
    "body_end",
    () => {
      return `
      <script>
      (() => {
          function switchTab() {
              if (!location.hash) {
                return;
              }
              Array
                  .from(document.querySelectorAll('.tab-content'))
                  .forEach($tab => {
                      $tab.classList.add('is-hidden');
                  });
              Array
                  .from(document.querySelectorAll('.tabs li'))
                  .forEach($tab => {
                      $tab.classList.remove('is-active');
                  });
              const $activeTab = document.querySelector(location.hash);
              if ($activeTab) {
                  $activeTab.classList.remove('is-hidden');
              }
              const $tabMenu = document.querySelector(\`a[href="\${location.hash}"]\`);
              if ($tabMenu) {
                  $tabMenu.parentElement.classList.add('is-active');
              }
          }
          switchTab();
          window.addEventListener('hashchange', switchTab, false);
      })();
      </script>
      `;
    },
    "post"
  );