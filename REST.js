var data = {};
var table, id;
// Overwrite method (only for development and testing, not for production)
if (get["method"]) {
	req.method = get["method"];
}
if (requrl[2]) {
	// /api/"tablename"
	table = requrl[2];
} else if (get["table"]) {
	// Overwrite method (only for development and testing, not for production)
	table = get["table"];
}
if (requrl[3]) {
	// /api/tablename/"id"
	id = requrl[3];
} else if (id) {
	// Overwrite method (only for development and testing, not for production)
	id = get["id"];
}
if (table) {
	if (dbs[table]) {
		// For development
		dbs[table].debugquery = true;

		// Get all column name
		dbs[table].schema(function(schema) {
			if (req.method == "POST") {
				for (var i = 0; i < schema.length; i++) {
					var col = schema[i]["name"];
					if (post[col]) {
						data[col] = post[col];
					}
					if (get[col]) {
						data[col] = get[col];
					}
				}
				if (id) {
					// UPDATE if the request have id
					var warr = {};
					warr.id = id;
					dbs[table].update(data, warr, function(data) {
						result(data);
					});
				} else {
					// INSERT if the request not having the id
					dbs[table].insert(data, function(data) {
						result(data);
					});
				}
			} else if (req.method == "DELETE") {
				// DELETE record
				if (id) {
					var warr = {};
					warr.id = id;
					dbs[table].del(warr, function(data) {
						result(data);
					});
				} else {
					// Error if it not having id
					result(data);
				}
			} else if (req.method == "GET") {
				// SELECT from table with conditions
				var warr = {};
				for (var i = 0; i < schema.length; i++) {
					var col = schema[i]["name"];
					if (get[col]) {
						warr[col] = get[col];
					}
				}

				dbs[table].select(warr, function(data) {
					result(data);
				});
			}

		});
	} else {
		// CREATE TABLE if the table not exists and method is PUT
		if (req.method == "PUT") {
			var schema = {};
			for ( var i in get) {
				if (i == "method" || i == "table" || i == "p") {
					continue;
				}
				schema[i] = get[i];
			}
			if (table) {
				db.table = table;
				db.debugquery = true;
				db.create(schema, function(data) {
					result(data);
				});
			} else {
				result(data);
			}
		} else {
			result(data);
		}

	}
	// Hard coded
} else if (get["tableinfo"]) {
	// SHOW SCHEMA
	db.table = get["tableinfo"];
	db.schema(function(data) {
		result(data);
	});
} else if (get["tabledelete"]) {
	db.table = get["tabledelete"];
	db.drop(function(data) {
		result(data);
	});
} else if (get["error"]) {
	// Just for debugging.
	console.log("error");
	var error = error;
	result("error");
} else {
	db.show_tables(function(data) {
		result(data);
	});
}