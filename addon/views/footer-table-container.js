import Ember from 'ember';

import MouseWheelHandlerMixin from 'ember-table/mixins/mouse-wheel-handler';
import TouchMoveHandlerMixin from 'ember-table/mixins/touch-move-handler';
import ShowHorizontalScrollMixin from 'ember-table/mixins/show-horizontal-scroll';

import TableContainer from 'ember-table/views/table-container';

import TableBlock from 'ember-table/views/table-block';

import template from 'ember-table/templates/footer-container';

export default TableContainer.extend(MouseWheelHandlerMixin, TouchMoveHandlerMixin, ShowHorizontalScrollMixin, {
  template: template,

  tableBlock: TableBlock,

  classNames: ['ember-table-table-container', 'ember-table-fixed-table-container', 'ember-table-footer-container'],
  styleBindings: 'top',
  height: Ember.computed.alias('controller.footerHeight'),
  width: Ember.computed.alias('controller._tableContainerWidth'),
  scrollLeft: Ember.computed.alias('controller._tableScrollLeft'),
  top: Ember.computed(function() {
    var bodyHeight, contentHeight, headerHeight;
    headerHeight = this.get('controller._headerHeight');
    contentHeight = this.get('controller._tableContentHeight') + headerHeight;
    bodyHeight = this.get('controller._bodyHeight') + headerHeight;
    if (contentHeight < bodyHeight) {
      return contentHeight;
    } else {
      return bodyHeight;
    }
  }).property('controller._bodyHeight', 'controller._headerHeight', 'controller._tableContentHeight'),
  onMouseWheel: function(event, delta, deltaX, deltaY) {
    var scrollLeft;
    scrollLeft = this.$('.ember-table-right-table-block').scrollLeft() + deltaX;
    this.set('scrollLeft', scrollLeft);
    return event.preventDefault();
  },
  onTouchMove: function(event, deltaX, deltaY) {
    var scrollLeft;
    scrollLeft = this.$('.ember-table-right-table-block').scrollLeft() + deltaX;
    this.set('scrollLeft', scrollLeft);
    return event.preventDefault();
  }
});
