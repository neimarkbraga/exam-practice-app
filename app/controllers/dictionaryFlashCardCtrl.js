angular.module('dictionaryFlashCardController', [])
    .controller('dictionaryFlashCardCtrl', function ($scope, $route, $location, $timeout, appStorage) {
        let self = this;
        self.index = $route.current.params.index;
        self.currentDictionary = appStorage.dictionary()[self.index];
        if(!self.currentDictionary) $location.path('#/');
        let shuffleArray = function(array) {
            let m = array.length, t, i;
            while (m) {
                i = Math.floor(Math.random() * m--);
                t = array[m];
                array[m] = array[i];
                array[i] = t;
            }
            return array;
        };

        self.current_card = {
            number: 0,
            data: null,
            question: '',
            reveal_answer: false,
            user_answer: ''
        };
        self.cards = shuffleArray(angular.copy(self.currentDictionary.items)).map(function (item) {
            let choices = shuffleArray(angular.copy(self.currentDictionary.items)).map(function (item) {return item.term;});
            item.choices = [item.term];
            for(let i = 0; i < choices.length; i++) {
                let choice = choices[i];
                if(item.term !== choice) item.choices.push(choice);
                if(item.choices.length >= 3) break;
            }
            item.choices = shuffleArray(item.choices);
            return item;
        });

        self.renderCurrentCardData = function () {
            let card = self.current_card;
            card.reveal_answer = false;
            card.user_answer = '';
            card.question = shuffleArray(angular.copy(card.data.meanings))[0];
        };
        self.next = function () {
            let index = self.cards.indexOf(self.current_card.data);
            index += 1;
            if(index >= self.cards.length) index = 0;
            self.current_card.data = self.cards[index];
            self.current_card.number = index + 1;
            self.renderCurrentCardData();
        };
        self.prev = function () {
            let index = self.cards.indexOf(self.current_card.data);
            index -= 1;
            if(index < 0) index = self.cards.length - 1;
            self.current_card.data = self.cards[index];
            self.current_card.number = index + 1;
            self.renderCurrentCardData();
        };
        self.tap = function () {
            if(self.current_card.reveal_answer) self.next();
            else self.current_card.reveal_answer = true;
        };

        self.next();



        let keypressHandler = function (e) {
            $timeout(function () {
                self.tap();
            });
        };
        window.addEventListener('keypress', keypressHandler);
        $scope.$on('$destroy', function () {
            window.removeEventListener('keypress', keypressHandler);
        });

    });