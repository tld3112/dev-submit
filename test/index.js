const mocha = require('mocha'),
    server = require('../server'),
    app = server.app,
    db = server.db

function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}

before(function (done) {
    db.sync({force: true}).then(() => {
        app.listen(8000, () => done())
    })
})

describe("/api/v1", function () {
    before(function () {
        console.info("Running API test");
    });
    importTest("/", './api/index.js');

    after(function () {
        console.info("All api tests have run");
    });
});