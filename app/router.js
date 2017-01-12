import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('library', function() {
    this.route('fullClause', { path: '/cl/:clause_id' }, function() {
      this.route('builder', function() {
        this.route('block', { path: '/bl/:block_id' });
      });
      this.route('readme');
      this.route('dashboard');
      this.route('sharing');
    });
  });
  this.route('login');
  this.route('profile');
  this.route('admin', function() {
    this.route('users');
    this.route('clauses');
  });
  this.route('group', { path: '/group/:group_id'});
  this.route('groups');
});

export default Router;
