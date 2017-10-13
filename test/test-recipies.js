const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Recipes', function() {
    before(function() {
        return runServer();
    });

    after(function() {
        return closeServer();
    });
    
    it('should list recipe items on GET', function(){
        return chai.request(app)
        .get('/recipes')
        .then(function(res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            res.body.length.should.be.at.least(1);

            const expectedKeys = ['id', 'name', 'ingredients'];
            res.body.forEach(function(item) {
                item.should.be.a('object');
                item.should.include.keys(expectedKeys);
            });
        });
    });

    it('should list new recipe item on POST ', function(){
        const newItem = {name: 'salad', ingredients: ['tomatoes, mozarella']};
        return chai.request(app)
            .post('/recipes')
            .send(newItem)
            .then(function(res){
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.include.keys('id', 'name', 'ingredients');
            res.body.id.should.not.be.null;
            res.body.should.deep.equal(Object.assign(newItem, {id: res.body.id}));

        });
    });
    it('should list newly added recipe items on PUT', function(){
        const newIngredient = {ingredient: ['basil, Olive oil']};
        return chai.request(app)
            .get('/recipes')
            .then(function(res){
                newIngredient.id = res.body[0].id;
                return chai.request(app)
                .put(`/recipes/${newIngredient.id}`)
                .send(newIngredient)
        })
            .then(function(res){
                res.should.have.status(204);
            });
    it('should remove a list item with delete', function(){
        return chai.request(app)
            .get('/recipes')
            .then(function(res){
                return chai.request(app)
                .delete(`/recipes/${res.body[0].id}`);
            })
            .then(function(res){
                res.should.have.status(204);
            });
         });
    });
});