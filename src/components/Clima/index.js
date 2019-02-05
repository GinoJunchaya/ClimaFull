import React, {Component} from 'react';
import $ from 'jquery';

class Clima extends Component{

    constructor(props, context){
        super(props);
        this.state = {
            loading: false,
            datosClima: undefined,
            apiKey: "894da49a97d24e28b9b225614190402",
            ciudad: "Asuncion"
        };
    }

    componentWillMount(){
        this.getClimaActual();
    }

    render(){
        return(
            <section></section>
        );
    }

    getClimaActual(){
        $.ajax({
            type: "GET",
            url: "http://api.apixu.com/v1/current.json?key=" + this.state.apiKey + "&q=" + this.state.ciudad,
            success: function (res) {
                console.log(res);
            },
            error: function(xhr, status, err){
                console.log(err);
            },
            timeout: 3000
        });
    }

}

export default Clima;