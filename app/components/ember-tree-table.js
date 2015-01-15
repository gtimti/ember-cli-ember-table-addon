import Ember from 'ember';

import Table from 'ember-table/table';
import TreeRow from 'ember-table/tree-row';

var get = Ember.get;

export default Table.extend({
  isCollapsed: false,
  selection: null,

  actions: {
    toggleTableCollapse: function() {
      var roots, isCollapsed;
      this.toggleProperty('isCollapsed');
      isCollapsed = this.get('isCollapsed');
      roots = this.get('roots');
      if (!(roots && roots.get('length') > 0)) {
        return;
      }
      roots.forEach(function(root) {
        root.recursiveCollapse(isCollapsed);
      });
      this.notifyPropertyChange('rows');
    },
    toggleCollapse: function(row) {
      row.toggleProperty('isCollapsed');

      Ember.run.next(this, function() {
        this.notifyPropertyChange('rows');
      });
    }
  },

  roots: Ember.computed(function() {
    var _this = this,
        content = get(this, 'content');

    return (content || []).map(function(item){
      return _this.createTree(null, item);
    });
  }).property('content'),

  rows: Ember.computed(function() {
    var _this = this,
        roots = get(this, 'roots'),
        rows = Ember.A(),
        maxGroupingLevel = get(this, 'maxGroupingLevel');

    if (!roots) {
      return rows;
    }

    roots.forEach(function(root){
      _this.flattenTree(null, root, rows);
      _this.computeStyles(null, root);
    });

    rows.forEach(function(row) {
      row.computeRowStyle(maxGroupingLevel);
    });

    return rows;
  }).property('roots'),

  bodyContent: Ember.computed(function() {
    var rows = this.get('rows');

    if (!rows) {
      return Ember.A();
    }

    return rows.filterProperty('isShowing');
  }).property('rows'),

  createTree: function(parent, node) {
    var _this = this,
        row = TreeRow.create(),
        children = (node.children || []).map(function(child) {
          return _this.createTree(row, child);
        });

    row.setProperties({
      isRoot: !parent,
      isLeaf: Ember.isEmpty(children),
      content: node,
      parent: parent,
      children: children,
      groupName: node.key,
      isCollapsed: false
    });

    return row;
  },

  flattenTree: function(parent, node, rows) {
    var _this = this;
    rows.pushObject(node);
    (node.children || []).forEach(function(child) {
      return _this.flattenTree(node, child, rows);
    });
    return rows;
  },

  computeStyles: function(parent, node) {
    var _this = this;
    node.computeStyles(parent);

    return node.get('children').forEach(function(child) {
      _this.computeStyles(node, child);
    });
  }
});
