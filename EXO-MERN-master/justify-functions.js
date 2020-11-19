function isItWord(word) {
    words = word.split('\n');
    return words.length > 1 && words[1].length > 0;
}

function createLine(words, endWithReturn = false, clear = false, missingSpaces = 0) {

    if (!clear) {
        return endWithReturn ? words.join(' ') + '\n' : words.join(' ')
    } else {
        // we should add spaces and calculate whatis missing
        // check if is it possible to justify it or not 
        if (missingSpaces > words - 1) {
            return endWithReturn ? words.join(' ') + '\n' : words.join(' ')
        }
        let wordIndex = 0;
        while (wordIndex < (words.length / 2) && missingSpaces > 0) {
            words[wordIndex] = words[wordIndex] + ' ';
            missingSpaces--;
            if (missingSpaces > 0) {
                words[words.length - wordIndex - 1] = ' ' + words[words.length - wordIndex - 1]
                missingSpaces--;
            }
            wordIndex++;
        }

        return endWithReturn ? words.join(' ') + '\n' : words.join(' ')

    }
}

function justify(text, l) {

    // split the text input into small words 
    let words = text.split(" ");
    let outputLines = [];
    let wordIndex = 0;
    let newLine = [];
    let currentLength = 0;
    let line = "";
    while (wordIndex < words.length) {
        let currentWord = words[wordIndex];
        if (currentWord.indexOf('\n') !== -1) {
            // create line and add a trailing \n 

            if (isItWord(currentWord)) {
                line = createLine(newLine, false, false);
                outputLines.push(line);
                words[wordIndex] = words[wordIndex].replace('\n', '');
                newLine = [];
                currentLength = 0;
            } else {
                wordIndex++;
            }

        } else if (currentLength + currentWord.length < l) {
            // we can add the word 
            newLine.push(currentWord);
            if (newLine.length == 1) {
                currentLength = currentLength + currentWord.length;
            } else {
                currentLength = currentLength + currentWord.length + 1;
            }
            wordIndex++;
        } else {
            // if the length will be exceeded
            line = createLine(newLine, false, true, l - currentLength);
            outputLines.push(line);
            newLine = [];
            currentLength = 0;
        }

    }
    line = createLine(newLine, true, false);
    outputLines.push(line);
    return outputLines.join('\n');

}


module.exports = {justify}