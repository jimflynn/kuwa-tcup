var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'manush',
  password        : 'manush',
  database        : 'dev_kuwa_sponsor'
});

exports.connection = {
    query: function () {
        var queryArgs = Array.prototype.slice.call(arguments),
            events = [],
            eventNameIndex = {};

        pool.getConnection(function (err, conn) {
            if (err) {
                if (eventNameIndex.error) {
                    eventNameIndex.error();
                }
            }
            if (conn) { 
                var q = conn.query.apply(conn, queryArgs);
                q.on('end', function () {
                    conn.release();
                });

                events.forEach(function (args) {
                    q.on.apply(q, args);
                });
            }
        });

        return {
            on: function (eventName, callback) {
                events.push(Array.prototype.slice.call(arguments));
                //console.log(events);
                eventNameIndex[eventName] = callback;
                return this;
            }
        };
    }
};