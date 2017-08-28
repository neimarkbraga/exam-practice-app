angular.module('dictionaryController', [])
    .controller('dictionaryCtrl', function ($scope, $route, $location, appStorage) {
        let dictionary = this;
        dictionary.index = $route.current.params.index;
        dictionary.currentDictionary = appStorage.dictionary()[dictionary.index];
        if(!dictionary.currentDictionary) $location.path('#/');
        dictionary.simplifiedItems = function () {
            let simplified = [];
            for(let i = 0; i < dictionary.currentDictionary.items.length; i++){
                let item = dictionary.currentDictionary.items[i];
                for(let j = 0; j < item.meanings.length; j++){
                    let meaning = item.meanings[j];
                    simplified.push({
                        term: (j ==0)? item.term:'',
                        meaning: meaning
                    });
                }
            }
            return simplified;
        };
        dictionary.convertSimplfiedToOriginal = function (simplified, callback) {
            let isWhitespaceOrNull = function (str) {
                if(!str) return true;
                else if(str.trim() == '') return true;
                return false;
            };
            let obj = [];
            let currentItem = {term: undefined, meanings: []};
            for(let i = 0; i < simplified.length; i++){
                let item = simplified[i];
                let term = (isWhitespaceOrNull(item.term))? currentItem.term:item.term;
                let meaning = (isWhitespaceOrNull(item.meaning))? undefined:item.meaning;
                if(!currentItem.term){
                    if(!term || !meaning) {
                        callback('The first term and meaning cannot be empty.');
                        return false;
                    } else {
                        currentItem.term = term;
                        currentItem.meanings.push(meaning);
                    }
                } else if(!meaning) {
                    callback('Meaning fields cannot be empty.');
                    return false;
                } else if(term == currentItem.term){
                    currentItem.meanings.push(meaning);
                } else {
                    obj.push(angular.copy(currentItem));
                    currentItem.term = term;
                    currentItem.meanings = [meaning];
                }
            }
            if(currentItem.term) obj.push(angular.copy(currentItem));
            callback(null, obj);
        };
        dictionary.itemsChanged = function () {
            return !angular.equals(dictionary.items, dictionary.simplifiedItems());
        };
        dictionary.deleteItem = function (index) {
            dictionary.items.splice(index, 1);
        };
        dictionary.saveItems = function () {
            dictionary.convertSimplfiedToOriginal(dictionary.items, function (err, newData) {
                if(err) Dialog.alert('Error', err);
                else {
                    let dictionaries = appStorage.dictionary();
                    dictionaries[dictionary.index].items = newData;
                    dictionary.currentDictionary = appStorage.dictionary(dictionaries)[dictionary.index];
                    dictionary.items = dictionary.simplifiedItems();
                }
            });
        };
        dictionary.items = dictionary.simplifiedItems();
    });