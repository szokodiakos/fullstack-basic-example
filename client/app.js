(function () {
  var API_BASE = 'http://localhost:3000';

  var urls = {
    ANIMALS: function() { return API_BASE + '/api/v1/animals' }
  };

  angular
    .module('app', [])
    .controller('appController', function($http) {
      var vm = this;
      vm.animalTypeFilter = '';
      vm.animalNames = '';

      vm.getAnimals = function getAnimals() {
        $http.get(urls.ANIMALS(), {
          params: {
            type: vm.animalTypeFilter,
          }
        })
          .then(function(res) {
            var animals = res.data;
            var animalNames = animals.map(function(animal) {
              return animal.name;
            });

            vm.animalNames = animalNames.join(', ');
          })
          .catch(function(res) {
            console.log(res);
            var errorMessage = res.data.message;
            vm.animalNames = 'Error: ' + errorMessage;
          });
      }
    });
})();
