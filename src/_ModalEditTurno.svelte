<script>
 import { FirebaseApp, User, Doc, Collection } from "sveltefire";
 import firebase from "firebase/app";
 const db = firebase.firestore();
 import moment from 'moment';
 import 'moment/locale/es';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

 
 export let idTurno;

/* Funciones Ya creadas */
 let lapso;
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

  //console.log(arr_dia_semana)

  if (arr_dia_semana.length >= 0) {
          return arr_dia_semana
      } else {
          throw new Error(arr_dia_semana);
      }
}

/* var every */
let tD;
let inputFecha;
let horario;
let promise = '';
let answer ='';


</script>

<!-- This is the modal -->
<div id="ModalEditTurno" uk-modal>
    <div class="uk-modal-dialog uk-modal-body">
    <button class="uk-modal-close-default" type="button" uk-close></button>
        <Doc path={`turnos/${idTurno}`} let:data={tD} let:ref log>
            <div slot="loading"><div uk-spinner></div></div>
            <h2 class="uk-modal-title uk-text-meta">Cambiar turno {moment(tD.diaSelect).format('dddd DD-MM-YYYY')} a las {tD.hora} para: </h2>
<div class="uk-form-horizontal uk-margin-large">


 <div class="uk-margin">
 <label class="uk-form-label" for="form-horizontal-text">Cambiar el turno para el dia: </label>
 <div class="uk-form-controls">
 <input class="uk-input" id="form-horizontal-text" type="date" bind:value={inputFecha} on:change={({ target: { value } }) => promise = fetchData(moment(value) , moment(value).day() ) } />
</div>
</div>           
            {#await promise }
            <div uk-spinner></div>
            {:then values}

<div class="uk-margin">
<label class="uk-form-label" for="form-horizontal-select">Turnos disponibles: </label>
<div class="uk-form-controls">
   <select class="uk-select uk-margin-top" multiple bind:value={horario} size="5" disabled={!inputFecha} on:change="{({ target: { value } }) => answer = value}">
           {#each values as hor}
               <option value={hor}>
                   {hor}
               </option>
           {/each}
   </select>
</div>
</div>
        {#if answer}
            <p class="uk-text-meta">{` Se ha modificado el turno para el dia ${moment(inputFecha).format('dddd DD MM YYYY') || '[esperando..]' } a las ${horario || '[esperando...]'} hs.`} </p>
        {/if}
      <button class="uk-button uk-button-primary uk-float-right uk-margin-top" disabled={!answer} 
      on:click={()=>{ ref.update({diaSelect: moment(inputFecha).valueOf(), hora: `${horario}`}).then(()=>{
        horario='';
        inputFecha='';
        UIkit.modal("#ModalEditTurno").hide();
        UIkit.notification({message: "<span uk-icon='icon: calendar'></span> Turno registrado con éxito.", pos: 'top-center', status: 'primary'})
        });
      }}
      >Confirmar cambio de turno</button>
            {:catch error}
            <p>{error.message}</p>
            {/await}
</div>        
        </Doc>
    </div>
</div>