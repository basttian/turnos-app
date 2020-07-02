<script>

  import { FirebaseApp, User, Doc, Collection } from "sveltefire";
  import firebase from "firebase/app";
  import "firebase/firestore";
  import "firebase/auth";
  import "firebase/performance";
  import "firebase/analytics";
  const auth = firebase.auth();

	import calendarize from './calendarize.js';
	import moment from 'moment';
  	import 'moment/locale/es';
  	import UIkit from 'uikit';
	import Icons from 'uikit/dist/js/uikit-icons';
	
	import { onMount } from 'svelte';

	onMount(async () => {
		firebase.auth().onAuthStateChanged(function(user) {
			  if (user.isAnonymous) {
					setTimeout(() => {
						auth.signOut();
						UIkit.notification({
						    message: '<span uk-icon="icon: warning"></span> Tiempo expirado.',
						    status: 'danger',
						    pos: 'top-right',
						    timeout: 3000
						});
					}, 300000 );
			  } else {
				//console.log(user.email);
			  }
			}); 
		})

	export let year = new Date().getFullYear();
	export let month = new Date().getMonth(); // Jan
	export let offset = 0; // Sun
	export let today = new Date; // Date
	
	export let labels = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
	export let months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
	
	$: today_month = today && today.getMonth();
	$: today_year = today && today.getFullYear();
	$: today_day = today && today.getDate();
	
	let prev = calendarize(new Date(year, month-1), offset);
	let current = calendarize(new Date(year, month), offset);
	let next = calendarize(new Date(year, month+1), offset);
	
	function toPrev() {
		[current, next] = [prev, current];
		
		if (--month < 0) {
			month = 11;
			year--;
		}
		
		prev = calendarize(new Date(year, month-1), offset);
	}
	
	function toNext() {
		[prev, current] = [current, next];
		
		if (++month > 11) {
			month = 0;
			year++;
		}
		
		next = calendarize(new Date(year, month+1), offset);
	}
	
	function isToday(day) {
		return today && today_year === year && today_month === month && today_day === day;
    }

	import TURNOS from './Turnos.svelte';

	let diaSel, diaNum;

   function SelectDay(d,m,y,off){
	let dia =  new Date(`${y},${m},${d}`).valueOf();
	let dia_sel =  moment(dia).format('YYYY-MM-DD');
	let now     =  moment().format('YYYY-MM-DD');
	
	if( moment(dia).isSameOrAfter(moment()) || moment(dia_sel).isSame(moment(now)) ){

	UIkit.offcanvas('#offcanvas-flip').show().then(event=>{
		diaSel = moment(new Date(`${y},${m},${d}`));
		diaNum = off;
		});
	}else{
	UIkit.notification({
		message: `<span uk-icon='icon: warning'></span> Error!! fecha incorrecta.`, 
		status: 'danger', 
		pos: 'top-center',
		timeout:500
			});
		}
	}
	
</script>

<svelte:head>
	<title>Turno</title>
</svelte:head>

<div class="uk-margin-top uk-width-1-1">
	<ul class="uk-pagination uk-flex-center">
		<li class="uk-active"><a on:click={toPrev} href="javascript:void(0)"><span uk-slidenav-previous></span></a></li>
		<li class="uk-disabled"><h4>{months[month]} {year}</h4></li>
		<li class="uk-active"><a on:click={toNext}  href="javascript:void(0)"><span uk-slidenav-next></span></a></li>
	</ul>
</div>


<div class="month uk-overflow-auto">
	{#each labels as txt, idx (txt)}
		<span class="label">{ labels[(idx + offset) % 7] }</span>
	{/each}

	{#each { length:6 } as w,idxw (idxw)}
		{#if current[idxw]}
			{#each { length:7 } as d,idxd (idxd)}
				{#if current[idxw][idxd] != 0}
                
					<span class="date" class:today={isToday(current[idxw][idxd])} 
					on:click={()=>{SelectDay(current[idxw][idxd],moment().month(months[month]).format("M"),year, idxd )}}>
						{ current[idxw][idxd] }
					</span>
               
				{:else if (idxw < 1)}
					<span class="date other">{ prev[prev.length - 1][idxd] }</span>
				{:else}
					<span class="date other">{ next[0][idxd] }</span>
				{/if}
	
			{/each}
		{/if}
	{/each}
</div>

<!-- Off CAmbas -->
<div id="offcanvas-flip" uk-offcanvas="flip: true; overlay: true">
    <div class="uk-offcanvas-bar">
        <button class="uk-offcanvas-close" type="button" uk-close></button>
		<TURNOS dia={diaSel} diaSeleccionado={diaNum} />
    </div>
</div>


<style>
	
	.month {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		text-align: right;
		grid-gap: 4px;
	}
	
	.label {
		font-weight: 300;
		text-align: center;
		text-transform: uppercase;
		margin-bottom: 0.5rem;
		opacity: 0.6;
	}
	
	.date {
		height: 50px;
		font-size: 16px;
		letter-spacing: -1px;
		border: 1px solid #e6e4e4;
		padding-right: 4px;
		font-weight: 700;
        padding: 0.5rem;
        cursor: pointer;
	}
	
	.date.today {
		color: #FFFFFF;
		background: #151515;
		border-color: currentColor;
	}
	
	.date.other {
		opacity: 0.2;
	}
</style>