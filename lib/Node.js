!function(){

	var   Class 		= require('ee-class')
		, log 			= require('ee-log');



	module.exports = new Class({

		init: function(options) {
			Class.define(this, 'host', Class(options.host).Enumerable());
			Class.define(this, 'port', Class(options.port).Enumerable());			
		}


		, toString: function() {
			return this.host + ':' + this.port;
		} 
	});
}();
