<template>

<teleport to='body'>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-content">
      <slot />
    </div>
  </div>
</teleport>

</template>
