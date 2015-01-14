import Ember from 'ember';

import StyleBindingsMixin from 'ember-table/mixins/style-bindings';
import ScrollHandlerMixin from 'ember-table/mixins/scroll-handler';

import ScrollPanel from 'ember-table/views/scroll-panel';

import template from 'ember-table/templates/scroll-container';

export default Ember.View.extend(StyleBindingsMixin, ScrollHandlerMixin, {
  template: template,

  scrollPanel: ScrollPanel,

  classNames: ['ember-table-scroll-container'],
  styleBindings: ['left', 'width', 'height'],
  scrollElementSelector: '.antiscroll-inner',
  width: Ember.computed.alias('controller._scrollContainerWidth'),
  height: 10,
  left: Ember.computed.alias('controller._fixedColumnsWidth'),
  scrollTop: Ember.computed.alias('controller._tableScrollTop'),
  scrollLeft: Ember.computed.alias('controller._tableScrollLeft'),
  didInsertElement: function() {
    this._super();
    return this.onScrollLeftDidChange();
  },
  onScroll: function(event) {
    this.set('scrollLeft', event.target.scrollLeft);
    return event.preventDefault();
  },
  onScrollLeftDidChange: Ember.observer(function() {
    var selector;
    selector = this.get('scrollElementSelector');
    return this.$(selector).scrollLeft(this.get('scrollLeft'));
  }, 'scrollLeft', 'scrollElementSelector')
});
