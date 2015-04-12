var mongodb = require('mongodb');
var bodyParser = require('body-parser');

module.exports = function(app, dbPath) {

	app.use(bodyParser.urlencoded({'extended':'true'}));
	app.use(bodyParser.json());

	var ObjectID = mongodb.ObjectID;
	mongodb.MongoClient.connect('mongodb://@' + dbPath, {safe:true}, function(e, db) {

		if (e) {
			console.log(e);
			return;
		}

		var collections = [];
		db.collection("system.indexes").find({},{"ns":1}).toArray(function(e, results) {
			if (e) {
				console.log(e);
			} else {
				for (var i=0;i<results.length;i++) {
					var collectionName = results[i].ns.substr(1).split('.');
					collections.push(collectionName[1]);
				}
				for (var i=0;i<collections.length;i++) {
					app.route('/' + collections[i])
						.get(read)
						.post(create);
					app.route('/' + collections[i] + '/:id')
						.get(read)
						.put(update)
						.delete(remove);
				}
			}
		});

		var create = function(req, cb, next) {
			var url = req.route.path.substr(1).split('/');
			var collection = url[0];
			db.collection(collection).insert(req.body, function(e, results) {
				if (e) next(e);
				else cb.status(200).json(results[0]);
			});
		};

		var read = function(req, cb, next) {
			var url = req.route.path.substr(1).split('/');
			var collection = url[0];

			var query = {};
			if (url.length == 2) {
				if (!ObjectID.isValid(req.params.id)) {
					cb.status(404).send(notFound(collection, req.params.id));
					return;
				}
				query._id = ObjectID(req.params.id);
			}

			db.collection(collection).find(query).toArray(function(e, results) {
				if (e) {
					next(e);
				} else if (results.length < 1) {
					if (url.length == 2) {
						cb.status(404).send(notFound(collection, req.params.id));
					} else {
						cb.status(200).json(results);
					}
				} else {
					cb.status(200).json(results);
				}
			});
		};

		var update = function(req, cb, next) {
			var url = req.route.path.substr(1).split('/');
			var collection = url[0];

			if (!ObjectID.isValid(req.params.id)) {
				cb.status(404).send(notFound(collection, req.params.id));
				return;
			}

			db.collection(collection).update({_id:ObjectID(req.params.id)}, {$set:req.body}, function(e, results) {
				if (e) next(e);
				else cb.sendStatus(204);
			});
		};

		var remove = function(req, cb, next) {
			var url = req.route.path.substr(1).split('/');
			var collection = url[0];

			if (!ObjectID.isValid(req.params.id)) {
				cb.status(404).send(notFound(collection, req.params.id));
				return;
			}

			db.collection(collection).remove({_id:ObjectID(req.params.id)}, function(e, results) {
				if (e) {
					next(e);
				} else if (results < 1) {
					cb.status(404).send(notFound(collection, req.params.id));
				} else {
					cb.sendStatus(204);
				}
			});
		};

	});
};

function notFound(collection, id) {
	return collection + ' object (id: ' + id +') does not exit';
}