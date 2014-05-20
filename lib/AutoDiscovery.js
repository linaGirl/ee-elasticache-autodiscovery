!function(){

	var   Class 		= require('ee-class')
		, log 			= require('ee-log')
		, AWS 			= require('aws-sdk')
		, type 			= require('ee-types')
		, Node 			= require('./Node');



	module.exports = new Class({

		init: function(options) {
			AWS.config.update({
				  region 		 	: options.region
				, accessKeyId 	 	: options.accessKey
				, secretAccessKey 	: options.secret
			});

			this.elasticache = new AWS.ElastiCache();
			
		}


		, getNodes: function(id, callback) {
			if (!type.string(id) || !id.length) callback(new Error('Cannot retreive nodes without a cluster id!'));
			else {

				this.elasticache.describeCacheClusters({
					  CacheClusterId 		: id
					, ShowCacheNodeInfo 	: true
				}, function(err, data) {
					var nodes = [];

					if (err) callback(err);
					else if(data) {
						if (data.CacheClusters && data.CacheClusters.length) {
							data.CacheClusters.forEach(function(cluster) {
								if (cluster && cluster.CacheNodes && cluster.CacheNodes.length) {
									cluster.CacheNodes.forEach(function(node) {
										if (node){
											if (node.CacheNodeStatus === 'available') {
												if (node.Endpoint) {
													nodes.push(new Node({
														  host: node.Endpoint.Address
														, port: node.Endpoint.Port
													}));
												}
											}
										}
									}.bind(this));
								}
							}.bind(this));
						}
						
						callback(null, nodes);
					}
					else callback(new Error('Failed to load node info from aws!'));
				}.bind(this));
			}
		}
	});
}();
