<script>
  import { FirebaseApp, User, Doc, Collection } from "sveltefire";
  import firebase from "firebase/app";
  import "firebase/firestore";
  import "firebase/auth";
  import "firebase/performance";
  import "firebase/analytics";
  const auth = firebase.auth();
  import UIkit from 'uikit';
  import Icons from 'uikit/dist/js/uikit-icons';
 


  let txtslogan,txtmantenimiento;
  let configData = [];
  let u_email='';
  let u_password='';
  let yes = false;
	let selection;

async function resetPassWord(email){
  if (yes===true){
  await UIkit.modal.confirm('Se enviara un email para restablecer la contraseña.').then(function() {
      auth.sendPasswordResetEmail(email).then(function() {
        UIkit.notification({
          message: `Se ha enviado a ${email}`,
          status: 'primary',
          pos: 'top-right',
          timeout: 3000
      });
      yes=false;
    }).catch(function(error) {
          UIkit.notification({
          message: error.message,
          status: 'danger',
          pos: 'top-right',
          timeout: 3000
      });
    });
  }, function () {
      console.log('Rejected.')
      yes=false;
  });
  }
}




</script>

<User persist={sessionStorage} let:user={user} let:auth={auth} on:user>

{#if user.isAnonymous}
    <p>404 No data found..</p>
{:else}
<div class="uk-clearfix">
    <div class="uk-float-left">
     <label><input  class="uk-checkbox" bind:checked={yes} type="checkbox" value={user.email} on:change={({ target: { value } }) => resetPassWord(value)} > Restablecer contraseña.</label>
    </div>
    <div class="uk-float-right">
      
    </div>
</div>
<form on:submit|preventDefault>
<div class="uk-grid-small uk-margin-small-top" uk-grid>
    <div class="uk-width-1-4@s">
      <div class="uk-inline">
        <span class="uk-form-icon" uk-icon="icon: user"></span>
        <input class="uk-input" type="text" bind:value={u_email} placeholder="Email...">
      </div>
    </div>
    <div class="uk-width-1-4@s">
      <div class="uk-inline">
        <span class="uk-form-icon uk-form-icon-flip" uk-icon="icon: lock"></span>
        <input class="uk-input" type="password" bind:value={u_password} placeholder="Contraseña..." autocomplete="password" >
      </div>
    </div>
    <div class="uk-width-1-2@s">
      <button uk-tooltip="Guardar usuario." class="uk-button uk-button-default uk-width-1-1"  on:click={async ()=>{
        await auth.createUserWithEmailAndPassword(u_email, u_password).then( function(){

          UIkit.notification({
                    message: '<span uk-icon="icon: check"></span> Usuario agregado con exito.',
                    status: 'primary',
                    pos: 'top-right',
                    timeout: 3000
                });
        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
           UIkit.notification({
                    message: `<span uk-icon="icon: warning"></span> ${errorMessage} ` ,
                    status: 'danger',
                    pos: 'top-right',
                    timeout: 3000
                });
            
        })}
      } disabled={!u_email || !u_password}>
      Añadir nuevo usuario</button>
    </div>
</div>
</form>

<div class="uk-margin-top"></div>
<!-- Crear una coleccion en firebase de nombre: config - doc: first y un campo llamado statusSite tipo boolean: false -->
<Collection path={`config`} let:data={configData} let:ref log>
<div slot="loading"><div uk-spinner></div></div>
<form on:submit|preventDefault>
{#each configData as config}
  <div class="uk-child-width-expand@s" uk-grid>

{#if config.statusSite}
 <label class="uk-text-primary"><input class="uk-checkbox"  type="checkbox" bind:checked={selection} value={selection=true} > Modo: OnLIne</label>
 {:else}
 <label class="uk-text-danger"><input class="uk-checkbox"  type="checkbox" bind:checked={selection} value={selection=false} > Modo: OffLine</label>
{/if}


      <div>
            <div class="uk-margin">
                <label class="uk-text-meta" for="st">Mensaje sitio Activo.</label>
                <input id="st" class="uk-input" type="text" bind:value={config.txtslogan} placeholder="Ingresa mensaje">
            </div>
            <div class="uk-margin">
                <label class="uk-text-meta" for="sm">Mensaje sitio en mantenimiento.</label>
                <input id="sm" class="uk-input" type="text" bind:value={config.txtmantenimiento} placeholder="Ingresa mensaje">
            </div>
      </div>
  </div> 
   
        <div class="uk-margin">
        <button class="uk-button uk-button-default" disabled={!config.txtslogan} 
          on:click={() => config.ref.update({ 
            uid: user.uid, 
            statusSite:selection,
            txtslogan: `${config.txtslogan}`,
            txtmantenimiento: `${config.txtmantenimiento}`,
        }).then(resp=>{
            UIkit.notification({
                    message: '<span uk-icon="icon: check"></span> Configuracion actualizada correctamente.',
                    status: 'primary',
                    pos: 'top-right',
                    timeout: 500
                });
            })
          }>
         Guardar Configuracion
        </button>
        </div>
     {/each}
  </form>
</Collection>

{/if}
</User>






    
<!--
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    console.log(isAnonymous)
  } else {
    // User is signed out.
    // ...
  }
}); -->

