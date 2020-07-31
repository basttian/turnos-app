<script>
  import { FirebaseApp, User, Doc, Collection } from "sveltefire";
  import firebase from "firebase/app";
  import "firebase/firestore";
  import "firebase/auth";
  import "firebase/storage";
  import "firebase/performance"; // Optional
  import "firebase/analytics"; // Optional
  import { Link } from "yrv";
  const db = firebase.firestore();
  import { usuario, cesta } from "./Store/store.js";

  export let router = {};
  let id = null;
  $: {
    id = router.params ? router.params.id : null;
  }

  let nombre_categoria = "";
  let qty = 1
  let cantidad = [];
;

  async function AddToCart(userUid, categoriaUid, productoUid, cant) {
    const created = new Date().getTime();
    await db
      .collection(`carro`)
      .add({
        user: `${userUid}`,
        created,
        categoria: `${categoriaUid}`,
        producto: `${productoUid}`,
        cantidad: `${cant}`
      })
      .then(function(docRef) {
        //console.log("Document written with ID: ", docRef.id);
        AddPriceToCart(userUid, categoriaUid, productoUid, cant);
        qty = 1;
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
  }

  const AddPriceToCest = (precio, cantidad) => {
    cesta.update(n => n + precio * cantidad);
  };

  const updateStock = async (categoriaUid, productoUid, enStock, cant) => {
    var productoRef = await db.collection(`categorias/${categoriaUid}/productos`).doc(`${productoUid}`);
      return productoRef.update({stock: enStock - Number(cant) })
      .then(function() {
          console.log("Stock successfully updated!");
      })
      .catch(function(error) {
          // The document probably doesn't exist.
          console.error("Error updating stock: ", error);
      });
  }

  const AddPriceToCart = async (userUid, categoriaUid, productoUid, cant) => {
    await db
      .collection("carro")
      .where("user", "==", `${userUid}`)
      .get()
      .then(async () => {
        await db
          .collection(`categorias/${categoriaUid}/productos`)
          .doc(`${productoUid}`)
          .get()
          .then(async doc => {
            /* Update Cest */
            await AddPriceToCest(doc.data().precio, cant);
            /* Update Stock */
            updateStock(categoriaUid, productoUid, doc.data().stock,  cant);
          });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
  };
</script>

<ul class="uk-breadcrumb uk-margin-top">
  <li>
    <Link href="/">Home</Link>
  </li>
  <li>
    <span>Active</span>
  </li>
</ul>
<FirebaseApp {firebase}>
  <User persist={sessionStorage} let:user let:auth on:user>
    <Doc
      path={`categorias/${id}`}
      let:data={categoriesData}
      let:ref={categoriesRef}
      on:data={e => (nombre_categoria = e.detail.data.nombre)}>
      <div slot="loading">
        <div uk-spinner />
      </div>
      <h1>{nombre_categoria}</h1>
      <Collection
        path={categoriesRef.collection(`productos`)}
        let:data={pD}
        let:ref
        log>
        <div slot="loading">
          <div uk-spinner />
        </div>

        <div
          class="uk-child-width-1-1@s uk-child-width-1-2@s uk-grid-small uk-light uk-child-width-expand@s uk-text-center"
          uk-grid>
          {#each pD as item, index}
            <div>
              <div class="uk-animation-toggle" tabindex="0">
                <div
                  class="uk-transform-origin-bottom-right uk-animation-scale-up">
                  <div class="uk-card uk-card-default uk-width-1-2@m">
                    <div class="uk-card-badge">
                      <span class=" uk-text-large">${item.precio}</span>
                    </div>
                    <div class="uk-inline">
                      <img
                        class="uk-border-rounded uk-blend-darken"
                        src={item.img}
                        alt="" />
                      {#if item.stock > 0}
                      <a
                        class="uk-position-absolute uk-transform-center"
                        on:click={AddToCart(user.uid, id, item.id, qty)}
                        style="left: 50%; top: 50%"
                        href="javascript:void(0)"
                        uk-marker> </a>
                    {/if}
                    </div>
                    <div class="uk-card-footer uk-background-secondary">
                      <label>
                        {item.nombre}
                        <input
                          class="uk-input uk-placeholder"
                          type="number"
                          bind:value={ cantidad[index] }
                          min="1" 
                          max={item.stock} 
                          placeholder="Cant. 1"
                          disabled={true}>
                        <input 
                          class="uk-range"
                          type=range 
                          bind:value={ cantidad[index] } 
                          min="1" 
                          max={item.stock}  
                          on:change={({ target: { value } }) => (qty = value)}
                          >
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>

      </Collection>
    </Doc>
  </User>
</FirebaseApp>
