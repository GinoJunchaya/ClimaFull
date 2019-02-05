import React, {Component} from 'react';
import $ from 'jquery';
import "./clima.css";

class Clima extends Component{

    constructor(props, context){
        super(props);
        this.state = {
            loading: false,
            datosClima: undefined,
            apiKey: "894da49a97d24e28b9b225614190402",
            ciudad: "Asuncion",
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
        if(datosClima === undefined || temperaturaMostrar === undefined){
            return(
                <span>No hay datos</span>
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
                </section>
            </section>
        );
    }

    getClimaActual(){
        $.ajax({
            type: "GET",
            url: "http://api.apixu.com/v1/current.json?key=" + this.state.apiKey + "&q=" + this.state.ciudad,
            success: function (res) {
                this.setState({datosClima: res, temperaturaMostrar: res.current.temp_c});
            }.bind(this),
            error: function(xhr, status, err){
                console.log(err);
            },
            timeout: 3000
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

}

export default Clima;