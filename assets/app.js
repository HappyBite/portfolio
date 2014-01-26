function app(site) {	
	var siteId = site.id;
	var postType = 'portfolio-post';
	
	App = Ember.Application.create({
		ready: function() {},
		rootElement: '#application'
	});
	
//*****************************************************************************************
//
// Router
//
//*****************************************************************************************

	App.Router.map(function() {
		this.resource('posts', function() {
			this.resource('post', { path: '/post/:id/edit' });
			this.route('new');
		});
		this.route('settings',	{path:'/settings'});
	});
	
//*****************************************************************************************
//
// Controllers
//
//*****************************************************************************************

	// Controller for application
	App.ApplicationController = Ember.ObjectController.extend({});
	
	// Controller for app index list
	App.PostsIndexController = Ember.ObjectController.extend({pagetitle: 'Poster', showAddButton: true});
	
	// Controller for app list
	App.PostsController = Ember.ObjectController.extend({pagetitle: 'Poster'});

	// Controller for creating new app
	App.PostsNewController = Ember.ObjectController.extend({
		actions: {
			save: function(post) {
				var self = this;
				if(post.title.length == 0) {
					alert('Du måste ange en titel');
					return;
				}
				HemsidaOnline.Api.Post('/v1/sites/' + siteId + '/posts', post, function(data) {
					self.transitionToRoute('posts.index');
				});
			},
			filedialog: function(post) {
				
			}
		},
		pagetitle: 'Skapa post'
	});

	// Controller for editing a post
	App.PostController = Ember.ObjectController.extend({
		actions: {
			save: function(post) {
				var self = this;
				//post.set('options.namespace', post.options.namespace.replace(/ /g, '-').toLowerCase());
				HemsidaOnline.Api.Put('/v1/sites/' + siteId + '/posts/' + post.id, post, function(data) {
					self.transitionToRoute('posts.index');
				});
			},
			delete: function(post) {
				var self = this;
				if(confirm('Är du säker på att du vill ta bort den här posten?')) {
					HemsidaOnline.Api.Delete('/v1/sites/' + siteId + '/posts/' + post.id, function(data) {
						self.transitionToRoute('posts.index');
					});
				}
			}
		},
		pagetitle: 'Ändra post'
	});
	
	// Controller for settings
	App.SettingsController = Ember.ObjectController.extend({pagetitle: 'Inställningar'});

//*****************************************************************************************
//
// Routes
//
//*****************************************************************************************

	App.ApplicationRoute = Ember.Route.extend({});

	// Handle route for index page
	App.IndexRoute = Ember.Route.extend({
		beforeModel: function() {
			this.transitionTo('posts.index');
		}
	});
	
	// Handle route for index page
	App.PostsIndexRoute = Ember.Route.extend({
		model: function() {
			return App.Blog.findAll();
		}
	});

	// Handle route for post list
	App.PostsRoute = Ember.Route.extend({});

	// Handle route for post new
	App.PostsNewRoute = Ember.Route.extend({
		model: function() {
			return App.PostsNewModel.create({}).serialize();
			//return App.App.findById(-1);
		},
	});

	// Handle route for single app
	App.PostRoute = Ember.Route.extend({
		model: function(params) {
			return App.Blog.findById(params.id);
		}
	});

	// Handle route for settings
	App.SettingsRoute = Ember.Route.extend({
		model: function() {
			return null;
		}
	});

	App.ApplicationView = Ember.View.extend({
		classNameBindings: ['isUrgent'],
		isUrgent: function() {
			alert('');
			return true;
		}
	});
	
	Ember.View.reopen({
		didInsertElement: function() {
			//Ember.run.scheduleOnce('afterRender', this, function(){
    			//setTimeout('HemsidaOnline.Api.FixSize()', 50);
			//});
			Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
		},
		afterRenderEvent : function(){
			App.Blog.focus();
			HemsidaOnline.Native.FixSize();
			$('.file-dialog-button').unbind();
			$('.file-dialog-button').on('click', showDialog);
		}
	});
	
	App.SettingsView = Ember.View.extend({
		didInsertElement: function() {
			//Ember.run.scheduleOnce('afterRender', this, function(){
    		//	setTimeout('HemsidaOnline.Api.FixSize()', 50);
			//});
		}
	});

//*****************************************************************************************
//
// Classes
//
//*****************************************************************************************

	// Blog class
	App.Blog = Ember.Object.extend();
	App.Blog.reopenClass({
		findAll: function() {
			var postCollection = [];
			HemsidaOnline.Api.Get('/v1/sites/' + siteId + '/posts/' + postType, function(posts) {
				posts.forEach(function(post) {
					postCollection.pushObject(App.Blog.create(post));
				});
			});
			return postCollection;
		},
		findById: function(id) {
			if (!id) {
				return null;
			}
			return $.getJSON('/v1/apps/' + id).then(function(post) {
				return App.Blog.create(post);
			});
		},
		focus: function(id) {
			$('body input').first().focus();
		},
	});
	
//*****************************************************************************************
//
// Models
//
//*****************************************************************************************
	App.HeaderModel = Ember.Model.extend({
		showAddButton: function(app) {
			alert('')
		},
		serialize: function() {
			return this.getProperties(['showAddButton']);
		}
	});
	App.PostsNewModel = Ember.Model.extend({
		id: -1,
		title: '',
		post_type: postType,
		excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquamacnisi. Praesent varius tortor nec eros. Vestibulum sed enim atellussagittis tincidunt. Maecenas consectetur. Suspendisse eget augueatdiam suscipit varius.',
		content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquamacnisi. Praesent varius tortor nec eros. Vestibulum sed enim atellussagittis tincidunt. Maecenas consectetur. Suspendisse eget augueatdiam suscipit varius.',
		status: 'published',
		options:
		{
			image: '/global/images/icon/1.png',
		},
		isNew: function() {
			return this.id == -1;
		},
		serialize: function() {
			return this.getProperties(['id', 'title', 'post_type', 'excerpt', 'content', 'status', 'options', 'isNew']);
		}
	});
}

function showDialog(e) {
	//HemsidaOnline.Native.ShowDialog('files');
	HemsidaOnline.Native.Insert('image', e.target);
}

HemsidaOnline.Native.Init(function(data) {
	HemsidaOnline.Api.Get('/v1/sites/current', function(site) {
		app(site);
	});
});