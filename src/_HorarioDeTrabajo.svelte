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

  let dias = [
      {id:0 ,dia:"Domingo", mI: "", mF: "", tI: "", tF: "", nI: "",nF:""},
      {id:1 ,dia:"Lunes", mI: "", mF: "", tI: "", tF: "", nI: "",nF:""},
      {id:2 ,dia:"Martes", mI: "", mF: "", tI: "", tF: "", nI: "",nF:""},
      {id:3 ,dia:"Miercoles", mI: "", mF: "", tI: "", tF: "", nI: "",nF:""},
      {id:4 ,dia:"Jueves", mI: "", mF: "", tI: "", tF: "", nI: "",nF:""},
      {id:5 ,dia:"Viernes", mI: "", mF: "", tI: "", tF: "", nI: "",nF:""},
      {id:6 ,dia:"Sabado", mI: "", mF: "", tI: "", tF: "", nI: "",nF:""}
    ]


let time = 1; 
let horariosData=[];


const TotalTurnos = (I1,F1) => {
    var x = moment(I1,'HH:mm');
    var y  = moment(F1,'HH:mm');
    var duration =  moment.utc(moment(y).diff(moment(x))).format('HH:mm');
    
    return moment.duration(duration).asMinutes();
}

async function saveData(pos,mI,mF,tI,tF,nI,nF){
  await db.collection(`horarios`).doc(`${dias[pos].id}`).set(
 {dia: dias[pos].dia ,mI: `${mI}`, mF: `${mF}`, tI: `${tI}`, tF: `${tF}`, nI: `${nI}`, nF: `${nF}`}
  ) 
}


function resetDefault(){
 UIkit.modal.confirm('Se va a resetear el horario actual...').then(function() {
      dias.forEach(async element => {
        await db.collection(`horarios`).doc(`${element.id}`).set(
          {dia: element.dia ,mI: '', mF: '', tI: '', tF: '', nI: '', nF: ''}
        ).then(resp=>{
            UIkit.notification({message: "<span uk-icon='icon: warning'></span> borrando datos...", 
                pos: 'top-right', 
                status: 'danger',
                timeout: 100
            })
            time = 1;
          });
      })
      }, function () {
        UIkit.notification({message: '<span uk-icon=\'icon: check\'></span> Operacion cancelada.', pos: 'top-right', status: 'primary'});
    });
}

</script>
<!-- 1. Firebase App -->
<FirebaseApp {firebase}>
  <User let:user let:auth let:error>

{#if user.isAnonymous}
    <p>404 No data found..</p>
{:else}

<Doc path={`tempo/time`} let:ref={tR} on:data={m => time = (m.detail.data.time)} log >
<div slot="loading"><div uk-spinner></div></div>
<div class="uk-grid-small uk-child-width-1-3@s uk-flex-center uk-text-center" uk-grid>
<div>
  <label class="uk-form-label" for="form-stacked-text">Tiempo entre turnos</label>
  <input class="uk-input" type="number" bind:value={time} min="1" step="1" max="60" placeholder="tiempo" disabled={true}>
  <input class="uk-range" type="range" bind:value={time} min="1" step="1" max="60" on:change={({ target: { value } }) => tR.set({time: value})} >
</div>  
<div>

</div>
<div>

</div>
</div>
</Doc>

<Collection path={`horarios`} let:data={horariosData} let:ref log >
<div slot="loading"><div uk-spinner></div></div>

<div class="uk-overflow-auto uk-margin-top">
    <table class="uk-table">
      <caption>Configurar Horarios de trabajo</caption>
      <thead>
        <tr>
          <th class="uk-table-expand">Dias Laborales</th>
          <th class="uk-table-shrink">M-Inicio</th>
          <th class="uk-table-shrink">M-Fin</th>
          <th class="uk-table-shrink">T-Inicio</th>
          <th class="uk-table-shrink">T-Fin</th>
          <th class="uk-table-shrink">N-Inicio</th>
          <th class="uk-table-shrink">N-Fin</th>
          <th class="uk-table-shrink"></th>
          <th class="uk-table-shrink"></th>
          <th class="uk-table-shrink"></th>
        </tr>
      </thead>
      <tbody>
{#each horariosData as dia, index}

  <tr>
          <td>
             <div class="uk-width-1-1@s">
             <!-- No se porqeu se me ocurrio esto -->
              <input class="uk-input" type="text" bind:value={dia.dia} disabled={true}>
            </div>
          </td>
          <td>
            <div class="uk-width-1-1@s">
              <input class="uk-input" type="time" bind:value={dia.mI} on:change={()=>{saveData(index,dia.mI,dia.mF,dia.tI,dia.tF,dia.nI,dia.nF)}}>
            </div>
          </td>
          <td>
            <div class="uk-width-1-1@s">
              <input class="uk-input" type="time" bind:value={dia.mF} on:change={()=>{saveData(index,dia.mI,dia.mF,dia.tI,dia.tF,dia.nI,dia.nF)}}>
            </div>
          </td>
            <td>
            <div class="uk-width-1-1@s">
              <input class="uk-input" type="time" bind:value={dia.tI} on:change={()=>{saveData(index,dia.mI,dia.mF,dia.tI,dia.tF,dia.nI,dia.nF)}}>
            </div>
          </td>
          <td>
            <div class="uk-width-1-1@s">
              <input class="uk-input" type="time" bind:value={dia.tF} on:change={()=>{saveData(index,dia.mI,dia.mF,dia.tI,dia.tF,dia.nI,dia.nF)}}>
            </div>
          </td>
            <td>
            <div class="uk-width-1-1@s">
              <input class="uk-input" type="time" bind:value={dia.nI} on:change={()=>{saveData(index,dia.mI,dia.mF,dia.tI,dia.tF,dia.nI,dia.nF)}}>
            </div>
          </td>
          <td>
            <div class="uk-width-1-1@s">
              <input class="uk-input" type="time" bind:value={dia.nF} on:change={()=>{saveData(index,dia.mI,dia.mF,dia.tI,dia.tF,dia.nI,dia.nF)}}>
            </div>
          </td>
          <td>
              <span uk-tooltip="Cant. turnos mañana" class="uk-label" >{Math.floor(TotalTurnos(dia.mI,dia.mF) / time)}</span>
          </td>
          <td>
              <span uk-tooltip="Cant. turnos tarde" class="uk-label" >{Math.floor(TotalTurnos(dia.tI,dia.tF) / time)}</span>
          </td>
          <td>
              <span uk-tooltip="Cant. turnos noche" class="uk-label" >{Math.floor(TotalTurnos(dia.nI,dia.nF) / time)}</span>
          </td>
        </tr>
{/each}

      </tbody>
    </table>
</div>
<a class="btn-flotante" href="#target" uk-scroll><span uk-icon="icon: chevron-up; ratio: 2"></span></a>
</Collection>

        

  <button class="uk-button uk-button-danger uk-float-left uk-margin-top"
  uk-tooltip="title: Reset Horario;pos: bottom" 
  on:click={resetDefault} 
  ><span uk-icon="icon: history"></span> Resetear horarios de trabajo</button>

{/if}
   </User>
</FirebaseApp>
