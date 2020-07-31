<script>
	import { FirebaseApp, User, Doc, Collection } from "sveltefire";
    import firebase from "firebase/app";
    import "firebase/firestore";
    import "firebase/auth";
    import "firebase/performance";
    import "firebase/analytics";
    import { Link } from 'yrv';
    const db = firebase.firestore();
    import { usuario, cesta } from './Store/store.js';


db.collection("carro").where("user", "==", `${$usuario}`).get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          //console.log(doc.id, " => ", doc.data());
            db.collection(`categorias/${doc.data().categoria}/productos`).doc(`${doc.data().producto}`).get().then(resp=>{
                cesta.update(n => n + (resp.data().precio*doc.data().cantidad));
            })
        });
    }).catch(function(error) {
        console.log("Error getting documents: ", error);
});


const removePriceToCest= (precio, cantidad) =>{
  cesta.update(c => c - (precio*cantidad))
}

 const updateStock = async (categoriaUid, productoUid, enStock, cant) => {
    var productoRef = await db.collection(`categorias/${categoriaUid}/productos`).doc(`${productoUid}`);
      return productoRef.update({stock: enStock + Number(cant) })
      .then(function() {
          console.log("Stock successfully updated!");
      })
      .catch(function(error) {
          // The document probably doesn't exist.
          console.error("Error updating stock: ", error);
      });
  }

const removePriceToCart = async(userUid,categoriaUid, productoUid, cant) => {
    await db.collection("carro").where("user", "==", `${userUid}`).get()
       .then(async()=>{
              await db.collection(`categorias/${categoriaUid}/productos`).doc(`${productoUid}`).get().then(async doc=>{
                   /* Update Cest */
                   await removePriceToCest(doc.data().precio, cant);
                   /* Update Stock */
                   updateStock(categoriaUid, productoUid, doc.data().stock,  cant);
               })
       }).catch(function(error) {
           console.log("Error getting documents: ", error);
   });
}


/* 
const AddPriceToCart = (precio) => {
  cesta.update(n => n + precio);
 }
const removePriceToCart= (precio) =>{
  cesta.update(c => c - precio)
}
*/

  function onSignOut(){
    firebase.auth().signOut().then(function() {
      console.log("Sign-out successful.")
    }).catch(function(error) {
      console.log(error.message)
    });
  }

</script>

<FirebaseApp firebase={firebase} perf analytics>
<User persist={sessionStorage} let:user={user} let:auth={auth} on:user>
<Collection path={`carro`} query={ref=> ref.where('user','==',`${user.uid}`)} let:data={cartData} let:ref log>
	<div slot="loading"><div uk-spinner></div></div>

<div class="uk-overflow-auto uk-margin-top uk-height-max-large">
    <table class="uk-table uk-table-small uk-table-divider">
    <caption>Cesta de compras</caption>
    <thead>
    <tr>
    <td>Op</td>
    <td>Producto</td>
    <td>Precio</td>
    </tr>
    </thead>
    <tbody>
	{#each cartData as item}
    <tr>
    <td>
     <a href="javascript:void(0)" 
         on:click={()=> item.ref.delete().then(function() {
                console.log("Document successfully deleted!");
                removePriceToCart(user.uid,item.categoria,item.producto,item.cantidad)
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            })
      } uk-icon="icon: close"> </a> {item.cantidad}
    </td>
<Doc path={`categorias/${item.categoria}/productos/${item.producto}`} let:data={productData} let:ref={pR} log >
<div slot="loading"><div uk-spinner></div></div>
    <td>{productData.nombre}</td>
    <td>${productData.precio}</td>
</Doc>
    </tr>
	{/each} 
    </tbody>
    <tfoot>
    <tr>
    <td></td>
    <td></td>
    <td></td>
    </tr>
    </tfoot>
    </table>
</div>
{#if $cesta > 0}
    <div class="uk-margin">
        <div class="uk-form-label">Formas de pago</div>
        <div class="uk-form-controls">
        <label><input class="uk-radio" type="radio" name="radio2" checked> Pago en local.</label><br>
        <label><input class="uk-radio" type="radio" name="radio2"> Cobro a la entrega.<span class="uk-text-meta">&nbsp;(Efectivo)</span></label><br>
        <label><input class="uk-radio" type="radio" name="radio2"> Mercado Pago.</label>
        </div>
    </div>

  <a class="uk-button uk-button-danger uk-margin-top uk-float-right" href="javascript:void(0)">Pagar ${$cesta} pesos</a>
{:else}
  <p><span uk-icon="icon: info"></span> El carrito esta vacio.</p>
{/if}

<!-- 
 <ul class="uk-list uk-list-divider">
 <li class="uk-nav-header"></li>
	{#each cartData as item}
<li>
 <a href="javascript:void(0)" 
         on:click={()=> item.ref.delete().then(function() {
                console.log("Document successfully deleted!");
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            })
      } uk-icon="icon: close"> </a>
    <Doc path={`categorias/${item.categoria}/productos/${item.producto}`} let:data={productData} let:ref={pR} log >
    <div slot="loading"><div uk-spinner></div></div>
      {productData.nombre}----${productData.precio} 
    </Doc>
</li>
	{/each} 
 </ul> -->
<div class="uk-position-bottom uk-margin-left">
 <ul class="uk-list uk-list-divider">
  <li><a href="javascript:void(0)"><span  uk-icon="icon: cog"></span> Configuracion</a></li>
  <li><a href="javascript:void(0)" on:click={() => onSignOut() }><span  uk-icon="icon: sign-out"></span> Salir</a></li>
 </ul>
</div>
</Collection>

</User>
</FirebaseApp>