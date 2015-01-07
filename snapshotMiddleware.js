var fs = require("fs");
var path = require("path");
var config = require("./config");
var snapShot = require("./liveSnapshot");


function invalidateFile(filePath) {
    if (! fs.existsSync(filePath)) return true;

    var stats = fs.statSync(filePath);

    var now = new Date().getTime();
    var deadTime = new Date(stats.mtime).getTime() + config.cacheLifeSpanMs;

    if (now>deadTime) {
        console.log("File is old, delete");
        fs.unlinkSync(filePath);
        return true;
    }

    return false;

}
var htmlSnapShot = function(req, res, next) {
    var fragment = req.query._escaped_fragment_;

    // TODO: Send 404 here, a custom 404 page...
    if (!fragment) return next();

    if (fragment === "" || fragment === "/")
        fragment = "/index.html";

    if (fragment.charAt(0) !== "/")
        fragment = '/' + fragment;


    var p = path.join(__dirname, config.outputDir, config.sanitize(fragment) + ".html");

    if (invalidateFile(p)) {
        snapShot(fragment, function(err, data){
            if (err) {
                res.send(404);
            }
            else {
                fs.writeFileSync(p, data);
                respond(res, p);
            }
        });
    }
    else {
        respond(res, p);
    }
    // Serve the static html snapshot

};

function respond(res, file) {
    try {
        res.sendfile(file);
    } catch (err) { res.send(404); } // TODO: Send 404 here, a custom 404 page...
}
module.exports = htmlSnapShot;
