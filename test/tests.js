var observe = require('path-observer');
var assert = require('assert');

describe('Path Observer', function(){
  var dummy, PathObserver;

  beforeEach(function(){
    dummy = {
      foo: 'bar',
      bar: [1,2,3],
      baz: {
        foo: {
          foo: 'bar'
        }
      }
    };
    PathObserver = observe(dummy);
  });

  it('should get the value', function(){
    var path = new PathObserver('foo');
    assert( path.get() === 'bar' );
  })

  it('should set the value', function(){
    var path = new PathObserver('foo');
    path.set('baz')
    assert( dummy.foo === 'baz' );
  })

  it('should know when the path is dirty', function(){
    var path = new PathObserver('foo');
    assert(path.dirty() === false);
    dummy.foo = 'baz';
    assert(path.dirty() === true);
  })

  describe('watching for changes', function(){

    it('should watch for changes on a path', function(done){
      var path = new PathObserver('foo');
      path.change(function(current, previous){
        assert(current === 'baz');
        assert(previous === 'bar');
        done();
      });
      path.set('baz');
    })

    it('should return a method for unbinding from the change', function(done){
      var path = new PathObserver('foo');
      var dispose = path.change(function(current, previous){
        done(false);
      });
      dispose();
      path.set('baz');
      done();
    });

    it('should not fire change event if the value does not change', function(done){
      var path = new PathObserver('foo');
      path.change(function(){
        done(false);
      });
      path.set('bar');
      done();
    })

  })


  describe('arrays', function(){

    it('should emit an event when an array adds', function(done){
      var path = new PathObserver('bar');
      path.change(function(changes){
        assert(changes.type === 'add');
        assert(changes.value[0] === 4);
        done();
      });
      dummy.bar.push(4);
    })

    it('should emit an event when an array removes', function(done){
      var path = new PathObserver('bar');
      path.change(function(changes){
        assert(changes.type === 'remove');
        assert(changes.value[0] === 1);
        done();
      });
      dummy.bar.shift();
    })

    it('should emit an event when an array sorts', function(done){
      var path = new PathObserver('bar');
      path.change(function(changes){
        assert(changes.type === 'sort');
        done();
      });
      dummy.bar.reverse();
    })

    it('should emit if the array is changed to something else', function(done){
      var path = new PathObserver('bar');
      path.change(function(){
        done();
      });
      path.set('foo');
      done(false);
    })

    it('should emit if the same array is set even if it is a different object', function(done){
      var path = new PathObserver('bar');
      path.change(function(){
        done(false);
      });
      path.set([1,2,3]);
      done();
    })

    it('should unbind changes when disposed', function(done){
      var path = new PathObserver('bar');
      path.change(function(changes){
        done(false);
      });
      path.dispose();
      dummy.bar.push(4);
      done();
    })

  })


  describe('nested objects', function(){
    var one, two, three, i = 0;

    function inc() {
      i = i+1;
    }

    beforeEach(function(){
      i = 0;

      one = new PathObserver('baz');
      two = new PathObserver('baz.foo');
      three = new PathObserver('baz.foo.foo');

      one.change(inc);
      two.change(inc);
      three.change(inc);
    });

    it('should emit events at the bottom', function(){
      three.set('something else');
      assert(i === 3, i);
    })

    it('should emit events on the middle', function(){
      two.set('something else');
      assert(i === 3, i);
      assert(three.get() === undefined);
    })

    it('should emit events on the top', function(){
      one.set('something else');
      assert(i === 3, i);
      assert(two.get() === undefined);
      assert(three.get() === undefined);
    })

    it('should dispose', function(){
      two.dispose();
      three.set('something else');
      assert(i === 2);
    })

  })

})