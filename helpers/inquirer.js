const inquirer = require('inquirer');
require('colors');

const questions = [
    {
        type:'list',
        name:'option',
        message:'¿Qué desea hacer?.',
        choices:[
            {
                value: 1,
                name:`${'1'.green}. Buscar ciudad`
            },
            {
                value:2,
                name:`${'2'.green}. Historial`
            },
            {
                value:0,
                name:`${'0'.green}. Salir`
            }
        ]
    }
];

const inquirerMenu = async() => {
    console.clear();
    console.log('========================='.green);
    console.log('  Seleccione una opción  ');
    console.log('=========================\n'.green);

    const { option } = await inquirer.prompt(questions);
    return option;
}

const readInput = async(message) => {

    const question =[
        {
            type:'input',
            name:'description',
            message,
            validate(value){
                if(value.length === 0){
                    return 'Por favor ingrese un valor.';
                }
                return true;
            }
        }
    ];

    const { description} = await inquirer.prompt(question);
    return description;
}

const listPlaces = async(places) => {

    const choices = places.map((place, i) =>{

        const { id, name } = place;

        i = `${i+1}. `.green;

        return {
            value:id,
            name:`${i} ${ name }`
        }
    });

    choices.unshift({
        value:0,
        name: '0. '.green + 'Cancelar'
    });

    const questions = [
        {
            type:'list',
            name:'id',
            message:'Seleccione el lugar:',
            choices
        }
    ]

    const {id} = await inquirer.prompt(questions);
    return id;
}

const confirm = async(message) => {

    const question =[
        {
            type:'confirm',
            name:'ok',
            message
        }
    ]

    const { ok } = await inquirer.prompt(question);
    return ok;
}

const pause = async() => {
    await inquirer.prompt({
        type: 'input',
        name: 'pause',
        message: `\nPrecione${' ENTER '.green}para continuar...\n`,
    })
}


module.exports = {
    confirm,
    inquirerMenu,
    readInput,
    pause,
    listPlaces
}