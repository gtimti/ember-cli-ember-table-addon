import Ember from 'ember';

import TableBlock from 'ember-table/views/table-block';

export default TableBlock.extend({
  classNames: ['ember-table-header-block'],
  itemViewClass: 'ember-table/header-row',
  content: Ember.computed(function() {
    return [this.get('columns')];
  }).property('columns')
});
