<script setup lang="ts">

</script>

<template>
<table class='blindtest'>
  <tr>
    <th>A</th><th>B</th>
  </tr>
  <tr>
    <td colspan=2>
      <img src='../assets/test.png'>
    </td>
  </tr>
  <tr>
    <td>
      <button class='play'>Play</button>
      <button class='select'>Select</button>
    </td>
    <td>
      <button class='play'>Play</button>
      <button class='select'>Select</button>
    </td>
  </tr>
</table>
</template>

<style lang='scss'>
table.blindtest {
  border-collapse: collapse;
  &, tr, td, th {
    border: 1px solid #666;
  }
  td, th {
    padding: 3px 5px;
  }

  img {
    max-width: 100%;
  }

  button {
    display: block;
    width: 100%;
    &.play {
      padding: 2em;
      margin-bottom: .5em;
    }
  }

}

</style>
