import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('library', function() {
    this.route('clause', { path: '/cl/modal/:clause_id' });
    this.route('fullClause', { path: '/cl/:clause_id' }, function() {
      this.route('builder', function() {
        this.route('block', { path: '/bl/:block_id' });
      });
      this.route('readme');
      this.route('dashboard');
      this.route('sharing');
    });
  });
});

export default Router;
