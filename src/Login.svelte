<script>
import firebase from "firebase/app";
firebase.auth().useDeviceLanguage();
import validator from 'validator';
import Nested from './Nested.svelte';
let isShow = false;
let phone;
let code;
    

setTimeout(function() {
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
          'size': 'invisible',
          'callback': function(response) {
              //console.log("success", response);
              onSignInSubmit();
          },
          'expired-callback': function() {
              //console.log("expired-callback");
          }
      });
      recaptchaVerifier.render().then(function(widgetId) {
          window.recaptchaWidgetId = widgetId;
      });
  },2000);


async function onSignInSubmit() {
  if (isPhoneNumberValid()) {
   var phoneNumber = getPhoneNumberFromUserInput();
     var appVerifier = window.recaptchaVerifier;
     await firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
          .then(function (confirmationResult) {
            window.confirmationResult = confirmationResult;
            isShow = true;
            UIkit.modal("#modal-overflow").show();
          }).catch(function (error) {
            //console.error('Error during signInWithPhoneNumber', error);
                UIkit.notification({
                message: 'Error:\n\n' + error.code + '\n\n' + error.message,
                status: 'danger',
                pos: 'top-right',
                timeout: 3000
            });
            phone="";
        });
      }
}

async function onVerifyCodeSubmit(cod) {
      await window.confirmationResult.confirm(cod).then(function (result) {
        var user = result.user;
        //console.log(user);
      }).catch(function (error) {
        //console.error('Error while checking the verification code', error);
      code = "";
      UIkit.notification({
            message: 'Error:\n\n' + error.code + '\n\n' + error.message,
            status: 'danger',
            pos: 'top-right',
            timeout: 3000
        });
     });
  }

function getPhoneNumberFromUserInput() {
    return phone;
  }

 async function isPhoneNumberValid() {
    var pattern = /^\+[0-9\s\-\(\)]+$/;
    var phoneNumber = await getPhoneNumberFromUserInput();
    return phoneNumber.search(pattern) !== -1;
  }


function onClose() {
    isShow = false;
}

</script>

<svelte:head>
<title>Login</title>
</svelte:head>


<div class="uk-position-small uk-position-top-left uk-overlay uk-overlay-default">
   {#if isShow}<Nested {onClose} />{/if}
</div>

<div class="uk-position-center uk-overlay uk-overlay-default">
<form class="uk-text-center" on:submit|preventDefault>
    <div class="uk-margin">
    <input class="uk-text-center uk-input uk-form-width-medium uk-form-large uk-form-width-large" type="text" bind:value={phone} placeholder="Número de teléfono">
    </div>
    <div class="uk-margin">
    <button class="uk-button uk-button-danger uk-button-large" id="recaptcha-container" type="submit" disabled={!phone}>Enviar código</button>
    </div>
 </form>
 </div>


<div id="modal-overflow" class="uk-flex-top" uk-modal>
    <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical uk-width-auto">
        <form class="uk-text-center" on:submit|preventDefault>
            <div class="uk-margin">
            <input class="uk-text-center uk-input uk-form-width-medium uk-form-large" type="text" bind:value={code} placeholder="_ _ _ _ _ _" >
            </div>
            <div class="uk-margin">
            <button class="uk-button uk-button-danger uk-button-large" on:click={()=>{onVerifyCodeSubmit(code)}} type="submit" disabled={!code} >Ingresar</button>
            </div>
        </form>
    </div>
</div>