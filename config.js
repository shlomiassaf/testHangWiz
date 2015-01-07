var config = {
    hashTag: "#",
    hostname: "https://www.hangwiz.com/",
    outputDir: "snapshots",
    sanitize: sanitize,
    timeout: 15000,
    denyResource: [
        "maps.googleapis.com",
        "connect.facebook.net/en_US/sdk.js",
        "www.google-analytics.com/analytics.js",
        "olark"
    ],
    contentFilter: filter,
    cacheLifeSpanMs: 1000*60*60*48 // this is 48 hours...
}

function filter(content) {
    return content
        // remove all script tags
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")

        // remove all script tags
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")

        // remove all link tags
        .replace(/<link\s.*?(\/)?>/gi, "");
};

function sanitize(requestUri) {
    requestUri = requestUri.replace(config.hostname, "");

    if (/\/$/.test(requestUri)) {
        return 'index.html';
    } else {
        return requestUri.replace(config.hashTag, "").replace(/\//g, '[sl]');
    }
}

module.exports = config;