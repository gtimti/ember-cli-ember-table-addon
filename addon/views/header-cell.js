import Ember from 'ember';

import StyleBindingsMixin from 'ember-table/mixins/style-bindings';

import template from 'ember-table/_templates/header-cell';

export default Ember.View.extend(StyleBindingsMixin, {
  template: template,

  classNames: ['ember-table-cell', 'ember-table-header-cell'],
  classNameBindings: ['column.isSortable:sortable', 'column.textAlign'],
  styleBindings: ['width', 'height'],
  column: Ember.computed.alias('content'),
  width: Ember.computed.alias('column.width'),
  minWidth: Ember.computed.alias('column.minWidth'),
  maxWidth: Ember.computed.alias('column.maxWidth'),
  nextResizableColumn: Ember.computed.alias('column.nextResizableColumn'),
  height: Ember.computed.alias('controller._headerHeight'),
  effectiveMinWidth: Ember.computed(function() {
    var nextColumnMaxDiff;
    if (this.get('controller.columnMode') === 'standard') {
      return this.get('minWidth');
    }
    nextColumnMaxDiff = this.get('nextResizableColumn.maxWidth') - this.get('nextResizableColumn.width');
    if (this.get('minWidth') && nextColumnMaxDiff) {
      return Math.min(this.get('minWidth'), this.get('width') - nextColumnMaxDiff);
    } else if (this.get('minWidth')) {
      return this.get('minWidth');
    } else {
      return this.get('width') - nextColumnMaxDiff;
    }
  }).property('width', 'minWidth', 'controller.columnMode', 'nextResizableColumn.{width,maxWidth}'),
  effectiveMaxWidth: Ember.computed(function() {
    var nextColumnMaxDiff;
    if (this.get('controller.columnMode') === 'standard') {
      return this.get('maxWidth');
    }
    nextColumnMaxDiff = this.get('nextResizableColumn.width') - this.get('nextResizableColumn.minWidth');
    if (this.get('maxWidth') && !Ember.isNone(nextColumnMaxDiff)) {
      return Math.min(this.get('maxWidth'), this.get('width') + nextColumnMaxDiff);
    } else if (this.get('maxWidth')) {
      return this.get('maxWidth');
    } else {
      return this.get('width') + nextColumnMaxDiff;
    }
  }).property('width', 'minWidth', 'controller.columnMode', 'nextResizableColumn.{width,minWidth}'),
  resizableOption: Ember.computed(function() {
    return {
      handles: 'e',
      minWidth: Math.max(this.get('effectiveMinWidth') || 0, 10),
      maxWidth: this.get('effectiveMaxWidth'),
      grid: this.get('column.snapGrid'),
      resize: Ember.$.proxy(this.onColumnResize, this),
      stop: Ember.$.proxy(this.onColumnResize, this)
    };
  }).property('effectiveMinWidth', 'effectiveMaxWidth'),
  didInsertElement: function() {
    this.elementSizeDidChange();
    return this.recomputeResizableHandle();
  },
  _isResizable: Ember.computed(function() {
    if (this.get('controller.columnMode') === 'standard') {
      return this.get('column.isResizable');
    } else {
      return this.get('column.isResizable') && this.get('nextResizableColumn');
    }
  }).property('column.isResizable', 'controller.columnMode', 'nextResizableColumn'),
  resizableObserver: Ember.observer(function() {
    return this.recomputeResizableHandle();
  }, '_isResizable', 'resizableOption'),
  onColumnResize: function(event, ui) {
    var diff;
    if (this.get('controller.columnMode') === 'standard') {
      this.get('column').resize(ui.size.width);
      this.set('controller.columnsFillTable', false);
    } else {
      diff = this.get('width') - ui.size.width;
      this.get('column').resize(ui.size.width);
      this.get('nextResizableColumn').resize(this.get('nextResizableColumn.width') + diff);
    }
    this.elementSizeDidChange();
    if (event.type === 'resizestop') {
      this.get('controller').elementSizeDidChange();
    }
  },
  elementSizeDidChange: function() {
    var maxHeight;
    maxHeight = 0;
    $('.ember-table-header-block .ember-table-content').each(function() {
      var thisHeight;
      thisHeight = $(this).outerHeight();
      if (thisHeight > maxHeight) {
        return maxHeight = thisHeight;
      }
    });
    return this.set('controller._contentHeaderHeight', maxHeight);
  },
  recomputeResizableHandle: function() {
    if (this.get('_isResizable')) {
      return this.$().resizable(this.get('resizableOption'));
    } else {
      if (this.$().is('.ui-resizable')) {
        return this.$().resizable('destroy');
      }
    }
  }
});
