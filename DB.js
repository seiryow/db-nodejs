var sqlite3 = require('sqlite3').verbose();
function c(s) {
	console.log(s);
}

var DB = {};

// DB.prototype.defaultschema = true;
DB = function(dbfile, table) {
	this.db = new sqlite3.Database(dbfile);
	if (1 < arguments.length) {
		this.table = table;
	}
	this.debugquery = false;
	this.show_tables = function(func) {
		var q = "select name from sqlite_master where type = 'table';";
		this.db.all(q, function(err, rows) {
			if (!err) {
				// c(rows);
				if (func) {
					func(rows);
				}
			} else {
				c("error select");
				if (efunc) {
					efunc(err);
				} else {
					c(err);
				}
			}
		});
	};
	this.drop = function(func) {
		this.db.run("DROP TABLE " + this.table, func);
	};
	this.c = function(s) {
		console.log(s);
	};
	this.run = function(q, func) {
		if (this.debugquery) {
			c(q);
		}
		if (typeof func === undefined || !func || func == null) {
			func = function() {
			}
		}
		this.db.run(q, func);
	};
	this.create = function(arr, func) {
		c(this.defaultschema);
		var q = "CREATE TABLE " + this.table + "(";
		var qarr = [];
		if (this.defaultschema) {
			qarr.push("id INTEGER PRIMARY KEY AUTOINCREMENT")
		}
		for ( var k in arr) {
			if (arr.hasOwnProperty(k)) {
				qarr.push(k + " " + arr[k])
			}
		}
		if (this.defaultschema) {
			qarr.push("timestamp VARCHAR(19) DEFAULT (datetime())")
		}
		q += qarr.join(",");
		q += ")";
		this.run(q, func);
	};
	this.insert = function(arr, func) {
		var q = "INSERT INTO " + this.table + " (";
		var col = [];
		var val = [];
		for ( var k in arr) {
			col.push(k);
			if (arr[k] == "NULL") {
				val.push(arr[k]);
			} else {
				val.push("'" + (arr[k] + "").replace(/'/g, "") + "'");
			}

		}
		var cl = col.join(",");
		var vl = val.join(",");
		q += cl + ") VALUES (" + vl + ");";
		// c(q);
		// this.run(q, func);

		var my = this;
		this.run(q, function() {
			my.max("id", function(rows) {
				var warr = {};
				warr.id = rows[0]["MAX(id)"];
				// warr.id = ""+rows[0]["MAX(id)"];
				c(rows[0]["MAX(id)"]);
				my.select(warr, func);
			});
		});
	};
	this.update = function(arr, warr, func) {
		var q = "UPDATE " + this.table + " SET ";
		// var qstr = "";
		var qarr = [];
		for ( var k in arr) {
			qarr.push(k + " = '" + arr[k] + "'");
		}
		q += qarr.join(" , ");
		if (warr) {
			var qwarr = [];
			for ( var k in warr) {
				qwarr.push(k + " = '" + warr[k] + "'");
			}
			q += " WHERE ";
			q += qwarr.join(" AND ");
		}
		// this.run(q, func);
		var my = this;
		this.run(q, function() {
			my.select(warr, func);
		});
	};
	this.del = function(warr, func) {
		var q = "DELETE from " + this.table + " ";
		// var qstr = "";
		var qwarr = [];
		for ( var k in warr) {
			qwarr.push(k + " = '" + warr[k] + "'");
		}
		q += " WHERE ";
		q += qwarr.join(" AND ");
		var my = this;
		this.run(q, function() {
			my.select(warr, func);
		});
	};
	this.selectcond = {};
	this.select = function(warr, func, efunc) {
		var q = "SELECT * FROM " + this.table + " ";

		var qwarr = [];
		for ( var k in warr) {
			if (k == this.selectcond) {
				qwarr.push(" " + warr[k] + " ");
			} else {
				// if (typeof warr[k] == "String") {
				var datastr = "" + warr[k];
				var res = datastr.replace(new RegExp("\\*", 'g'), "%");
				if(datastr==""){
					qwarr.push(k + " is null");
				}else if (res == datastr) {
					qwarr.push(k + " = '" + warr[k] + "'");
				} else {
					qwarr.push(k + " LIKE '" + res + "'");
				}
			}
		}
		if (qwarr.length !== 0) {
			q += " WHERE ";
			q += qwarr.join(" AND ");
		}

		if (this.debugquery) {
			c(q);
		}
		this.db.all(q, function(err, rows) {
			if (!err) {
				// c(rows);
				if (func) {
					func(rows);
				}
			} else {
				c("error select");
				if (efunc) {
					efunc(err);
				} else {
					c(err);
				}
			}
		});
	};
	this.max = function(col, func, efunc) {
		var q = "SELECT MAX(" + col + ") FROM " + this.table + " ";

		if (this.debugquery) {
			c(q);
		}
		this.db.all(q, function(err, rows) {
			c(rows);
			if (!err) {
				if (func) {
					func(rows);
				}
			} else {
				c("error select");
				if (efunc) {
					efunc(err);
				} else {
					c(err);
				}
			}
		});
	};
	// ORDER BY id DESC
	this.selectall = function(func, efunc) {
		var q = "SELECT * FROM " + this.table + " ";
		if (this.debugquery) {
			c(q);
		}
		this.db.all(q, function(err, rows) {
			if (!err) {
				// c(rows);
				func(rows);
			} else {
				c("error select");
				if (efunc) {
					efunc(err);
				} else {
					c(err);
				}
			}
		});
	};
	this.schema = function(func, efunc) {
		var q = "PRAGMA table_info(" + this.table + ")";
		if (this.debugquery) {
			c(q);
		}
		this.db.all(q, function(err, rows) {
			if (!err) {
				// c(rows);
				func(rows);
			} else {
				c("error select");
				if (efunc) {
					efunc(err);
				} else {
					c(err);
				}
			}
		});
	};
	this.each = function(arr, func) {
		for ( var k in arr) {
			if (arr.hasOwnProperty(k)) {
				func(k, arr[k]);
			}
		}
	};
}
DB.prototype.defaultschema = true;
String.prototype.replaceAll = function(find, replace) {
	// return this.replace(new RegExp(find, 'g'), replace);
}
DB.prototype.c = function(s) {
	console.log(s);
}
module.exports = DB;
module.exports.c = function(s) {
	console.log(s);
}
// module.exports.defaultschema = true;

module.exports.each = function(arr, func) {
	for ( var k in arr) {
		if (arr.hasOwnProperty(k)) {
			func(k, arr[k]);
		}
	}
};
