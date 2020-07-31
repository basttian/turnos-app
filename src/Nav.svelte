<script>

import CAMBAS from "./Cambas.svelte";

/* let total; */
import { cesta } from './Store/store.js'
/* cesta.subscribe(value => {
	total = value;
}); */
</script>
<div  uk-sticky>
<nav class="uk-navbar uk-navbar-container">
    <div class="uk-navbar-left">
        <a class="uk-navbar-toggle" href="javascript:void(0)" uk-toggle="target: #offcanvas-usage" >
            <span uk-navbar-toggle-icon></span> <span class="uk-margin-small-left">Cesta de compras</span>
        </a>
    </div>
    <div class="uk-navbar-right uk-margin-right">
         <span uk-icon="icon: cart; ratio: 1.5"></span><span class="uk-badge">${$cesta}</span>
    </div>
</nav>
<div id="recaptcha-container"></div>
</div>
<!-- OffCambas -->

<div class="uk-container">
<div id="offcanvas-usage" uk-offcanvas>
    <div class="uk-offcanvas-bar">
        <button class="uk-offcanvas-close" type="button" uk-close></button>
        <img alt="" src="images/comida-rapida.svg" width="50" height="50" uk-svg>
        <CAMBAS />
    </div>
</div>
</div>