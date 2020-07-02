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
  import { onMount } from 'svelte';
  import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

let now = new Date(), month, day, year;
let dateString;
onMount(()=> {
        month = '' + (now.getMonth() + 1),
        day = '' + now.getDate(),
        year = now.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

	dateString = [year, month, day].join('-');
	
})

let search;
let yes = true;

let id;
let fecha;
import MODALEDIT from "./_ModalEditTurno.svelte";

function OpenModalEdit(idTurno,fechaTurno){
	id = idTurno;
	fecha = fechaTurno;
	search = "";
	UIkit.modal("#ModalEditTurno").show();
}

import RELOJ from "./Reloj.svelte";

</script>

<!-- 1. Firebase App -->
<FirebaseApp {firebase}>
<User let:user let:auth let:error>

 {#if user.isAnonymous}
    <p>404 No data found..</p>
{:else}


<div class="uk-child-width-expand@s" uk-grid >
<div>
	<div class="uk-margin uk-grid-small uk-child-width-auto uk-grid">
        <label><input class="uk-checkbox" bind:checked={yes} type="checkbox" value={true} > Filtrar por fecha</label>
    </div>
    <div class="uk-float-left uk-margin-small-top">
    		<input class="uk-input uk-form-width-large" type="date" bind:value={dateString} disabled={!yes} >
    </div>
</div> 
<div>
	<div class="uk-text-center">
	    <RELOJ />
	</div>
</div>
<div>
  <div class="uk-float-right uk-margin-large-top">
   <div class="uk-search uk-search-navbar">
    	<span uk-search-icon></span>
      	<input class="uk-search-input uk-width-1-1" type="text" bind:value={search} placeholder="Filtrar por documento.." disabled={yes}>
    </div>
  </div>
</div> 
</div>

{#if yes}
<Collection path={`turnos`} query={(ref) => ref.where("diaSelect","==",moment(dateString).valueOf()).orderBy('hora','desc')} let:data let:ref log >
 <div slot="loading"><div class="uk-margin-top" uk-spinner></div></div>
 <div class="uk-overflow-auto uk-margin-top">
    <table class="uk-table uk-table-striped">
		<caption><span uk-icon="icon: calendar"></span> Busqueda por fecha.</caption>
		<thead>
		<tr>
		<th>Opciones</th>	
		<th>Cod</th>
		<th>Fecha</th>
		<th>Documento</th>	
		<th>Hora</th>
		</tr>
		</thead>
		<tbody>
	{#each data as item}
		<tr>
			<td>
				<div class="uk-inline">
				    <a href="javascript:void(0)"><span uk-icon="icon: thumbnails"></span></a>
				    <div uk-dropdown="pos: right-center;delay-hide:10">
				        <ul class="uk-nav uk-dropdown-nav">
				            <li><a id="btn_menu" href="javascript:void(0)" on:click={()=>{
								OpenModalEdit(item.id,item.diaSelect)
							}}>Editar turno</a></li>
				            <li><a href="javascript:void(0)"
							on:click={()=>{ 
							UIkit.modal.confirm('Esta seguro que desea eliminar este turno!').then(function() {
                                item.ref.delete().then(()=>{
                                UIkit.notification({message: `<span uk-icon='icon: trash'></span> Turno eliminado éxitosamente.`, pos: 'top-center', status: 'primary'})
                                })
                            }, function () {
                                UIkit.notification({message: "<span uk-icon='icon: warning'></span> Operación cancelada.", pos: 'top-center', status: 'danger'})
                            })
							 }}
							>Eliminar turno</a></li>
				        </ul>
				    </div>
				</div>
			</td>
			<td>{item.id}</td>
			<td>{moment(item.diaSelect).format('DD-MM-YYYY')}</td>
			<td>{item.tipoDocumento}: {item.dni}</td>
			<td><span class="uk-label">{item.hora}</span></td>
		</tr>
	{/each}	
	</tbody>
	<tfoot>
		<tr>
		<th></th>	
		<th></th>
		<th></th>
		<th></th>	
		<th></th>
		</tr>
	</tfoot>
    </table>
</div>
</Collection>	

{:else}

<Collection path={`turnos`} query={(ref) => ref.where("dni","==",`${search}`).orderBy('hora','desc') } let:data let:ref log>
	 <div slot="loading"><div class="uk-margin-top" uk-spinner></div></div>
 <div class="uk-overflow-auto uk-margin-top">
    <table class="uk-table uk-table-striped">
		<caption><span uk-icon="icon: calendar"></span> Busqueda por documento.</caption>
		<thead>
		<tr>
		<th>Opciones</th>	
		<th>Cod</th>
		<th>Fecha</th>
		<th>Documento</th>	
		<th>Hora</th>
		</tr>
		</thead>
		<tbody>
	{#each data as item}
		<tr>
			<td>
				<div class="uk-inline">
				    <a href="javascript:void(0)"><span uk-icon="icon: more"></span></a>
				    <div uk-dropdown="pos: right-center;delay-hide:10">
				        <ul class="uk-nav uk-dropdown-nav">
				            <li><a href="javascript:void(0)" on:click={()=>{OpenModalEdit(item.id,item.diaSelect)}}>Editar turno</a></li>
				            <li><a href="javascript:void(0)"
							on:click={()=>{ 
							UIkit.modal.confirm('Esta seguro que desea eliminar este turno!').then(function() {
                                item.ref.delete().then(()=>{
                                UIkit.notification({message: `<span uk-icon='icon: trash'></span> Turno eliminado éxitosamente.`, pos: 'top-center', status: 'primary'})
                                })
                            }, function () {
                                UIkit.notification({message: "<span uk-icon='icon: warning'></span> Operación cancelada.", pos: 'top-center', status: 'danger'})
                            })
							 }}
							>Eliminar turno</a></li>
				        </ul>
				    </div>
				</div>
			</td>
			<td>{item.id}</td>
			<td>{moment(item.diaSelect).format('DD-MM-YYYY')}</td>
			<td>{item.tipoDocumento}: {item.dni}</td>
			<td><span class="uk-label">{item.hora}</span></td>
		</tr>
	{/each}	
	</tbody>
	<tfoot>
		<tr>
		<th></th>	
		<th></th>
		<th></th>
		<th></th>	
		<th></th>
		</tr>
	</tfoot>
    </table>
</div>
</Collection>
{/if}



<MODALEDIT  idTurno={id} />



<a class="btn-flotante" href="#target" uk-scroll><span uk-icon="icon: chevron-up; ratio: 2"></span></a>
	
{/if}
</User>
</FirebaseApp>
