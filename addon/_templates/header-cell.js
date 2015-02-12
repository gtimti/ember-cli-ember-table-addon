export default Ember.HTMLBars.template((function() {
  return {
    isHTMLBars: true,
    blockParams: 0,
    cachedFragment: null,
    hasRendered: false,
    build: function build(dom) {
      var el0 = dom.createElement("div");
      dom.setAttribute(el0,"class","ember-table-content-container");
      var el1 = dom.createTextNode("\n  ");
      dom.appendChild(el0, el1);
      var el1 = dom.createElement("span");
      dom.setAttribute(el1,"class","ember-table-content");
      var el2 = dom.createTextNode("\n    ");
      dom.appendChild(el1, el2);
      var el2 = dom.createTextNode("\n  ");
      dom.appendChild(el1, el2);
      dom.appendChild(el0, el1);
      var el1 = dom.createTextNode("\n");
      dom.appendChild(el0, el1);
      return el0;
    },
    render: function render(context, env, contextualElement) {
      var dom = env.dom;
      var hooks = env.hooks, get = hooks.get, element = hooks.element, content = hooks.content;
      dom.detectNamespace(contextualElement);
      var fragment;
      if (env.useFragmentCache && dom.canClone) {
        if (this.cachedFragment === null) {
          fragment = this.build(dom);
          if (this.hasRendered) {
            this.cachedFragment = fragment;
          } else {
            this.hasRendered = true;
          }
        }
        if (this.cachedFragment) {
          fragment = dom.cloneNode(this.cachedFragment, true);
        }
      } else {
        fragment = this.build(dom);
      }
      var element0 = fragment;
      var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),0,1);
      element(env, element0, context, "action", ["sortByColumn", get(env, context, "view.content")], {});
      content(env, morph0, context, "view.content.headerCellName");
      return fragment;
    }
  };
}()));
