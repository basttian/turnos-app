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

/* Menu */
  import HorarioDeTrabajo from "./_HorarioDeTrabajo.svelte";
  import Config from './_Config.svelte';
  import Turnos from './_Turnos.svelte';

  const menus = [
    {title: 'Horario de Trabajo', component: HorarioDeTrabajo},
    {title: 'Config'            , component: Config},
    {title: 'Turnos'            , component: Turnos},
  ]

  let menuValue = menus[2];

/* Fin menu */

</script>
<!-- start engine -->
<User persist={sessionStorage} let:user={user} let:auth={auth} on:user>
{#if user.isAnonymous}
    <p>404 No data found..</p>
{:else}

  <div class="uk-margin-medium-top">
    <ul uk-tab>
        <li><a href="javascript:void(0)" on:click={()=>menuValue = menus[0]} >Horarios</a></li>
        <li><a href="javascript:void(0)" on:click={()=>menuValue = menus[1]}>Mantenimiento</a></li>
        <li class="uk-active"><a href="javascript:void(0)" on:click={()=>menuValue = menus[2]}>Turnos</a></li>
    </ul>
  </div>


  <div class="uk-container">
      <svelte:component this={menuValue.component}/>
  </div>

{/if}
</User>