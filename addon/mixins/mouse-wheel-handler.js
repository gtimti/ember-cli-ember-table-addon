import Ember from 'ember';

export default Ember.Mixin.create({
  onMouseWheel: Ember.K,
  didInsertElement: function() {
    var _this = this;
    this._super();
    return this.$().bind('mousewheel', function(event, delta, deltaX, deltaY) {
      return Ember.run(_this, _this.onMouseWheel, event, delta, deltaX, deltaY);
    });
  },
  willDestroyElement: function() {
    var _ref;
    if ((_ref = this.$()) != null) {
      _ref.unbind('mousewheel');
    }
    return this._super();
  }
});
