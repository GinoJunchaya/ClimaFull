import React, {Component} from 'react';
import $ from 'jquery';
import "./clima.css";

class Clima extends Component{

    constructor(props, context){
        super(props);
        this.state = {
            loading: false,
            datosClima: undefined,
            climaApiKey: "894da49a97d24e28b9b225614190402",
            mapboxApiKey: "pk.eyJ1IjoiZ2lub2p1bmNoYXlhIiwiYSI6ImNqcnM3djQzaTFudG00NGw5M3d2NmY3ajUifQ.aPQrAClI7neKrXEwua_QwQ",
            ciudad: "Asunción",
            medidaTemperatura: "C",
            temperaturaMostrar: undefined
        };
    }

    componentWillMount(){
        this.getClimaActual();
    }

    render(){

        var datosClima = this.state.datosClima;
        var temperaturaMostrar = this.state.temperaturaMostrar;

        if(this.state.loading){
            var loading = require("./loading.gif");
            return(
                <section className="clima-container">               
                    <img src={loading} style={{margin: "auto"}}/>
                </section>
            );
        }

        if(datosClima === undefined || temperaturaMostrar === undefined){
            return(
                <section>
                    <span>No hay datos</span>
                    <button onClick={this.getClimaActual.bind(this)}>Actualizar</button>
                </section>
            );
        }
        var diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        var fecha = new Date(datosClima.location.localtime);  
        return(
            <section className="clima-container">
                <section className="clima-block-left">
                    <section>
                        <h3><b>{datosClima.location.name}</b></h3>
                        <h4>{diasSemana[fecha.getUTCDay()] + ", " + fecha.toLocaleTimeString()}</h4>
                        <h4>{datosClima.current.condition.text}</h4>
                    </section>
                    <section>
                        <h1>
                            <img src={datosClima.current.condition.icon} className="img-visor"/>
                            <span className="temperatura-visor">{Math.ceil(temperaturaMostrar)}</span>&nbsp;
                            <a style={{fontWeight: this.state.medidaTemperatura === "C" ? "500" : "200"}} href="#" onClick={this.seleccionarCelcius.bind(this)} className="temperatura-change">C°</a>&nbsp;
                            <a style={{fontWeight: this.state.medidaTemperatura === "F" ? "500" : "200"}} href="#" onClick={this.seleccionarFarenheit.bind(this)} className="temperatura-change">F°</a>
                        </h1>
                    </section>
                </section>
                <section className="clima-block-right">
                    <h4><b>Visiblidad:</b> {datosClima.current.vis_km} km</h4>
                    <h4><b>Humedad:</b> {datosClima.current.humidity}%</h4>                    
                    <button onClick={this.getClimaActual.bind(this)}>Actualizar</button>                    
                </section>
            </section>
        );
    }

    getClimaActual(){        
        this.setState({
            loading: true
        });

        var geolocalizacion = this.getCiudadPorCoordenadas();
        console.log(geolocalizacion);

        $.ajax({
            type: "GET",
            url: "http://api.apixu.com/v1/current.json?key=" + this.state.climaApiKey + "&q=" + this.state.ciudad,
            success: function (res) {
                this.setState({
                    datosClima: res,
                    temperaturaMostrar: res.current.temp_c,
                    loading: false
                });
            }.bind(this),
            error: function(xhr, status, err){
                this.setState({
                    datosClima: undefined,
                    loading: false
                });
                console.log(err);
            },
            timeout: 3000
        });
    }

    getCiudadPorCoordenadas(){
        var coordenadas = this.getCoordenadasUsuario();
        console.log("Coordenadas", coordenadas);
        if(coordenadas === undefined){
            return undefined;
        }
        $.ajax({
            type: "GET",            
            url: "https://api.mapbox.com/geocoding/v5/mapbox.places/" + coordenadas.lon + "," + coordenadas.lat + ".json?access_token" + this.state.mapboxApiKey,
            async: false,
            success: function (res) {
                console.log(res);
                return res;
            }.bind(this),
            error: function(xhr, status, err){
                console.log(err);
                return undefined;                
            },
            timeout: 15000
        });
    }

    seleccionarCelcius(e){
        e.preventDefault();
        this.setState({medidaTemperatura: "C", temperaturaMostrar: this.state.datosClima.current.temp_c});
    }

    seleccionarFarenheit(e){
        e.preventDefault();
        this.setState({medidaTemperatura: "F", temperaturaMostrar: this.state.datosClima.current.temp_f});
    } 

    getCoordenadasUsuario(){
        if (navigator.geolocation){
            var currentPosition = navigator.geolocation.getCurrentPosition(function(objPosition){
                var lon = objPosition.coords.longitude;
                var lat = objPosition.coords.latitude;
                console.log(lon);
                return lon;
            },
            function(objPositionError){
                switch (objPositionError.code){
                    case objPositionError.PERMISSION_DENIED:
                        console.log("No se ha permitido el acceso a la posición del usuario.");
                        break;
                    case objPositionError.POSITION_UNAVAILABLE:
                        console.log("No se ha podido acceder a la información de su posición.");
                        break;
                    case objPositionError.TIMEOUT:
                        console.log("El servicio ha tardado demasiado tiempo en responder.");
                        break;
                    default:
                        console.log("Error desconocido.");
                };
                return undefined;
            },
            {
                maximumAge: 75000,
                timeout: 15000
            });
        }
        else{
            console.log("Su navegador no soporta la API de geolocalización.");
            return undefined;
        }
        console.log("Current position", currentPosition);
        return currentPosition;
    }

}

export default Clima;