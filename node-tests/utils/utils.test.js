const expect = require('expect');
const utils = require('./utils');

describe('Utils', ()=>{
    describe('#add', ()=>{
        it('should add two numbers', () => {
            var result = utils.add(33, 11);

            expect(result)
                .toBe(44, `Expected 44, but got ${result}`)
                .toBeA('number', 'Result should be a number');
            
            //if (result !== 44)
                //throw new Error(`Expected 44, but got ${result}`);
        });

        it('should async add two numbers', (done) => {
            utils.asyncAdd(33, 11, (sum) => {
                expect(sum)
                    .toBe(44)
                    .toBeA('number');
                //tell mocha the tests are done in async
                done();    
            });
        
        });
    });
    
    describe('#square', ()=>{

        it('should square a number', () => {
            var result = utils.square(3);

            expect(result)
                .toBe(9, `Expected 9, but got ${result}`)
                .toBeA('number', 'Result should be a number');

            //if (result !== 9)
                //throw new Error(`Expected 9, but got ${result}`);
        });

        it('should async square a number', (done) =>{
            utils.asyncSquare(3, (result)=>{
                expect(result).toBeA('number').toBe(9);
                done();
            })
        });
    });


});
it('should verify fist and last names are set', ()=>{
    //assert it includes firstname and lastname with proper values
    const user = { age: 2 };
    var result = utils.setName(user, 'Julia Sanchez');
    expect(result)
        .toInclude({
            firstname: 'Julia', 
            lastname: 'Sanchez'})
        .toBeA('object');
});
it('should expect some values', ()=>{
    expect(2).toNotBe(3);
    expect({name: 'Junior'}).toEqual({name: 'Junior'});
    expect([2,3,4]).toInclude(2);
    expect([2,3,4]).toExclude(5);
    expect({name: 'Junior', city: 'Rio', age: 41}).toInclude({age: 41});
    expect({name: 'Junior', city: 'Rio', age: 41}).toExclude({age: 23});
});