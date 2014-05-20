# ee-elasticache-autodiscovery

Retreive Cache Nodes for AWS Elasticache

## installation

	npm ee-elasticache-autodiscovery

## build status

[![Build Status](https://travis-ci.org/eventEmitter/ee-elasticache-autodiscovery.png?branch=master)](https://travis-ci.org/eventEmitter/ee-elasticache-autodiscovery)


## usage


	var AutoDiscovery = require('ee-elasticache-autodiscovery');

	// instantiate with credentials
	var disocvery = new AutoDiscovery({
		  region 	 	: 'eu-west-1'
		, accessKey 	: ''
		, secret 		: ''
	});


	disocvery.getNodes('cluster-id', function(err, nodeList){
		
	});