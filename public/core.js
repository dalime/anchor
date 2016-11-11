// MODULE DECLARATION
let dannyTodo = angular.module('dannyTodo', []);

// CONTROLLER DECLARATION
mainController($scope, $http) {
  $scope.formData = {};

  // when landing on the page, get all todos and show them
  $http.get('/api/todos')
    .success((data) => {
      $scope.todos = data;
      console.log('Data: ', data);
    })
    .error((error) => {
      console.error('Error: ', error);
    });

  // when submitting to add form, send text to the Node API
  $scope.createTodo = () => {
    $http.post('/api/todos', $scope.formData)
      .success((data) => {
        $scope.formData = {};
        $scope.todos = data;
        console.log('Data: ', data);
      })
      .error((error) => {
        console.error('Error: ', error);
      });
  };

  // To delete a todo after checking
  $scope.deleteTodo = (id) => {
    $http.delete(`/api/todos/${id}`)
      .success((data) => {
        $scope.todos = data;
        console.log('Data: ', data);
      })
      .error((error) => {
        console.error('Error: ', error);
      });
  };
};
