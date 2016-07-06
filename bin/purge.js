var MaxCDN = require('maxcdn');
var maxcdn = new MaxCDN('alias', 'key', 'secret');

var zoneId = '1337';

// purge full cache
maxcdn.del('zones/pull.json/'+zoneId+'/cache', function(err, results) {
    if (err) {
        console.trace(err);
        return;
    }
    if (results.code === 200) {
        console.log('Successfully purged www.JustinDorfman.com');
    }
});