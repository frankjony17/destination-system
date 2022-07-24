/**
 * Created by basis on 06/01/17.
 */
describe('AnaliseTecnicaService', function() {
  /*it('has a dummy spec to test 2 + 2', function() {
    expect(2+2).toEqual(4);
  });*/
  var analiseTecnicaService;

  // Before each test load our api.users module
  beforeEach(angular.mock.module('suApp'));

  // Before each test set our injected Users factory (_Users_) to our local Users variable
  beforeEach(inject(function(_analiseTecnicaService_) {
    analiseTecnicaService = _analiseTecnicaService_;
  }));

  // A simple test to verify the Users factory exists
  it('should exist', function() {
    expect(analiseTecnicaService).toBeDefined();
  });

});
