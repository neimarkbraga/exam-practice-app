angular.module('examController', [])
    .controller('examCtrl', function ($scope, $route, appStorage, $location) {
        let exam = this;
        exam.prepareQuestions = function () {
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
            let randomNumber = function (max, min, exception) {
                if(!exception) exception = [];
                let num = Math.floor(Math.random() * (max - min + 1)) + min;
                return (exception.indexOf(num) > -1)? randomNumber(min, max, exception) : num;
            };
            let incrementChar = function (c) {
                return String.fromCharCode(c.charCodeAt(0) + 1);
            };
            let shuffledItems = shuffleArray(exam.dictionary.items);
            let count = {total: shuffledItems.length};
            count.multipleChoice = Math.round((exam.criteria.multiple_choice/100) * count.total);
            count.trueOrFalse = Math.round((exam.criteria.true_or_false/100) * count.total);
            count.identification = Math.round((exam.criteria.identification/100) * count.total);
            count.matchingType = count.total - (count.multipleChoice + count.trueOrFalse + count.identification);
            exam.perfectScore = count.total;
            exam.questions = {
                multipleChoice: [],
                trueOrFalse: [],
                matchingType: {questions: [], choices:[]},
                identification: []
            };

            //multiple choice
            for(let i = 0; i < count.multipleChoice; i++){
                let item = angular.copy(shuffledItems[i]);
                let choiceIndexes = [i];
                let question = {
                    term: item.term,
                    text: shuffleArray(item.meanings)[0],
                    choices: [],
                    answer: item.term,
                    attempt: ''
                };
                choiceIndexes.push(randomNumber(0, (count.total - 1), choiceIndexes));
                choiceIndexes.push(randomNumber(0, (count.total - 1), choiceIndexes));
                choiceIndexes = shuffleArray(choiceIndexes);
                for(let j = 0; j < choiceIndexes.length; j++) question.choices.push(shuffledItems[choiceIndexes[j]].term);
                exam.questions.multipleChoice.push(question);
            }

            //true or false
            for(let i = count.multipleChoice; i < (count.multipleChoice + count.trueOrFalse); i++){
                let item = angular.copy(shuffledItems[i]);
                let question = {
                    term: item.term,
                    arg: shuffledItems[randomNumber(0, (count.total - 1), [i])].term,
                    text: shuffleArray(item.meanings)[0],
                    answer: false,
                    attempt: ''
                };
                if(shuffleArray([true, false])[0]) {
                    question.arg = item.term;
                    question.answer = true;
                }
                exam.questions.trueOrFalse.push(question);
            }

            //matching type
            for(let c = 'A', i = (count.multipleChoice + count.trueOrFalse); i < (count.multipleChoice + count.trueOrFalse + count.matchingType); i++, c = incrementChar(c)){
                let item = angular.copy(shuffledItems[i]);
                let question = {
                    term: item.term,
                    text: shuffleArray(item.meanings)[0],
                    answer: c,
                    attempt: ''
                };
                let choice = {
                    letter: c,
                    term: item.term
                };
                exam.questions.matchingType.questions.push(question);
                exam.questions.matchingType.choices.push(choice);
            }
            exam.questions.matchingType.questions = shuffleArray(exam.questions.matchingType.questions);

            //identification
            for(let i = (count.multipleChoice + count.trueOrFalse + count.matchingType); i < count.total; i++){
                let item = angular.copy(shuffledItems[i]);
                let question = {
                    term: item.term,
                    text: shuffleArray(item.meanings)[0],
                    answer: item.term,
                    attempt: ''
                };
                exam.questions.identification.push(question);
            }
        };
        exam.checkAnswers = function () {
            exam.score = 0;
            for(let i = 0; i < exam.questions.multipleChoice.length; i++){
                let question = exam.questions.multipleChoice[i];
                question.correct = angular.equals(question.attempt, question.answer);
                if(question.correct) exam.score++;
            }
            for(let i = 0; i < exam.questions.trueOrFalse.length; i++){
                let question = exam.questions.trueOrFalse[i];
                question.correct = angular.equals(question.attempt, question.answer);
                if(question.correct) exam.score++;
            }
            for(let i = 0; i < exam.questions.matchingType.questions.length; i++){
                let question = exam.questions.matchingType.questions[i];
                question.correct = angular.equals(question.attempt, question.answer);
                if(question.correct) exam.score++;
            }
            for(let i = 0; i < exam.questions.identification.length; i++){
                let question = exam.questions.identification[i];
                question.correct = angular.equals(question.attempt.trim().toUpperCase(), question.answer.trim().toUpperCase());
                if(question.correct) exam.score++;
            }
            exam.showScore = true;
            $(window).scrollTop(0);
        };
        exam.submitExam = function () {
            Dialog.confirm('Submit Exam', 'Do you want to submit exam?', function (result) {
                $scope.$apply(function () {if(result) exam.checkAnswers();});
            });
        };
        exam.init = function () {
            $(window).scrollTop(0);
            exam.index = $route.current.params.index;
            exam.dictionary = appStorage.dictionary()[exam.index];
            exam.criteria = appStorage.settings().criteria;
            exam.showScore = false;
            if(!exam.dictionary) $location.path('/');
            else if(exam.dictionary.items.length < 5) Dialog.alert('Not Enough Dictionary Items', 'A Dictionary must have at least 5 dictionary items to generate an exam.', function () {
                $scope.$apply(function () {
                    $location.path('/dictionaries');
                })
            });
            else exam.prepareQuestions();
        };
        exam.init();
    });