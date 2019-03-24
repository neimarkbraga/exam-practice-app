angular.module('appRoute', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix('');
        $routeProvider
            .when('/', {
                templateUrl: 'home.html'
            })
            .when('/dictionaries', {
                templateUrl: 'dictionaries.html',
                controller: 'dictionariesCtrl',
                controllerAs: 'dictionaries'
            })
            .when('/dictionary/:index', {
                templateUrl: 'dictionary.html',
                controller: 'dictionaryCtrl',
                controllerAs: 'dictionary'
            })
            .when('/dictionary/:index/review', {
                templateUrl: 'dictionary-review.html',
                controller: 'dictionaryCtrl',
                controllerAs: 'dictionary'
            })
            .when('/dictionary/:index/flash-card', {
                templateUrl: 'dictionary-flash-card.html',
                controller: 'dictionaryFlashCardCtrl',
                controllerAs: 'flashcard'
            })
            .when('/settings', {
                templateUrl: 'settings.html',
                controller: 'settingsCtrl',
                controllerAs: 'settings'
            })
            .when('/exam/:index', {
                templateUrl: 'exam.html',
                controller: 'examCtrl',
                controllerAs: 'exam'
            })
            .when('/help', {
                templateUrl: 'help.html'
            })
            .otherwise({redirectTo: '/'});
    });