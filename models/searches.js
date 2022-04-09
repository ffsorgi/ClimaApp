const fs = require('fs');
const axios = require('axios');

class Searches {

    history = [];
    dbPath = './db/db.json';

    constructor(){
        this.readDB();
    }

    get historyCapitalized(){

        return this.history.map( item => {
            return item.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
        })
    }

    get paramsMapBox() {
        return{  
            'access_token':process.env.MAPBOX_KEY,
            'limit':5,
            'lenguage':'es'
        }
    }

    get paramsWeather(){
        return {
            'appid':process.env.OPENWEATHERMAP_KEY,
            'units':'metric',
            'lang':'es'
        }
    }

    async cities(place){
        
        try {
            const instance= axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
                params: this.paramsMapBox
            });
            const response = await instance.get();
            return response.data.features.map(place =>({
               id:place.id,
               name:place.place_name,
               latitude:place.center[1],
               longitude:place.center[0]

            }));
        } catch (error) {
            return 'Ciudad no encontrada';
        }

    }

    async wheather(lat, lon){

        try {
            
            const instance= axios.create({
                baseURL:`https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsWeather, lat, lon}
            })

            const response = await instance.get();
            const {weather, main} = response.data;
            const {description} = weather[0];
            const {temp, temp_min, temp_max} = main;
            return {description, 
                    temp, 
                    temp_min, 
                    temp_max
                };

        } catch (error) {
            return 'No se encontró el clima';
        }

    }

    addToHistoty(place){

        if(this.history.includes(place.toLowerCase())){
            return;
        }
        this.history = this.history.splice(0,5);
        this.history.unshift(place.toLowerCase());      

        this.saveDB();
    }

    saveDB(){

        const payload = {
            history:this.history
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    readDB(){

        if(!fs.existsSync(this.dbPath)) return;

        const information = fs.readFileSync(this.dbPath, 'utf-8');

        if(!information) return;

        const data = JSON.parse(information);

        this.history = data.history;

    }

}

module.exports = Searches;