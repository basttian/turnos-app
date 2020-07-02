<script>
 import { FirebaseApp, User, Doc, Collection } from "sveltefire";
 import firebase from "firebase/app";
 const db = firebase.firestore();
 import moment from 'moment';
 import 'moment/locale/es';
 import UIkit from 'uikit';
 import Icons from 'uikit/dist/js/uikit-icons';
 
 export let docReference;
 let file;


import { beforeUpdate, afterUpdate } from 'svelte';

beforeUpdate(() => {
setTimeout(function(){
  JsBarcode(".codigo")
  .options({
    height: 30, // La altura del código
    textAlign: "center", // En dónde poner el texto. center, left o right
    textPosition: "bottom", // Poner el texto arriba (top) o abajo (bottom)
    textMargin: 5, // Margen entre el texto y el código de barras
    fontSize: 12, // Tamaño de la fuente
    marginTop: 10, // Margen superior
    marginRight: 10, // Margen derecho
    marginBottom: 5, // Margen inferior
    marginLeft: 35, // Margen izquierdo
      }).init();
    }, 2000);
});


/* Print pdf  */
const Pdf = async () => {
var doc = await new jsPDF('p', 'pt', 'a4');
    doc.fromHTML(file.innerHTML,15, 15,{'width': 480})
    setTimeout(function(){
      doc.save(`${docReference}.pdf`);   
    }, 1000);
    UIkit.modal("#modal-confirm-2").hide(); 
  }


</script>

<svelte:head>
  <script src="./js/jspdf.min.js"></script>
  <script src="./js/JsBarcode v3.11.0.js"></script>
</svelte:head>

<div id="modal-confirm-2" uk-modal>
    <div class="uk-modal-dialog" >
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <Doc path={`turnos/${docReference}`} let:data let:ref log>
           <div slot="loading"><div uk-spinner></div></div>
           <!-- Print div -->
           <div bind:this={file}>
            <div class="uk-modal-header">
                <h2 class="uk-modal-title">Confirmación de turno.</h2>
            </div>
            <div class="uk-modal-body">
                <p>Su turno ha sido agendado para el día {moment(data.diaSelect).format("dddd D MMMM YYYY")}, a las {data.hora} hs</p>
                <p class="uk-text-meta"><span class="uk-label">Nota </span> Debe concurrir con {data.tipoDocumento} n° {data.dni}</p>
            </div>
              <img src="" alt="code" data-value={docReference} data-text={docReference} class="codigo" uk-svg />
            </div>
            <div class="uk-modal-footer uk-text-right">
                <button class="uk-button uk-button-secondary" type="button" on:click|once={Pdf} >
                <span uk-icon="icon: file-pdf"></span><span class="uk-text-middle"> Descargar comprobante</span></button>
            </div>
        </Doc>
    </div>
</div>

