import Ember from 'ember';
import StyleBindingsMixin from 'ember-table/mixins/style-bindings';
import ResizeHandlerMixin from 'ember-table/mixins/resize-handler';

import RowArrayController from 'ember-table/controllers/row-array';
import Row from 'ember-table/row';

import HeaderTableContainer from 'ember-table/views/header-table-container';
import BodyTableContainer from 'ember-table/views/body-table-container';
import FooterTableContainer from 'ember-table/views/footer-table-container';
import ScrollContainer from 'ember-table/views/scroll-container';
import ColumnSortableIndicator from 'ember-table/views/column-sortable-indicator';

import layout from 'ember-table/_templates/layout';

export default Ember.Component.extend(StyleBindingsMixin, ResizeHandlerMixin, {

  headerTableContainer: HeaderTableContainer,
  bodyTableContainer: BodyTableContainer,
  footerTableContainer: FooterTableContainer,
  scrollContainer: ScrollContainer,
  columnSortableIndicator: ColumnSortableIndicator,

  layout: layout,
  classNames: ['ember-table-tables-container'],
  classNameBindings: ['enableContentSelection:ember-table-content-selectable'],
  styleBindings: ['height'],
  content: null,
  columns: null,
  numFixedColumns: 0,
  numFooterRow: 0,
  rowHeight: 30,
  minHeaderHeight: 30,
  footerHeight: 30,
  hasHeader: true,
  hasFooter: true,
  enableColumnReorder: true,
  enableContentSelection: false,
  columnMode: 'standard',
  selectionMode: 'single',
  selection: Ember.computed(function(key, val) {
    var content, rowToAdd, _i, _len, _ref, _ref1;
    if (arguments.length > 1 && val) {
      if (this.get('selectionMode') === 'single') {
        this.get('persistedSelection').clear();
        rowToAdd = this.findRow(val);
        if (rowToAdd) {
          this.get('persistedSelection').addObject(rowToAdd);
        }
      } else {
        this.get('persistedSelection').clear();
        for (_i = 0, _len = val.length; _i < _len; _i++) {
          content = val[_i];
          rowToAdd = this.findRow(content);
          if (rowToAdd) {
            this.get('persistedSelection').addObject(rowToAdd);
          }
        }
      }
      this.get('rangeSelection').clear();
    }
    if (this.get('selectionMode') === 'single') {
      return (_ref = this.get('_selection')) != null ? (_ref1 = _ref[0]) != null ? _ref1.get('content') : void 0 : void 0;
    } else {
      return this.get('_selection').map(function(row) {
        return row.get('content');
      });
    }
  }).property('_selection.[]', 'selectionMode'),
  columnsFillTable: true,
  init: function() {
    this._super();
    if (!$.ui) {
      throw 'Missing dependency: jquery-ui';
    }
    if (!$().mousewheel) {
      throw 'Missing dependency: jquery-mousewheel';
    }
    if (!$().antiscroll) {
      throw 'Missing dependency: antiscroll.js';
    }
  },
  actions: {
    addColumn: Ember.K,
    sortByColumn: Ember.K
  },
  height: Ember.computed.alias('_tablesContainerHeight'),
  tableRowView: 'ember-table/table-row',
  tableRowViewClass: Ember.computed.alias('tableRowView'),
  onColumnSort: function(column, newIndex) {
    var columns;
    columns = this.get('tableColumns');
    columns.removeObject(column);
    columns.insertAt(newIndex, column);
    return this.prepareTableColumns();
  },
  bodyContent: Ember.computed(function() {
    return RowArrayController.create({
      target: this,
      parentController: this,
      container: this.get('container'),
      itemController: Row,
      content: this.get('content')
    });
  }).property('content'),
  footerContent: Ember.computed(function(key, value) {
    if (value) {
      return value;
    } else {
      return Ember.A();
    }
  }).property(),
  fixedColumns: Ember.computed(function() {
    var columns, numFixedColumns;
    columns = this.get('columns');
    if (!columns) {
      return Ember.A();
    }
    numFixedColumns = this.get('numFixedColumns') || 0;
    columns = columns.slice(0, numFixedColumns) || [];
    this.prepareTableColumns();
    return columns;
  }).property('columns.@each', 'numFixedColumns'),
  tableColumns: Ember.computed(function() {
    var columns, numFixedColumns;
    columns = this.get('columns');
    if (!columns) {
      return Ember.A();
    }
    numFixedColumns = this.get('numFixedColumns') || 0;
    columns = columns.slice(numFixedColumns, columns.get('length')) || [];
    this.prepareTableColumns();
    return columns;
  }).property('columns.@each', 'numFixedColumns'),
  allColumns: Ember.computed.union('fixedColumns', 'tableColumns'),
  prepareTableColumns: function() {
    var col, columns, i, _i, _len, _results;
    columns = this.get('columns') || Ember.A();
    columns.setEach('controller', this);
    _results = [];
    for (i = _i = 0, _len = columns.length; _i < _len; i = ++_i) {
      col = columns[i];
      _results.push(col.set('nextResizableColumn', this.getNextResizableColumn(columns, i)));
    }
    return _results;
  },
  getNextResizableColumn: function(columns, index) {
    var column;
    while (index < columns.length) {
      index += 1;
      column = columns.objectAt(index);
      if (column != null ? column.get('isResizable') : void 0) {
        return column;
      }
    }
    return null;
  },
  didInsertElement: function() {
    this._super();
    this.set('_tableScrollTop', 0);
    Ember.run.next(this, this.elementSizeDidChange);
    return this.doForceFillColumns();
  },
  onResizeEnd: function() {
    if (this.tableWidthNowTooSmall()) {
      this.set('columnsFillTable', true);
    }
    return Ember.run(this, this.elementSizeDidChange);
  },
  elementSizeDidChange: function() {
    if ((this.get('_state') || this.get('state')) !== 'inDOM') {
      return;
    }
    this.set('_width', this.$().parent().outerWidth());
    this.set('_height', this.$().parent().outerHeight());
    return Ember.run.next(this, this.updateLayout);
  },
  tableWidthNowTooSmall: function() {
    var newTableWidth, oldTableWidth, totalColumnWidth;
    oldTableWidth = this.get('_width');
    newTableWidth = this.$().parent().outerWidth();
    totalColumnWidth = this._getTotalWidth(this.get('tableColumns'));
    return (oldTableWidth > totalColumnWidth) && (newTableWidth < totalColumnWidth);
  },
  expandResizeableColumnsToFillTable: function() {
    var fixedColumnsWidth, tableColumns, totalResizableWidth, totalWidth, unresizableColumns, unresizableWidth;
    totalWidth = this.get('_width');
    fixedColumnsWidth = this.get('_fixedColumnsWidth');
    tableColumns = this.get('tableColumns');
    unresizableColumns = tableColumns.filterProperty('canAutoResize', false);
    unresizableWidth = this._getTotalWidth(unresizableColumns);
    return totalResizableWidth = totalWidth - unresizableWidth;
  },
  updateLayout: function() {
    if ((this.get('_state') || this.get('state')) !== 'inDOM') {
      return;
    }
    this.$('.antiscroll-wrap').antiscroll().data('antiscroll').rebuild();
    if (this.get('columnsFillTable')) {
      return this.doForceFillColumns();
    }
  },
  doForceFillColumns: function() {
    var allColumns, availableWidth, columnsToResize, doNextLoop, nextColumnsToResize, totalResizableWidth, unresizableColumns, _results;
    allColumns = this.get('allColumns');
    columnsToResize = allColumns.filterProperty('canAutoResize');
    unresizableColumns = allColumns.filterProperty('canAutoResize', false);
    availableWidth = this.get('_width') - this._getTotalWidth(unresizableColumns);
    doNextLoop = true;
    _results = [];
    while (doNextLoop) {
      doNextLoop = false;
      nextColumnsToResize = [];
      totalResizableWidth = this._getTotalWidth(columnsToResize);
      columnsToResize.forEach(function() {
        return function(column) {
          var newWidth;
          newWidth = Math.floor((column.get('width') / totalResizableWidth) * availableWidth);
          if (newWidth < column.get('minWidth')) {
            doNextLoop = true;
            column.set('width', column.get('minWidth'));
            return availableWidth -= column.get('width');
          } else if (newWidth > column.get('maxWidth')) {
            doNextLoop = true;
            column.set('width', column.get('maxWidth'));
            return availableWidth -= column.get('width');
          } else {
            column.set('width', newWidth);
            return nextColumnsToResize.pushObject(column);
          }
        };
      });
      _results.push(columnsToResize = nextColumnsToResize);
    }
    return _results;
  },
  onBodyContentLengthDidChange: Ember.observer(function() {
    return Ember.run.next(this, function() {
      return Ember.run.once(this, this.updateLayout);
    });
  }, 'bodyContent.length'),
  _tableScrollTop: 0,
  _tableScrollLeft: 0,
  _width: null,
  _height: null,
  _contentHeaderHeight: null,
  _hasVerticalScrollbar: Ember.computed(function() {
    var contentHeight, height;
    height = this.get('_height');
    contentHeight = this.get('_tableContentHeight') + this.get('_headerHeight') + this.get('_footerHeight');
    if (height < contentHeight) {
      return true;
    } else {
      return false;
    }
  }).property('_height', '_tableContentHeight', '_headerHeight', '_footerHeight'),
  _hasHorizontalScrollbar: Ember.computed(function() {
    var contentWidth, tableWidth;
    contentWidth = this.get('_tableColumnsWidth');
    tableWidth = this.get('_width') - this.get('_fixedColumnsWidth');
    if (contentWidth > tableWidth) {
      return true;
    } else {
      return false;
    }
  }).property('_tableColumnsWidth', '_width', '_fixedColumnsWidth'),
  _tablesContainerHeight: Ember.computed(function() {
    var contentHeight, height;
    height = this.get('_height');
    contentHeight = this.get('_tableContentHeight') + this.get('_headerHeight') + this.get('_footerHeight');
    if (contentHeight < height) {
      return contentHeight;
    } else {
      return height;
    }
  }).property('_height', '_tableContentHeight', '_headerHeight', '_footerHeight'),
  _fixedColumnsWidth: Ember.computed(function() {
    return this._getTotalWidth(this.get('fixedColumns'));
  }).property('fixedColumns.@each.width'),
  _tableColumnsWidth: Ember.computed(function() {
    var availableWidth, contentWidth;
    contentWidth = this._getTotalWidth(this.get('tableColumns')) + 3;
    availableWidth = this.get('_width') - this.get('_fixedColumnsWidth');
    if (contentWidth > availableWidth) {
      return contentWidth;
    } else {
      return availableWidth;
    }
  }).property('tableColumns.@each.width', '_width', '_fixedColumnsWidth'),
  _rowWidth: Ember.computed(function() {
    var columnsWidth, nonFixedTableWidth;
    columnsWidth = this.get('_tableColumnsWidth');
    nonFixedTableWidth = this.get('_tableContainerWidth') - this.get('_fixedColumnsWidth');
    if (columnsWidth < nonFixedTableWidth) {
      return nonFixedTableWidth;
    }
    return columnsWidth;
  }).property('_fixedColumnsWidth', '_tableColumnsWidth', '_tableContainerWidth'),
  _headerHeight: Ember.computed(function() {
    var contentHeaderHeight, minHeight;
    minHeight = this.get('minHeaderHeight');
    contentHeaderHeight = this.get('_contentHeaderHeight');
    if (contentHeaderHeight < minHeight) {
      return minHeight;
    } else {
      return contentHeaderHeight;
    }
  }).property('_contentHeaderHeight', 'minHeaderHeight'),
  _footerHeight: Ember.computed(function() {
    if (this.get('hasFooter')) {
      return this.get('footerHeight');
    } else {
      return 0;
    }
  }).property('footerHeight', 'hasFooter'),
  _bodyHeight: Ember.computed(function() {
    var bodyHeight;
    bodyHeight = this.get('_tablesContainerHeight');
    if (this.get('hasHeader')) {
      bodyHeight -= this.get('_headerHeight');
    }
    if (this.get('hasFooter')) {
      bodyHeight -= this.get('footerHeight');
    }
    return bodyHeight;
  }).property('_tablesContainerHeight', '_hasHorizontalScrollbar', '_headerHeight', 'footerHeight', 'hasHeader', 'hasFooter'),
  _tableBlockWidth: Ember.computed(function() {
    return this.get('_width') - this.get('_fixedColumnsWidth');
  }).property('_width', '_fixedColumnsWidth'),
  _fixedBlockWidthBinding: '_fixedColumnsWidth',
  _tableContentHeight: Ember.computed(function() {
    return this.get('rowHeight') * this.get('bodyContent.length');
  }).property('rowHeight', 'bodyContent.length'),
  _tableContainerWidth: Ember.computed(function() {
    return this.get('_width');
  }).property('_width'),
  _scrollContainerWidth: Ember.computed(function() {
    return this.get('_width') - this.get('_fixedColumnsWidth');
  }).property('_width', '_fixedColumnsWidth'),
  _numItemsShowing: Ember.computed(function() {
    return Math.floor(this.get('_bodyHeight') / this.get('rowHeight'));
  }).property('_bodyHeight', 'rowHeight'),
  _startIndex: Ember.computed(function() {
    var index, numContent, numViews, rowHeight, scrollTop;
    numContent = this.get('bodyContent.length');
    numViews = this.get('_numItemsShowing');
    rowHeight = this.get('rowHeight');
    scrollTop = this.get('_tableScrollTop');
    index = Math.floor(scrollTop / rowHeight);
    if (index + numViews >= numContent) {
      index = numContent - numViews;
    }
    if (index < 0) {
      return 0;
    } else {
      return index;
    }
  }).property('bodyContent.length', '_numItemsShowing', 'rowHeight', '_tableScrollTop'),
  _getTotalWidth: function(columns, columnWidthPath) {
    var widths;
    if (columnWidthPath == null) {
      columnWidthPath = 'width';
    }
    if (!columns) {
      return 0;
    }
    widths = columns.getEach(columnWidthPath) || [];
    return widths.reduce((function(total, w) {
      return total + w;
    }), 0);
  },
  isSelected: function(row) {
    return this.get('_selection').contains(row);
  },
  setSelected: function(row, val) {
    this.persistSelection();
    if (val) {
      return this.get('persistedSelection').addObject(row);
    } else {
      return this.get('persistedSelection').removeObject(row);
    }
  },
  persistedSelection: Ember.computed(function() {
    return Ember.A();
  }),
  rangeSelection: Ember.computed(function() {
    return Ember.A();
  }),
  _selection: Ember.computed(function() {
    return this.get('persistedSelection').copy().addObjects(this.get('rangeSelection'));
  }).property('persistedSelection.[]', 'rangeSelection.[]'),
  click: function(event) {
    var curIndex, lastIndex, maxIndex, minIndex, row;
    row = this.getRowForEvent(event);
    if (!row) {
      return;
    }
    if (this.get('selectionMode') === 'none') {
      return;
    }
    if (this.get('selectionMode') === 'single') {
      this.get('persistedSelection').clear();
      return this.get('persistedSelection').addObject(row);
    } else {
      if (event.shiftKey) {
        this.get('rangeSelection').clear();
        lastIndex = this.rowIndex(this.get('lastSelected'));
        curIndex = this.rowIndex(this.getRowForEvent(event));
        minIndex = Math.min(lastIndex, curIndex);
        maxIndex = Math.max(lastIndex, curIndex);
        return this.get('rangeSelection').addObjects(this.get('bodyContent').slice(minIndex, maxIndex + 1));
      } else {
        if (!event.ctrlKey && !event.metaKey) {
          this.get('persistedSelection').clear();
          this.get('rangeSelection').clear();
        } else {
          this.persistSelection();
        }
        if (this.get('persistedSelection').contains(row)) {
          this.get('persistedSelection').removeObject(row);
        } else {
          this.get('persistedSelection').addObject(row);
        }
        return this.set('lastSelected', row);
      }
    }
  },
  findRow: function(content) {
    var row, _i, _len, _ref;
    _ref = this.get('bodyContent');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      row = _ref[_i];
      if (row.get('content') === content) {
        return row;
      }
    }
  },
  rowIndex: function(row) {
    var _ref;
    return (_ref = this.get('bodyContent')) != null ? _ref.indexOf(row) : void 0;
  },
  persistSelection: function() {
    this.get('persistedSelection').addObjects(this.get('rangeSelection'));
    return this.get('rangeSelection').clear();
  },
  getRowForEvent: function(event) {
    var $rowView, view;
    $rowView = $(event.target).parents('.ember-table-table-row');
    view = Ember.View.views[$rowView.attr('id')];
    if (view) {
      return view.get('row');
    }
  }
});
