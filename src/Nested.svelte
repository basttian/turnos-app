<script>

export let onClose;
	import { onMount, onDestroy } from 'svelte';
	
  function onClickDocument(e) {
    //console.log('CLICK');
		onClose();
  }

  onMount(() => {
    //console.log('MOUNT');
    document.addEventListener('click', onClickDocument, {
			capture: true
		});
  })
	
	onDestroy(() => {
    document.removeEventListener('click', onClickDocument, {
			capture: true
		});
  })
</script>

<span class="uk-text-meta">Introduzca el código de verificación...</span>