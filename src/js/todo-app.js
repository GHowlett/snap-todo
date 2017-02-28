var angular = require('angular');

angular.module('todoApp',[])
	.controller('todoCtrl', function($scope, incompleteFirstFilter){
		$scope.todos = [
			{text: 'Fund an awesome soccer team', done:false},
			{text: 'Raise more money than you thought possible', done:true},
			{text: 'Invest in your local community', done:true}
		];

		$scope.addTodo = function(str) {
			$scope.todos.push({
				text: str,
				done: false
			});

			$scope.todoText = '';
		};

		$scope.deleteTodo = function(todo) {
			for (var i = 0; i < $scope.todos.length; i++)
				if ($scope.todos[i] === todo)
					$scope.todos.splice(i,1);
		};

		$scope.filteredTodos = incompleteFirstFilter($scope.todos);
	})
	.directive('enter', function(){
		return function(scope, el, attr){
			el.on('keypress', function(e){
				if (e.which === 13) {
					scope.$apply(function(){
                        scope.$eval(attr.enter, {e:e});
                    });
					e.preventDefault();
				}
			});
		};
	})
	.filter('incompleteFirst', function(){
		return function(todos){
			// console.log(todos);
			var complete = [], incomplete = [];
			for (var i = 0; todos && i< todos.length; i++)
				if (todos[i].done) complete.push(todos[i]);
				else incomplete.unshift(todos[i]); // put newly completed todos at bottom
			// console.log(complete, incomplete);
			return incomplete.concat(complete);
		};
	})
;