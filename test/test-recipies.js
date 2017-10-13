const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runserver, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Recipies', function() {
    before(function() {
        return runserver();
    });

    after(function() {
        return closeServer();
    });
    
    it('should list items on GET' function(){
        return chai.request(app)
        .get('/shopping-list')
        .then(function(res)) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            res.body.length.should.be.at.least(1);

            
        }
    })
});