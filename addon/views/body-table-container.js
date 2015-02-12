import Ember from 'ember';

import MouseWheelHandlerMixin from 'ember-table/mixins/mouse-wheel-handler';
import TouchMoveHandlerMixin from 'ember-table/mixins/touch-move-handler';
import ScrollHandlerMixin from 'ember-table/mixins/scroll-handler';
import ShowHorizontalScrollMixin from 'ember-table/mixins/show-horizontal-scroll';

import TableContainer from 'ember-table/views/table-container';

import LazyTableBlock from 'ember-table/views/lazy-table-block';

import template from 'ember-table/_templates/body-container';

export default TableContainer.extend(MouseWheelHandlerMixin, TouchMoveHandlerMixin, ScrollHandlerMixin, ShowHorizontalScrollMixin, {
  template: template,

  lazyTableBlock: LazyTableBlock,

  classNames: ['ember-table-table-container', 'ember-table-body-container', 'antiscroll-wrap'],
  height: Ember.computed.alias('controller._bodyHeight'),
  width: Ember.computed.alias('controller._width'),
  scrollTop: Ember.computed.alias('controller._tableScrollTop'),
  scrollLeft: Ember.computed.alias('controller._tableScrollLeft'),
  scrollElementSelector: '.antiscroll-inner',
  onScroll: function(event) {
    this.set('scrollTop', event.target.scrollTop);
    return event.preventDefault();
  },
  onMouseWheel: function(event, delta, deltaX, deltaY) {
    var scrollLeft;
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      return;
    }
    scrollLeft = this.$('.ember-table-right-table-block').scrollLeft() + deltaX;
    this.set('scrollLeft', scrollLeft);
    return event.preventDefault();
  },
  onTouchMove: function(event, deltaX, deltaY) {
    var scrollLeft;
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      return;
    }
    scrollLeft = this.$('.ember-table-right-table-block').scrollLeft() + deltaX;
    this.set('scrollLeft', scrollLeft);
    return event.preventDefault();
  }
});
