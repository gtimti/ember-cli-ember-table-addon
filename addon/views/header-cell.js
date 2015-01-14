import Ember from 'ember';

import StyleBindingsMixin from 'ember-table/mixins/style-bindings';

import template from 'ember-table/templates/header-cell';

export default Ember.View.extend(StyleBindingsMixin, {
  template: template,
  classNames: ['ember-table-cell', 'ember-table-header-cell'],
  classNameBindings: ['column.isSortable:sortable', 'column.textAlign'],
  styleBindings: ['width', 'height'],
  column: Ember.computed.alias('content'),
  width: Ember.computed.alias('column.columnWidth'),
  height: Ember.computed(function() {
    return this.get('controller._headerHeight');
  }).property('controller._headerHeight'),
  resizableOption: Ember.computed(function() {
    return {
      handles: 'e',
      minHeight: 40,
      minWidth: this.get('column.minWidth') || 100,
      maxWidth: this.get('column.maxWidth') || 500,
      grid: this.get('column.snapGrid'),
      resize: jQuery.proxy(this.onColumnResize, this),
      stop: jQuery.proxy(this.onColumnResize, this)
    };
  }),
  didInsertElement: function() {
    this.elementSizeDidChange();
    if (this.get('column.isResizable')) {
      this.$().resizable(this.get('resizableOption'));
      this._resizableWidget = this.$().resizable('widget');
    }
  },
  onColumnResize: function(event, ui) {
    this.elementSizeDidChange();
    if (this.get('controller.forceFillColumns') && this.get('controller.columns').filterProperty('canAutoResize').length > 1) {
      this.set('column.canAutoResize', false);
    }
    return this.get("column").resize(ui.size.width);
  },
  elementSizeDidChange: function() {
    var maxHeight;
    maxHeight = 0;
    $('.ember-table-header-block .ember-table-content').each(function() {
      var thisHeight;
      thisHeight = $(this).outerHeight();
      if (thisHeight > maxHeight) {
        maxHeight = thisHeight;
      }
    });
    this.set('controller._contentHeaderHeight', maxHeight);
  }
});
