import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('library', { path: '/lib/:library_id'}, function() {
    this.route('fullClause', { path: '/cl/:clause_id' }, function() {
      this.route('builder', function() {
        this.route('block', { path: '/bl/:block_id' });
      });
      this.route('readme');
      this.route('dashboard');
      this.route('sharing');
    });
    this.route('clauses');
    this.route('settings');
    this.route('apptemplate', { path: '/tm/:apptemplate_id' }, function() {
      this.route('text');
      this.route('notepad');
      this.route('editor');
    });
  });
  this.route('login');
  this.route('profile');
  this.route('admin', function() {
    this.route('users');
    this.route('clauses');
  });
  this.route('groups', function() {
    this.route('group', {path: '/group/:group_id'});
  });
  this.route('group-library', { path: '/shared-library/:group_id'}, function() {
    this.route('settings');
  });
});

export default Router;
