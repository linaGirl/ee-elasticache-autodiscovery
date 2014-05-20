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

			Class.define(this, '_subscriptions', Class({}));			
		}


		, subscribe: function(id, callback) {
			if (!this._subscriptions[id]){
				this._subscriptions[id] = {
					  callbacks: []
					, id: id
					, checksum: ''
					, nodes: []
					, interval: setInterval(function(){
						this._updateNodeInfo(this._subscriptions[id]);
					}.bind(this), 60000)
				};
			}

			this._subscriptions[id].callbacks.push(callback);
			this._updateNodeInfo(this._subscriptions[id]);
		}



		, _updateNodeInfo: function(config) {
			this.getNodes(config.id, function(err, nodeList){
				var checksum;

				if (err) this._invokeCallbacks(config.callbacks, err);
				else {
					checksum = JSON.stringify(nodeList.map(function(item){return item.toString();}));

					config.nodes = nodeList;

					if (config.checksum !== checksum) {
						this._invokeCallbacks(config.callbacks, null, nodeList);
					}

					config.checksum = checksum;
				}
			}.bind(this));
		}


		, _invokeCallbacks: function(callbacks, err, nodes) {
			callbacks.forEach(function(cb){
				cb(err, nodes);
			}.bind(this));
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
