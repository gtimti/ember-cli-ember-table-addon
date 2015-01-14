import HeaderRow  from 'ember-table/views/header-row';
import TableRow   from 'ember-table/views/table-row';
import HeaderCell from 'ember-table/views/header-cell';
import TableCell  from 'ember-table/views/table-cell';

export default {
  name: 'ember-table',

  initialize: function(container, app) {
    app.register('view:ember-table/header-row', HeaderRow);
    app.register('view:ember-table/table-row',  TableRow);
    app.register('view:ember-table/header-cell',HeaderCell);
    app.register('view:ember-table/table-cell', TableCell);
  }
};
