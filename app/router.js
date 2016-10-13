import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('library', function() {
    this.route('clause', { path: '/clause/:clause_id' });
  });
});

export default Router;
