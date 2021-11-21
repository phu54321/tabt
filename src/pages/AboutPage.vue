<script setup lang='ts'>
import packageJson from './../../package.json'
const version = packageJson.version
</script>

<template>

<div class='title'>Trgk's Audio Blind Test</div>
<div class="subtitle">(Version {{version}})</div>

<p>Utility for creating & performing double blinded test.</p>

</template>
