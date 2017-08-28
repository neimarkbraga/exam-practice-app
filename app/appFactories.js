angular.module('appFactories', ['ngStorage'])
    .factory('appStorage', function ($localStorage) {
        return {
            dictionary: function (value) {
                if(value)$localStorage.dictionaries = JSON.stringify(value);
                else if(!$localStorage.dictionaries) $localStorage.dictionaries = JSON.stringify([]);
                return JSON.parse($localStorage.dictionaries);
            },
            settings: function (value) {
                if(value)  $localStorage.settings = JSON.stringify(value);
                else if(!$localStorage.settings) $localStorage.settings = JSON.stringify({
                    criteria: {
                        multiple_choice: 25,
                        true_or_false: 25,
                        matching_type: 25,
                        identification: 25
                    }
                });
                return JSON.parse($localStorage.settings);
            }
        };
    });