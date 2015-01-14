import Ember from 'ember';

import ShowHorizontalScrollMixin from 'ember-table/mixins/show-horizontal-scroll';

import TableContainer from 'ember-table/views/table-container';

import HeaderBlock from 'ember-table/views/header-block';

import template from 'ember-table/templates/header-container';

export default TableContainer.extend(ShowHorizontalScrollMixin, {
  template: template,

  headerBlock: HeaderBlock,

  classNames: ['ember-table-table-container', 'ember-table-fixed-table-container', 'ember-table-header-container'],
  height: Ember.computed.alias('controller._headerHeight'),
  width: Ember.computed.alias('controller._tableContainerWidth')
});
