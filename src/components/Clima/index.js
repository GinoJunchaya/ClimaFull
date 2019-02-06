import React, {Component} from 'react';
import $ from 'jquery';
import "./clima.css";

class Clima extends Component{

    constructor(props, context){
        super(props);
        this.state = {
            loading: true,
            datosClima: undefined,
            climaApiKey: "894da49a97d24e28b9b225614190402",
            mapboxApiKey: "pk.eyJ1IjoiZ2lub2p1bmNoYXlhIiwiYSI6ImNqcnM3djQzaTFudG00NGw5M3d2NmY3ajUifQ.aPQrAClI7neKrXEwua_QwQ",
            ciudad: "Asunción",
            localizacionMostrar: "Asunción",
            temperaturaMostrar: undefined,
            medidaTemperatura: "C",            
            coordenadas: undefined
        };
    }

    componentWillMount(){
        this.getCoordenadasUsuario();
    }

    render(){

        var datosClima = this.state.datosClima;
        var temperaturaMostrar = this.state.temperaturaMostrar;

        if(this.state.loading){
            var loading = require("./loading.gif");
            return(
                <section className="clima-container">               
                    <img src={loading} style={{margin: "auto"}} alt=""/>
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
                        <h3><b>{this.state.localizacionMostrar}</b></h3><br></br>
                        <section>
                            <h4>{diasSemana[fecha.getUTCDay()] + ", " + fecha.toLocaleTimeString()}</h4>
                            <h4>{datosClima.current.condition.text}</h4>
                        </section>
                        <section>
                            <h1>
                                <img src={datosClima.current.condition.icon} className="img-visor"/>
                                <span className="temperatura-visor">{Math.ceil(temperaturaMostrar)}</span>&nbsp;
                                <a style={{fontWeight: this.state.medidaTemperatura === "C" ? "500" : "200"}}
                                    href="#" onClick={this.seleccionarCelcius.bind(this)} className="temperatura-change">C°
                                </a>&nbsp;
                                <a style={{fontWeight: this.state.medidaTemperatura === "F" ? "500" : "200"}}
                                    href="#" onClick={this.seleccionarFarenheit.bind(this)} className="temperatura-change">F°
                                </a>
                            </h1>
                        </section>
                    </section>
                    <section className="clima-block-right">
                        <h4><b>Visiblidad:</b> {datosClima.current.vis_km} km</h4>
                        <h4><b>Humedad:</b> {datosClima.current.humidity}%</h4>
                        <button onClick={this.getCoordenadasUsuario.bind(this)}>Actualizar</button>
                    </section>
                </section>
        );
    }

    getClimaActual(){
        this.setState({loading: true});
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
            }.bind(this),
            timeout: 3000
        });
    }

    getCiudadPorCoordenadas(){
        var coordenadas = this.state.coordenadas;
        if(coordenadas === undefined){
            return undefined;
        }
        $.ajax({
            type: "GET",            
            url: "https://api.mapbox.com/geocoding/v5/mapbox.places/" + coordenadas.longitude + "," + coordenadas.latitude + ".json?access_token=" + this.state.mapboxApiKey,
            success: function (res) {
                this.setState({
                    localizacionMostrar: res.features[0].place_name,
                    ciudad: res.features[1].text
                }, this.getClimaActual.bind(this));
            }.bind(this),
            error: function(xhr, status, err){
                console.log(err);
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
        var geoOptions = {maximumAge: 75000, timeout: 15000};
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(this.geoSuccess.bind(this), this.geoError.bind(this), geoOptions);
        }
    }

    geoSuccess(position){
        console.log(position.coords.latitude, position.coords.longitude);
        this.setState({coordenadas: position.coords}, this.getCiudadPorCoordenadas.bind(this));
    }

    geoError(){
        this.setState({coordenadas: undefined, loading: false});
    }

}

export default Clima;