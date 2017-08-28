angular.module('mainController', [])
    .controller('mainCtrl', function ($scope, $location) {
        let main = this;
        main.name = 'Exam Practice';
        main.author = 'Neimark Junsay Braga';
        main.description = 'Exam Practice App is an application that would help students study for their exams. Basically, the students will encode their terminologies and meanings to dictionary section and the application will automatically make a practice exam out of those encoded data.';
        main.year = '2017';
        main.version = 'v1.0.0';
        main.navLinks = [
            {name: 'Home', href:'/'},
            {name: 'Dictionaries', href:'/dictionaries'},
            {name: 'Settings', href:'/settings'}
        ];
        $scope.$on('$routeChangeStart', function() {main.currentPath = $location.path();});
    });