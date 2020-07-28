<script>
  import { FirebaseApp, User, Doc, Collection } from "sveltefire";
  import firebase from "firebase/app";
  import "firebase/firestore";
  import "firebase/auth";
  import "firebase/performance";
  import "firebase/analytics";
  import UIkit from 'uikit';
  import Icons from 'uikit/dist/js/uikit-icons';

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCoBPU6SlKPnLBje61YtP205gdwTyGUA4M",
    authDomain: "turn-app-7261d.firebaseapp.com",
    databaseURL: "https://turn-app-7261d.firebaseio.com",
    projectId: "turn-app-7261d",
    storageBucket: "turn-app-7261d.appspot.com",
    messagingSenderId: "247946190952",
    appId: "1:247946190952:web:a493edf7e7b437cf421bdd",
    measurementId: "G-2Q08RFFN8B"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

	import Calendar from './Calendar.svelte';
  import { time } from './stores.js';
  import HorarioDeTRabajo from './_Horarios.svelte';


 const options = [
    {title: 'Solicitud', component: Calendar},
    {title: 'Horario De Trabajo',component: HorarioDeTRabajo}
  ]

let value = options[0];
let usuario;
let clave;

const formatter = new Intl.DateTimeFormat('en', {
		hour12: true,
		hour: 'numeric',
		minute: '2-digit',
		second: '2-digit'
	});
</script>
<svelte:head>
	<title>Home</title>
</svelte:head>
      <!-- 1. Firebase App -->
<FirebaseApp {firebase}>
  <User let:user let:auth let:error>

<!-- <li><em class="uk-text-meta">Cod. {user.uid}</em></li> -->
<div class="uk-section-secondary uk-preserve-color">
<div uk-sticky="animation: uk-animation-slide-top; sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky; cls-inactive: uk-navbar-transparent uk-light; top: 200">
<nav class="uk-navbar-container" uk-navbar id="#target">
    <div class="uk-navbar-left">
      <ul class="uk-navbar-nav uk-margin-left ">
          <li><a class=" uk-button-text" href="javascript:void(0)" on:click={()=>value = options[0]}> <span uk-tooltip="title: Solicitud;pos: bottom" uk-icon="calendar"></span></a></li>
          {#if !user.isAnonymous }
            <li><a class=" uk-button-text" href="javascript:void(0)" on:click={()=>value = options[1]}> <span class="uk-text-primary" uk-tooltip="title: Configuración;pos: bottom" uk-icon="icon: cog"></span></a></li>
          {/if}
      </ul>
    </div>
    {#if !user.isAnonymous }
    <div class="uk-navbar-right">
        <ul class="uk-navbar-nav">
        <li><a class=" uk-button-text" href="javascript:void(0)" on:click={() => auth.signOut()}><span uk-icon="icon: sign-out; ratio: 1.5"> Salir</span></a></li>
        </ul>
    </div>
    {/if}
</nav>
</div>
</div>

  <div slot="signed-out" class="uk-position-center uk-overlay uk-overlay-default">
    <svelte:head>
	<title>Turnos</title>
    </svelte:head>
      <Doc path={`config/first`} let:data let:ref log>
         <div slot="loading"><span uk-spinner="ratio: 4.5"></span></div>
         <div class="uk-card uk-card-secondary uk-card-hover uk-card-body uk-light">
           <div class="uk-card-badge"><a uk-icon="icon: lock" href="#modal-center" uk-toggle> </a></div>
            <h3 class="uk-card-title">{formatter.format($time)}</h3>
          {#if data.statusSite}
            <p>{data.txtslogan}</p>
          {:else}
            <p>{data.txtmantenimiento}</p>
          {/if}   
       <div class="uk-float-right">
        {#if data.statusSite}
         <a class="" href="javascript:void(0)" on:click={() => auth.signInAnonymously()}><span uk-icon="icon: sign-in; ratio: 1.5"> Solicitar turno</span></a>
        {/if}
       </div>

          <!-- Modal Login -->
          <div id="modal-center" class="uk-flex-top" uk-modal>
              <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical uk-width-auto">
                <button class="uk-modal-close-default" type="button" uk-close></button>
                <div class="uk-width-1-1">
                 
                  <form on:submit|preventDefault>
                      <div class="uk-margin">
                          <div class="uk-inline">
                              <span class="uk-form-icon" uk-icon="icon: user"></span>
                              <input bind:value={usuario} class="uk-input" type="text" placeholder="Email">
                          </div>
                      </div>
                      <div class="uk-margin">
                          <div class="uk-inline">
                              <span class="uk-form-icon uk-form-icon-flip" uk-icon="icon: lock"></span>
                              <input class="uk-input" bind:value={clave} type="password" placeholder="Contraseña" autocomplete="password">
                          </div>
                      </div>
                  <div class="uk-margin">
                     <button class="uk-button uk-button-secondary	uk-width-1-1" uk-icon="icon: unlock"
                      on:click={async ()=>{
                        await auth.signInWithEmailAndPassword( `${usuario}` , `${clave}`).then(even=>{
                          console.log("Login correcto") 
                           UIkit.modal('#modal-center').hide().then(()=>{
                            usuario="";
                            clave="";
                           })
                        }).catch(error=>{
                          console.log(error);
                          var errorCode = error.code;
                          var errorMessage = error.message;
                               UIkit.notification({message: `<span uk-icon='icon: warning'></span> ${errorMessage}`, 
                              pos: 'top-right', 
                              status: 'danger',
                              timeout: 1000
                              })
                        })
                      }}></button>
                      </div>
                    </form>
                </div>
              </div>
          </div>
        </div>
      </Doc>
    
  </div>




<div class="uk-container">

 
    <svelte:component this={value.component}/>

</div>


  </User>
</FirebaseApp>
