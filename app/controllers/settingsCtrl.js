angular.module('settingsController', [])
    .controller('settingsCtrl', function (appStorage) {
        let settings = this;
        settings.value = appStorage.settings();
        settings.criteriaTotal = function () {
            return (settings.value.criteria.multiple_choice + settings.value.criteria.true_or_false + settings.value.criteria.matching_type + settings.value.criteria.identification);
        };
        settings.changed = function () {
            return !angular.equals(settings.value, appStorage.settings());
        };
        settings.saveChanges = function () {
            settings.value = appStorage.settings(settings.value);
            Dialog.alert('Changes Saved', 'Settings saved.');
        };
    });