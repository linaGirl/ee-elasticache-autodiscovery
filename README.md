# ee-elasticache-autodiscovery

Retreive Cache Nodes for AWS Elasticache

## installation

	npm ee-elasticache-autodiscovery

## build status

[![Build Status](https://travis-ci.org/eventEmitter/ee-elasticache-autodiscovery.png?branch=master)](https://travis-ci.org/eventEmitter/ee-elasticache-autodiscovery)


## usage

### Constructor

You need an AWS IAM user which is able to execute the «elasticache:DescribeCacheClusters» action

	var AutoDiscovery = require('ee-elasticache-autodiscovery');

	// instantiate with credentials
	var disocvery = new AutoDiscovery({
		  region 	 	: 'eu-west-1'
		, accessKey 	: ''
		, secret 		: ''
	});

### getNodes

lists all nodes which have the status «available» for a given cluster

	disocvery.getNodes('cluster-id', function(err, nodeList){

	});


### subscribe

You can subsribe for changes to the cluster. the callback is called as soon a node was removed or a new node was added. The nodes are polled once a minute.

	disocvery.subscribe('cluster-id', function(err, nodeList){

	});