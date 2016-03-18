
angular.module('comment', []) 
.controller('MainCtrl', [ 
  '$scope', '$http', 
  function($scope,$http){ 
    $scope.rating = 5;

    $scope.comments = [
       {title:'Comment 1', upvotes:5}, 
       {title:'Comment 2', upvotes:6}, 
       {title:'Comment 3', upvotes:1}, 
       {title:'Comment 4', upvotes:4}, 
       {title:'Comment 5', upvotes:3} 
    ];

    $scope.create = function(comment) {
	console.log(comment);
        return $http.post('/comments', comment).success(function(data){
          $scope.comments.push(data);
        });
    };

    $scope.addComment = function() {
	//$scope.comments.push({title: $scope.formContent, upvotes: 0});
        if($scope.formContent === '') {return;}
	console.log("In addComment with " + $scope.formContent);
	$scope.create({
	  title: $scope.formContent, 
	  upvotes: 0,
	});
	$scope.formContent = '';
	//$scope.comments = $scope.getAll();
    };

    $scope.getAll = function() {
    	return $http.get('/comments').success(function(data){
	  angular.copy(data, $scope.comments);
	  console.log(data);
	});
    };
    $scope.getAll();

    $scope.upvote = function(comment) {
        console.log(comment);
	return $http.put('/comments/' + comment._id + '/upvote')
	  .success(function(data){
	    comment.upvotes = data.upvotes;
	  });
    };

    $scope.incrementUpvotes = function(comment) {
        $scope.upvote(comment);
    };

    $scope.rateFunction = function( rating ){
	var _url = '/comments';
 	var data = {  rating: rating };
 	$http.post( _url, angular.toJson(data), {cache: false} )
	  .success( function( data ) {
	   success(data);
	  })
	  .error(function(data){
	    error(data);
	  });
    };
  } 
])
.directive('starRating', function() {
	return {
		restrict :'A',
		template:'<ul class="rating">'
  		 + '	<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">'
		 + '\u2605'
		 + '</li>'
		 + '</ul>',
		scope : {
			ratingValue : '=',
			max : '=',
			onRatingSelected : '&'
		},
		link : function(scope, elem, attrs) {
			var updateStars = function() {
				scope.stars = [];
				for ( var i = 0; i < scope.max; i++) {
					scope.stars.push({
						filled : i < scope.ratingValue
					});
				}
			};
			
		scope.toggle = function(index) {
			scope.ratingValue = index + 1;
			scope.onRatingSelected({
				rating : index + 1
			});
		};
				
		scope.$watch('ratingValue',
			function(oldVal, newVal) {
				if (newVal) {
					updateStars();
				}
			}
		);
	}
	};
	}
);
