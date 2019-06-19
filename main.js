// GLOBALS
var alphabet = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
    'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
    't', 'u', 'v', 'w', 'x', 'y', 'z'
]
var movies = [
    'Title', 'Inside Out', 'Django Unchained', 'La La Land', 'Gravity', 'Black Swan', 'Mad Max: Fury Road', 'Avengers: Endgame', 'Coco', 'Toy Story 3', 'Inception', 'True Grit', 'How to Train Your Dragon', 'Looper',
    'Shutter Island', 'The Wolf of Wall Street', 'The Grand Budapest Hotel', 'Guardians of the Galaxy', 'Whiplash', 'The Revenant', 'Star Wars: Episode VII - The Force Awakens', 'Arrival', 'Hacksaw Ridge', 'Avengers: Infinity War',
    'Logan', 'Spider-Man: Into the Spider-Verse', 'Captain America: Civil War', 'The Avengers', 'Interstellar', 'Boyhood', 'The Dark Knight Rises', 'Drive', 'Jagten', 'The Social Network', 'Nightcrawler', 'X-Men: Days of Future Past',
    'The Nice Guys', 'Gone Girl', 'Edge of Tomorrow', 'Ah-ga-ssi', 'Wind River', 'John Wick: Chapter 2', 'Get Out', 'Guardians of the Galaxy Vol. 2', 'The Artist', 'Mientras duermes', 'Flight', 'Serbuan Maut', 'Skyfall', 'Relatos salvajes',
    'Prisoners', 'Big Hero 6', 'Dawn of the Planet of the Apes', 'How to Train Your Dragon 2', 'The Lego Movie', 'Wreck-It Ralph', 'Serbuan Maut 2: Berandal', 'Creed', 'Moana', 'Frozen', 'Rogue One', 'Star Trek Into Darkness', 'Moonrise Kingdom',
    'Silver Linings Playbook', 'The Hurt Locker', 'Ex Machina', 'Sicario', 'Three Billboards Outside Ebbing, Missouri', 'Mission: Impossible - Fallout', 'First Man', 'A Star Is Born', 'War for the Planet of the Apes', 'Isle of Dogs',
    'Bad Times at the El Royale', 'Roma', 'The Disaster Artist', 'Incredibles 2', 'The Big Sick', 'The Martian', 'Searching for Sugar Man', '12 Years a Slave', 'Her', 'Short Term 12', 'Captain America: The Winter Soldier', 'Argo',
    'Spotlight', 'Room', 'Three Identical Strangers', 'Incendies', 'Nebraska', 'The Cove', '127 Hours', 'Rise of the Planet of the Apes', 'Thor: Ragnarok', 'Kedi', 'Before Midnight', 'Intouchables', 'Kick-Ass',
    'Joheunnom nabbeunnom isanghannom', 'Fast Five', 'X: First Class', 'Deadwood'
]
var body_parts = [
    'hangman-head', 'hangman-neck', 'hangman-left-arm',
    'hangman-right-arm', 'hangman-torso', 'hangman-left-leg', 'hangman-right-leg',
    'hangman-noose',
]
var gallow_parts = [
    'hangman-stand-base', 'hangman-stand-rod', 'hangman-stand-top',
]
var game_over = true;
var player_wins = false;
var max_guesses = 8;
var player_guesses = 0;
var player_word = '';
var player_letter = '';
var blanks = '';
var secret_word = '';
var element_drawn_or_pressed = {};


// game control
const blanks_paragraph = document.getElementById('blanks');
const game_state = document.getElementById('game-state');
const game_instructions = document.getElementById('game-instructions');
const congratulations = document.getElementById('congratulations');
congratulations.classList.add('fadeinout');
const play_game_button = document.getElementById('play-game');
play_game_button.onclick = function () {
    reset();
}


// game elements
const letter_buttons = document.getElementById('letter-buttons');
const buttons = document.createElement('ul');
function letter_button_click() {
    player_letter = this.innerHTML;
    if (!game_over) {
        if (!this.classList.contains('active-letter')) {
            this.classList.add('active-letter');
            console.log(`button ${this.innerHTML.toUpperCase()} was pressed`);
            // WHERE CODE GETS EXECUTED
            play_hangman();
        }
    }
}
buttons.id = 'alphabet';
letter_buttons.appendChild(buttons);
for (var i = 0; i < alphabet.length; i++) {
    list_element = document.createElement('li');
    list_element.id = `letter-${alphabet[i]}`;
    list_element.innerHTML = alphabet[i];
    list_element.classList.add('letter-button');
    list_element.onclick = letter_button_click
    buttons.appendChild(list_element);
}

// hangman body parts
for (const body_part of body_parts) {
    let html_dom_element = document.getElementById(body_part);
    html_dom_element.classList.add('fadeinout');
    html_dom_element.classList.add('fade');
}

// html generic functions
function toggle_show(id) {
    const element = document.getElementById(id);
    element.classList.toggle('fade');
}
var click_$event = new MouseEvent('click', {
    'view': window,
    'bubbles': true,
    'cancelable': false
});
// https://stackoverflow.com/a/7382461
String.prototype.replaceAt=function(index, char) {
    var a = this.split('');
    a[index] = char;
    return a.join('');
}
// https://stackoverflow.com/a/25352300
function is_alpha(str) {
    var code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (// !(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123)) { // lower alpha (a-z)
            return false;
        }
    }
    return true;
};
play_game_button.dispatchEvent(click_$event);


