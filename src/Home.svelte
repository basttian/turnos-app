<script>
    import { FirebaseApp, User, Doc, Collection } from "sveltefire";
    import firebase from "firebase/app";
    import "firebase/firestore";
    import "firebase/auth";
    import "firebase/performance";
    import "firebase/analytics";
    import { Router, Route, Link, router  } from 'yrv';
    import NAV from './Nav.svelte';
    import PORTADA from "./Portada.svelte";
    import SvelteComponent from "./productCategorie.svelte";

</script>

<svelte:head>
<title>Home</title>
</svelte:head>

<NAV />

<div class="uk-container">
 <Router>
    <Route path="/" exact component={PORTADA} />
    <Route path="/product-categorie/:id" exact component={SvelteComponent} />
  </Router>
</div>