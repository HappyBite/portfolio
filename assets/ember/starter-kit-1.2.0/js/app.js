App = Ember.Application.create();

App.Router.map(function() {
	this.route("apps");
});

App.IndexRoute = Ember.Route.extend({
		model: function() {
			return ['red', 'yellow', 'blue'];
		},
			renderTemplate: function() {
				this.render({ outlet: 'test' });
		}
});

App.AppsRoute = Ember.Route.extend({
	model: function() {
		return ['red', 'yellow', 'blue'];
	}
});