// game functions
function draw_blanks() {
    let innerHTML = '';
    for (let i = 0; i < secret_word.length; i++) {
        const secret_letter = secret_word[i];
        if (is_alpha(secret_letter)) {
            innerHTML += '_';
        } else {
            innerHTML += secret_letter;
        }
    }
    blanks_paragraph.innerHTML = innerHTML;
    blanks = innerHTML;
}
function draw_blanks_correct() {
    player_letter = player_letter.toLowerCase();
    for (let i = 0; i < secret_word.length; i++) {
        let secret_letter = secret_word[i];
        if (secret_letter.toLowerCase() == player_letter) {
            blanks = blanks.replaceAt(i, secret_letter);
        }
    }
    blanks_paragraph.innerHTML = blanks;
}
function draw_hangman() {
    const body_part = body_parts[player_guesses - 1];
    if (body_part && !element_drawn_or_pressed[body_part]) {
        toggle_show(body_part);
        element_drawn_or_pressed[body_part] = true;
    }
}
function erase_hangman() {
    for (const body_part of body_parts) {
        if (element_drawn_or_pressed[body_part])
            toggle_show(body_part);
        element_drawn_or_pressed[body_part] = false;
    }
}
function toggle_gallows() {
    setTimeout(() => {
        toggle_show('hangman-stand-base');
    }, 500);
    setTimeout(() => {
        toggle_show('hangman-stand-rod');
    }, 1000);
    setTimeout(() => {
        toggle_show('hangman-stand-top');
    }, 1500);
}
function draw_game_state() {
    let text = '';
    let guess_text = `You've used ${player_guesses} out of ${max_guesses} guesses.`;
    if (game_over) {
        text += 'Game over!';
        if (player_wins) {
            text += ' You won!';
        } else {
            text += ' You lost!';
        }
        text += ` ${guess_text}`;
    } else {
        text = guess_text;
    }
    game_state.innerHTML = text;
}
function generate_secret_word() {
    var index = Math.floor(Math.random() * movies.length);
    let secret = movies[index];
    return secret;
}
function letter_in_secret_word() {
    let guess_lower_case = player_letter.toLowerCase();
    let secret_lower_case = secret_word.toLowerCase();
    for (let i = 0; i < secret_lower_case.length; i++) {
        const secret_lower_case_letter = secret_lower_case[i];
        if (guess_lower_case == secret_lower_case_letter) {
            return true
        }
    }
    return false;
}
function guessed_word_is_correct() {
    if (secret_word == blanks) {
        return true;
    }
}
function draw_congratulations(success) {
    if (success) {
        congratulations.innerHTML = 'You\'ve won! Congratulations! Take what you\'ve learned with you on your journey to becoming a world-class programmer!';
        congratulations.classList.add('alert');
        congratulations.classList.add('alert-success');
    }
    else {
        congratulations.innerHTML = 'You\'ve lost! Comiserations! At least now you know some areas where you can improve! Never give up and always do your best!';
        congratulations.classList.add('alert');
        congratulations.classList.add('alert-warning');
    }
    toggle_show('congratulations');
}
function reset() {
    game_instructions.innerHTML = `Get ready for a new game with ${max_guesses} guesses!`;
    toggle_show('congratulations');
    setTimeout(() => {
        congratulations.classList.add('alert');
        congratulations.classList.add('alert-success');
        congratulations.classList.add('alert-warning');
        congratulations.innerHTML = '';
    }, 1500);
    erase_hangman();
    toggle_gallows();

    game_over = false;
    player_wins = false;
    player_word = '';
    player_letter = '';
    player_guesses = 0;
    blanks = '';
    blanks_filled = '';
    secret_word = '';

    // WHERE CODE GETS EXECUTED
    setup_hangman();

    // reset button states
    for (var i = 0; i < alphabet.length; i++) {
        let list_element_id = `letter-${alphabet[i]}`;
        const list_element = document.getElementById(list_element_id);
        setTimeout(() => {
            list_element.classList.remove('active-letter')
            toggle_show(list_element_id);
            element_drawn_or_pressed[list_element_id] = false;
            setTimeout(() => {
                toggle_show(list_element_id);
                element_drawn_or_pressed[list_element_id] = true;
            }, 1000 + 30 * i);
        }, 30 * i);
    }

    setTimeout(() => {
        draw_game_state();
    }, 1000);

    setTimeout(() => {
        toggle_gallows();
    }, 1500);
}


function setup_hangman() {
    secret_word = generate_secret_word();
    console.log(secret_word);
    draw_blanks();
}


function play_hangman() {
    // maybe also word guessing
    if (player_guesses < max_guesses) {
        console.log('still in the game');
        // maybe also word guessing
        if (letter_in_secret_word()) {
            draw_blanks_correct();
            if (guessed_word_is_correct()) {
                game_over = true;
                player_wins = true;
            }
        } else {
            player_guesses += 1;
            if (player_guesses == max_guesses) {
                game_over = true;
                player_wins = false;
            }
        }

        if (!game_over) {
            draw_hangman();
        }
    }

    if (game_over) {
        draw_hangman();
        draw_congratulations(player_wins);
    }
    draw_game_state();
}
