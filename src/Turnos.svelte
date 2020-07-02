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

  let lapso;
  export let diaSeleccionado;
  export let dia;

  db.collection(`tempo`).doc(`time`).get().then(doc => {
   lapso = doc.data().time;
  }).catch(function(error) {
    console.log("Error getting document:", error);
  });

const TotalTurnos = (I1,F1) => {
    var x = moment(I1,'HH:mm');
    var y  = moment(F1,'HH:mm');
    var duration =  moment.utc(moment(y).diff(moment(x))).format('HH:mm');
    return moment.duration(duration).asMinutes();
}

async function fetchData(selectedday, dayofweek){
  let arr_dia_seleccionado = [];
  await db.collection(`turnos`).where("diaSelect","==",moment(selectedday).valueOf()).get().then(res=>{
            res.forEach( doc => {
                  //console.log(doc.data().hora);
                  arr_dia_seleccionado.push(doc.data().hora)
            });
        });


 let arrM = [];
 let arrT = [];
 let arrN = [];
 let i=0; 
 let arr_dia_semana = [];

 
var docRef = db.collection(`horarios`).doc(`${dayofweek}`);
await docRef.get().then(doc=>{

    var inicioM =  moment(doc.data().mI,'HH:mm');
    var finM =  moment(doc.data().mF,'HH:mm');
    for (var m = moment(inicioM); m.isBefore(finM); m.add(lapso, 'minutes'))  {
        /* console.log(m.format('HH:mm')); */
           arrM.push(m.format('HH:mm'));
        }

    var inicioT =  moment(doc.data().tI,'HH:mm');
    var finT =  moment(doc.data().tF,'HH:mm');
    for (var m = moment(inicioT); m.isBefore(finT); m.add(lapso, 'minutes'))  {
        /* console.log(m.format('HH:mm')); */
          arrT.push(m.format('HH:mm'));
        }

     var inicioN =  moment.utc(doc.data().nI,'HH:mm');
     var finN =  moment.utc(doc.data().nF,'HH:mm');
     const counter = TotalTurnos(inicioN,finN)/lapso;
     for (var m = moment(inicioN); i < counter ; m.add(lapso, 'minutes'))  {
          arrN.push(m.format('HH:mm'));
        i++
      } 
  })

  arr_dia_semana = arrM.concat(arrT,arrN)
  arr_dia_semana = arr_dia_semana.filter(item => !arr_dia_seleccionado.includes(item))

//console.log(selectedday)

  if (arr_dia_semana.length >= 0) {
          return arr_dia_semana
      } else {
          throw new Error(arr_dia_semana);
      }

}


import MODALCOMFIRM from "./ModalConfirm.svelte"
/* Modal */
let fecha; 
let hora;
async function ConfirmarTurno(data){
   fecha = data.fecha;
   hora = data.hora;
   UIkit.modal("#modal-confirm-1").show();
}

/* Save Data */
  let refDoc;
  let tipoDocumento;
  let dni;
  let turnoConfirmado = true;
  const saveData = async() => {
  var diaSelect = moment(new Date(fecha)).valueOf();
     await db.collection(`turnos`).add({diaSelect,hora,tipoDocumento,dni,turnoConfirmado}).then(docRef=>{
       refDoc = docRef.id;
       console.log("Document written with ID: ", refDoc);
        dni = '';
        tipoDocumento = '';
        UIkit.modal("#modal-confirm-1").hide();
        UIkit.modal("#modal-confirm-2").show();
      }).catch(function(error) {
          console.error("Error adding document: ", error);
      });
  }


</script>

<User let:user let:auth let:error>
<h3 class="uk-text-capitalize">{moment(dia).format("dddd D MMMM YYYY")}</h3>
{#await fetchData(dia,diaSeleccionado)}
<div uk-spinner></div>
{:then items }
<ul class="js-filter uk-child-width-1-1@m  uk-child-width-1-2@m uk-text-center " uk-grid>
{#each items as itemm}
        <li>
            <div class="uk-card uk-card-default uk-card-body uk-card-hover hand" 
                on:click={()=>{ConfirmarTurno({fecha:dia, hora:itemm})}}>
            <span uk-icon="icon: clock"></span> {itemm}</div>
        </li>
{/each}
</ul>
{:catch error}
    <p>{error.message}</p>
{/await}
</User>

<!-- MODAL DATA -->

<div id="modal-confirm-1" uk-modal>
    <div class="uk-modal-dialog">
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <form class="uk-form-horizontal uk-margin-large" on:submit|preventDefault={()=>{saveData()}}>
        <div class="uk-modal-header">
            <h2 class="uk-modal-title">{moment(fecha).format("dddd, D MMM YYYY") }, a las {hora} hs</h2>
        </div>
        <div class="uk-modal-body">

<div class="uk-grid-small" uk-grid>
              <div class="uk-width-1-2@s">
                  <div uk-form-custom="target: > * > span:first-child">
                      <select bind:value={tipoDocumento} >
                          <option value="" selected>Tipo.Doc</option>
                          <option value="D.N.I">D.N.I</option>
                          <option value="L.C">L.C</option>
                          <option value="L.E">L.E</option>
                      </select>
                      <button class="uk-button uk-button-default" type="button" tabindex="-1">
                          <span></span>
                          <span uk-icon="icon: chevron-down"></span>
                      </button>
                  </div>
              </div>
          <div class="uk-width-1-2@s">
                  <input class="uk-input" id="form-horizontal-text" bind:value={dni} type="text" placeholder="Informacion requerida" disabled={!tipoDocumento} >
          </div>
</div>

        </div>
        <div class="uk-modal-footer uk-text-right">
            <button class="uk-button uk-button-secondary" disabled={!dni} >Confirmar turno</button>
        </div>
        </form>
    </div>
</div>

<MODALCOMFIRM docReference={refDoc} />

