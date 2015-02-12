import Ember from 'ember';

export default Ember.Object.extend({
  headerCellName: void 0,
  contentPath: void 0,
  minWidth: 25,
  maxWidth: void 0,
  savedWidth: 150,
  isResizable: true,
  isSortable: true,
  textAlign: 'text-align-right',
  canAutoResize: false,
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
  width: Ember.computed.oneWay('savedWidth'),
  resize: function(width) {
    this.set('savedWidth', width);
    return this.set('width', width);
  },
  nextColumn: null,
  prevColumn: null,
  isAtMinWidth: Ember.computed(function() {
    return this.get('width') === this.get('minWidth');
  }).property('width', 'minWidth'),
  isAtMaxWidth: Ember.computed(function() {
    return this.get('width') === this.get('maxWidth');
  }).property('width', 'maxWidth')
});
