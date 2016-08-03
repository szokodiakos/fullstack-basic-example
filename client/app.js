(function () {
  var API_BASE = 'http://localhost:3000';

  var urls = {
    ANIMALS: function() {
      return API_BASE + '/api/v1/animals';
    },
    ANIMAL: function(name) {
      var api = API_BASE + '/api/v1/animal';

      if (name) {
        api = api + '/' + name;
      }
      return api;
    }
  };

  angular
    .module('app', [])
    .controller('appController', function($http) {
      var vm = this;
      vm.animalTypeFilter = '';
      vm.animalNames = '';
      vm.newAnimalName = '';
      vm.newAnimalType = '';
      vm.animalNameToDelete = '';

      vm.getAnimals = function getAnimals() {
        $http.get(urls.ANIMALS(), {
          params: {
            type: vm.animalTypeFilter,
          }
        })
        .then(function(res) {
          var animals = res.data.item;
          var animalNames = animals.map(function(animal) {
            return animal.name;
          });

          vm.animalNames = animalNames.join(', ');
        })
        .catch(function(res) {
          var errorMessage = res.data.message;
          vm.animalNames = 'Error: ' + errorMessage;
        });
      }

      vm.postAnimal = function postAnimal() {
        $http.post(urls.ANIMAL(), {
          animal: {
            name: vm.newAnimalName,
            type: vm.newAnimalType
          }
        })
        .then(function(res) {
          var message = res.data.item;
          vm.newAnimalMessage = message;
        })
        .catch(function(res) {
          var errorMessage = res.data.message;
          vm.newAnimalMessage = 'Error: ' + errorMessage;
        });
      }

      vm.deleteAnimal = function deleteAnimal() {
        if (!vm.animalNameToDelete) {
          vm.deletedAnimalMessage = 'Error: Name must be provided.';
          return;
        }
        $http.delete(urls.ANIMAL(vm.animalNameToDelete))
        .then(function(res) {
          var message = res.data.item;
          vm.deletedAnimalMessage = message;
        })
        .catch(function(res) {
          var errorMessage = res.data.message;
          vm.deletedAnimalMessage = 'Error: ' + errorMessage;
        });
      }
    });
})();
