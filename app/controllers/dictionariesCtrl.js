angular.module('dictionariesController', ['ngFileUpload'])
    .controller('dictionariesCtrl', function ($scope, appStorage) {
        let dictionaries = this;
        dictionaries.library = appStorage.dictionary();
        dictionaries.addNewDictionary = function () {
            Dialog.prompt('New Dictionary', 'Enter the name of your new dictionary', function (newName) {
                $scope.$apply(function () {
                    if(newName != undefined){
                        if(newName.trim() == '') Dialog.alert('Empty Name', 'Dictionary name cannot be whitespace or empty.');
                        else if(dictionaries.library.filter(dictionary => dictionary.name == newName).length > 0) Dialog.alert('Dictionary Name Already Exist', '<b>' + newName+ '</b> is already on the list. Try another name.');
                        else {
                            dictionaries.library.push({name: newName, items: []});
                            dictionaries.library = appStorage.dictionary(dictionaries.library);
                        }
                    }
                });
            },{label: 'Dictionary', placeholder: 'New Dictionary Name', required: false});
        };
        dictionaries.renameDictionary = function (index) {
            let currentDictionary = dictionaries.library[index];
            Dialog.prompt('Rename Dictionary', 'Rename dictionary <b>' + currentDictionary.name + '</b> to?', function (newName) {
                $scope.$apply(function () {
                    if(newName != undefined){
                        if(newName.trim() == '') Dialog.alert('Empty Name', 'New dictionary name cannot be whitespace or empty.');
                        else if(newName == currentDictionary.name) Dialog.alert('No Changes', 'New dictionary name cannot be the old name.');
                        else if(dictionaries.library.filter(dictionary => dictionary.name == newName).length > 0) Dialog.alert('Dictionary Name Already Exist', '<b>' + newName+ '</b> is already on the list. Try another name.');
                        else {
                            dictionaries.library[index].name = newName;
                            dictionaries.library = appStorage.dictionary(dictionaries.library);
                        }
                    }
                });


            },{label: 'Dictionary', placeholder: 'New Dictionary Name', value: currentDictionary.name, required: false});
        };
        dictionaries.deleteDictionary = function (index) {
            let currentDictionary = dictionaries.library[index];
            Dialog.confirm('Delete Dictionary', 'Do you want to delete dictionary <b>' + currentDictionary.name + '</b>?', function (result) {
                $scope.$apply(function () {
                    if(result){
                        dictionaries.library.splice(index, 1);
                        dictionaries.library = appStorage.dictionary(dictionaries.library);
                    }
                });
            });
        };
        dictionaries.exportDictionaries = function () {
            $('.export-dictionary-data-button')
                .attr('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dictionaries.library)))
                .attr('download','exam-practice-export-[' + (new Date().toLocaleString()) + '].json');
        };
        dictionaries.importDictionaries = function (file) {
            let validateData = function (data, callback) {
                //variables
                let i = 0, j = 0, k = 0;

                //validate
                if(data.constructor != Array) {
                    callback('Data: expected to be an array.');
                    return false;
                } else if(data.length > 0) for(i = 0; i < data.length; i++){
                    let dictionary = data[i];
                    if(dictionary.constructor != Object){
                        callback('Dictionary: expected to be an object.');
                        return false;
                    } else if(!dictionary.name){
                        callback('Dictionary name: not defined.');
                        return false;
                    } else if(dictionary.name.constructor != String){
                        callback('Dictionary name: expected to be a string.');
                        return false;
                    } else if(dictionary.name.trim() == ''){
                        callback('Dictionary name: cannot be whitespace or empty.');
                        return false;
                    } else if(!dictionary.items){
                        callback('Dictionary items: not defined.');
                        return false;
                    } else if(dictionary.items.constructor != Array){
                        callback('Dictionary items: expected to be an array.');
                        return false;
                    } else if (dictionary.items.length > 0) for(j = 0; j < dictionary.items.length; j++){
                        let item = dictionary.items[j];
                        if(item.constructor != Object){
                            callback('Dictionary item: expected to be an object.');
                            return false;
                        }else if(!item.term){
                            callback('Dictionary item term: not defined.');
                            return false;
                        } else if(item.term.constructor != String){
                            callback('Dictionary item term: expected to be a string.');
                            return false;
                        } else if(item.term.trim() == ''){
                            callback('Dictionary item term: cannot be whitespace or empty.');
                            return false;
                        } else if(!item.meanings){
                            callback('Dictionary meanings: not defined.');
                            return false;
                        } else if(item.meanings.constructor != Array){
                            callback('Dictionary meanings: expected to be an array.');
                            return false;
                        } else if(item.meanings.length < 1){
                            callback('Dictionary meanings: expected at least 1 instance.');
                            return false;
                        } else for(k = 0; k < item.meanings.length; k++){
                            let meaning = item.meanings[k];
                            if(meaning.constructor != String){
                                callback('Dictionary meaning: expected to be a string.');
                                return false;
                            } else if(meaning.trim() == ''){
                                callback('Dictionary meaning: cannot be whitespace or empty.');
                                return false;
                            }
                        }
                    }
                }

                //ensure clean data
                let cleanData = [];
                for(i = 0; i < data.length; i++){
                    let dictionary_ = data[i];
                    let _dictionary = {
                        name: dictionary_.name,
                        items: []
                    };
                    for(j = 0; j < dictionary_.items.length; j++){
                        let item_ = dictionary_.items[j];
                        let _item = {
                            term: item_.term,
                            meanings: []
                        };
                        for(k = 0; k < item_.meanings.length; k++) _item.meanings.push(item_.meanings[k]);
                        _dictionary.items.push(_item);
                    }
                    cleanData.push(_dictionary);
                }

                //import valid
                callback(null, data);
            };
            if(file){
                let fileReader = new FileReader();
                fileReader.readAsText(file, "UTF-8")
                fileReader.addEventListener('load', function (e) {
                    try {
                        validateData(JSON.parse(e.target.result), function (err, data) {
                            if(err) Dialog.alert('Import Error Occurred', err + ' Make sure you\'re importing the right file.');
                            else $scope.$apply(function () {
                                dictionaries.library = appStorage.dictionary(data);
                            });
                        });
                    } catch (err) {
                        Dialog.alert('Import Error Occurred', 'Error: ' + err.message);
                    }
                });
                fileReader.addEventListener('error', function () {
                    Dialog.alert('Error Reading File', 'File reader cannot read the file. The file may be invalid or corrupted. Make sure you are importing the right file.');
                });
            }
        };
    });