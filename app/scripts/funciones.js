const juego = (function() {

    let player1 = {
        name: 'Ana',
        life: 50
    }

    let player2 = {
        name: 'Luis',
        life: 50
    }


    function welcome() {
        alert('Bienvenidos');
    }

    function welcomeWithName(name) {

        alert(`Bienvenido ${name}`);

    }

    function welcomeWithNameAndTitle(title = 'Señor/Señora', name) {

        alert(`Bienvenido ${title} ${name}`);

    }

    function concatName(firstName, lastName) {

        let firstNameUpper = firstName.toUpperCase();

        let lastNameUpper = lastName.toUpperCase();
        if (lastNameUpper === firstNameUpper) {
            return;
        }
        return firstNameUpper.concat(" ".concat(lastNameUpper));

    }

    const simpleShoot = function () {
        alert('Disparo');
    }

    const shoot = function (damage) {
        alert(`Recibiste daño de ${damage} puntos`);
    }

    const randomShoot = function () {
        return Math.floor(Math.random() * 10);
    }

    const startFight = () => {

        alert('Que inicien los juegos');

    }


    const fightWithDamage = (player, damage) => {

        alert(`${player} recibió un ataque de ${damage} puntos`);

    }
    const fatality = player => alert(`Finish him ${player}`);

    const endGame = player => {
        if (player.life <= 0) {
            fatality(player.name);
        }
    }

    const fight = player => {

        alert(`Turno del jugador ${player}`);
        if (player === player1.name) {
            let damage = randomShoot();
            player2.life = player2.life - damage;
            fightWithDamage(player2.name, damage);
            endGame(player2);
        } else if (player === player2.name) {
            let damage = randomShoot();
            player1.life = player1.life - damage;
            fightWithDamage(player1.name, damage);
            endGame(player1);
        } else {
            startFight();
        }
    }

    return { fight }
})()


