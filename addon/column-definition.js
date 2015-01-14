export default Ember.Object.extend({
  headerCellName: void 0,
  contentPath: void 0,
  minWidth: void 0,
  maxWidth: void 0,
  defaultColumnWidth: 150,
  isResizable: true,
  isSortable: true,
  textAlign: 'text-align-right',
  canAutoResize: true,
  headerCellView: 'ember-table/header-cell',
  headerCellViewClass: Ember.computed.alias('headerCellView'),
  tableCellView: 'ember-table/table-cell',
  tableCellViewClass: Ember.computed.alias('tableCellView'),
  getCellContent: function(row) {
    var path;
    path = this.get('contentPath');
    Ember.assert("You must either provide a contentPath or override " + "getCellContent in your column definition", path != null);
    return Ember.get(row, path);
  },
  setCellContent: Ember.K,
  columnWidth: Ember.computed.oneWay('defaultColumnWidth'),
  resize: function(width) {
    return this.set('columnWidth', width);
  }
});
