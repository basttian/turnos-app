<script>
    import { FirebaseApp, User, Doc, Collection } from "sveltefire";
    import firebase from "firebase/app";
    import "firebase/firestore";
    import "firebase/auth";
    import "firebase/performance";
    import "firebase/analytics";
    import { Router, Route, Link } from 'yrv';


</script>

<div class="uk-container uk-margin-top" >

<FirebaseApp firebase={firebase} perf analytics>
<div class="uk-child-width-1-1 uk-child-width-1-2@s uk-grid-small uk-light" uk-grid uk-scrollspy="cls: uk-animation-slide-bottom; target: .uk-card; delay: 300; repeat: true">
<Collection path={`categorias`} let:data let:ref log>
    <div slot="loading"><div uk-spinner></div></div>
    {#each data as item, index}
         <div>
        <div class="uk-card uk-card-hover uk-card-body uk-card-secondary">
            <div class="uk-card-badge "><span uk-icon="icon: star"></span></div>
            <div class="uk-card-media-top uk-text-center">
                <img alt="" class="uk-margin-top" src={item.imgCategoria} width="70" height="70" uk-svg>
            </div>
              <div class="uk-card-footer uk-text-center">
                <Link href="/product-categorie/{item.id}" class="uk-button uk-button-text"><h3>{item.nombre}</h3></Link>
            </div>
        </div>

         </div>
    {/each}
</Collection>
</div>
</FirebaseApp>

</div>

 