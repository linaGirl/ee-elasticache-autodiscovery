
	
	var   Class 		= require('ee-class')
		, log 			= require('ee-log')
		, project 		= require('ee-project')
		, assert 		= require('assert');



	var   AutoDiscovery = require('../')
		, discovery;

	
	describe('The AutoDiscovery', function(){
		if (project.config && project.config.region) {
			// can only test local, it requires aws infrastructure
			it('should not throw when instantiated', function(){
				discovery = new AutoDiscovery(project.config);
			});

			it('should be able to discovery cluster nodes', function(done){
				this.timeout(20000);

				discovery.getNodes('staging-cache', function(err, data){
					if (err) done(err);
					else {
						assert(data);
						done();
					}
				});
			});

			it('should be able to report changes with a subscription', function(done){
				this.timeout(120000);

				discovery.subscribe('staging-cache', function(err, data){
					if (err) done(err);
					else {
						assert(data);
						done();
					}
				});
			});
		}
		else {
			it('should not throw when instantiated', function(){
				discovery = new AutoDiscovery({});
			});
		}
	});
	