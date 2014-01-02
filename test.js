var DB = require("./DB");
var DBDIR = "./";
var arr = {};
var warr = {};
var dbname = "./tesat.db";
var tablename = "testtbl";

// CONNECT DB
var test = new DB(DBDIR + dbname, tablename);

test.debugquery = true;
// test.defaultschema = false; //add id and timestamp when true and default.

// CREATE TABLE
var schema = {};
schema["testint"] = "INTEGER";
schema["testtxt"] = "TEXT";

test.drop(function() {
	test.create(schema, function() {

		// INSERT
		var data = {}
		data.testint = "123";
		data.testtxt = "abc";
		test.insert(data)
		data.testint = "456";
		data.testtxt = "def";
		test.insert(data)
		data.testint = "789";
		data.testtxt = "ghi";
		test.insert(data)

		// SELECT
		var where = {}
		where.testint = "789";
		test.select(where, function(r) {
			DB.c(r)
			DB.c(test.defaultschema)
		})

		// SELECT ALL
		test.selectall(function(r) {
			test.c(r)
		})
	});
});
