const mocha = require('mocha')
    , server = require('../src/server')
    , app = server.app
    , db = server.db

function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}

before(function (done) {
    db.sync({force: true,logging:console.log}).then(() => {
        console.log("listening at 8000");
        app.listen(8000, () => done())
    })
})

describe("/api/v1", function () {
    before(function () {
        console.info("Running API test");
    });
    importTest("/courses", './api/courses');
    importTest("/batches", './api/batches');


    after(function () {
        console.info("All api tests have run");
    });
});