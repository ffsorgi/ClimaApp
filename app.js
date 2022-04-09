require('dotenv').config();
require('colors');

const { inquirerMenu, pause, readInput, listPlaces } = require('./helpers/inquirer');
const Searches = require('./models/searches');


const main = async() => {

    let option;
    const searches = new Searches();
    
    do {      
        option = await inquirerMenu();

        switch (option) {
            case 1:
                //Show message
                const place = await readInput('Ciudad:');

                //Search places
                const places = await searches.cities(place);
                const id = await listPlaces(places);
                if(id === 0) continue; 
               
                //Map data
                const SelectedPlace = places.find(p => p.id === id);
                const {name, latitude, longitude} = SelectedPlace;

                //Save place in DB
                searches.addToHistoty(SelectedPlace.name);
                
                //Wheather
                const {description, temp, temp_min, temp_max} = await searches.wheather(latitude, longitude);

                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', name.green);
                console.log('Latitud:', latitude);
                console.log('Longitud:', longitude);  
                console.log('Temperatura:', temp);
                console.log('Mínima:', temp_min);
                console.log('Máxima:', temp_max);
                console.log('Descripción:', description.green);
                break;
            case 2:
                searches.historyCapitalized.forEach((place, i) => {
                    const index = `${i+1}. `.green;
                    console.log(`${index}${place}`);
                })
                break;
        }
        if ( option !== 0) await pause();    
    } while (option !== 0);
}

if(process.env.MAPBOX_KEY.length === 0 || process.env.OPENWEATHERMAP_KEY.length === 0) {
    console.log('Tienes que asignar las api key en el archivo .env')
}else{
    main();
}