import Ember from 'ember';

import StyleBindingsMixin from 'ember-table/mixins/style-bindings';

export default Ember.CollectionView.extend(StyleBindingsMixin, {
  styleBindings: 'width',
  itemViewClassField: null,
  createChildView: function(view, attrs) {
    var itemViewClass, itemViewClassField;
    itemViewClassField = this.get('itemViewClassField');
    itemViewClass = attrs.content.get(itemViewClassField);
    if (typeof itemViewClass === 'string') {
      if (/[A-Z]+/.exec(itemViewClass)) {
        itemViewClass = Ember.get(Ember.lookup, itemViewClass);
      } else {
        itemViewClass = this.container.lookupFactory("view:" + itemViewClass);
      }
    }
    return this._super(itemViewClass, attrs);
  }
});
