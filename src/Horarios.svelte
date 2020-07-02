<script>

  import { FirebaseApp, User, Doc, Collection } from "sveltefire";
  import firebase from "firebase/app";
  import "firebase/firestore";
  import "firebase/auth";
  import "firebase/performance";
  import "firebase/analytics";
  const db = firebase.firestore();
  import moment from 'moment';
  import 'moment/locale/es';
  import UIkit from 'uikit';
  import Icons from 'uikit/dist/js/uikit-icons';

  export let dia;

  let dni;
  let turno;
  let turno_confirmado = true;

  const saveData = async() => {
  var diasel = moment(dia).valueOf();
     await db.collection(`turnos`).add({diasel,dni,turno, turno_confirmado}).then(resp=>{
        dni = '';
        turno ='';
        console.log("Turno almacenado con exito");
    }) 
  }

</script>
<h3 class="uk-text-capitalize">{moment(dia).format("dddd, D MMM YYYY")}</h3>


<!--  
<form on:submit|preventDefault={()=>{saveData()}}>
<input type="number" bind:value={dni} ><br>
<input type="time" bind:value={turno} ><br>
<button>Confirmar</button>
</form>

-->