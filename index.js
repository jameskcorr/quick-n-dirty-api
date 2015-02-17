var mongoskin = require('mongoskin');
var ObjectID = require('mongoskin').ObjectID;

module.exports = function (app, dbPath) {
	var db = mongoskin.db('mongodb://@' + dbPath, {safe:true});
	var collections;
	db.collection("system.indexes").find({},{"ns":1}).toArray(function(e, results) {
		if (e) return next(e);
		global.collections = new Array();
		for (var i=0;i<results.length;i++) {
			var collectionName = results[i].ns.substr(1).split('.');
			(global.collections).push(collectionName[1]);
		}
		for (var i=0;i<(global.collections).length;i++) {
			app.route('/' + global.collections[i])
				.get(read)
				.post(create);
			app.route('/' + global.collections[i] + '/:id')
				.get(read)
				.put(update)
				.delete(remove);
		}
	});

	var create = function(req, cb) {
		var url = req.route.path.substr(1).split('/');
		var collection = (url.length == 3) ? url[2] : url[0];
		db.collection(collection).insert(req.body, {}, function(e, results) {
			if (e) return next(e);
			var obj = {"_id": results[0]._id};
			cb.status(200).json(Array(obj));
		});
	};

	var read = function(req, cb) {
		var url = req.route.path.substr(1).split('/');
		var collection = url[0];
		if (url.length == 2) {
			db.collection(collection).findById(req.params.id, function(e, results) {
				if (e) return next(e);
				if (null === results) {
					cb.status(400).send(collection + ' object (id: ' + req.params.id +') does not exist');
				} else {
					cb.json(Array(results)).status(200);
				}
			});
		} else {
			db.collection(collection).find({}).toArray(function(e, results) {
				if (e) return next(e);
				cb.json(results).status(200);
			});
		}
	};

	var update = function(req, cb) {
		var url = req.route.path.substr(1).split('/');
		var collection = url[0];
		db.collection(collection).updateById(ObjectID(req.params.id), {$set:req.body}, function(e, results) {
			if (e) return next(e);
			cb.sendStatus(204);
		});
	};

	var remove = function(req, cb) {
		var url = req.route.path.substr(1).split('/');
		var collection = url[0];
		db.collection(collection).findById(req.params.id, function(e, results) {
			if (e) return next(e);
			if (null === results) {
				cb.status(400).send(collection + ' object (id: ' + req.params.id +') does not exit');
			} else {
				db.collection(collection).removeById(req.params.id, function(e, results) {
					if (e) return next(e);
					cb.sendStatus(204);
				});
			}
		});
	};
};