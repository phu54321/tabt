<script setup lang='ts'>

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (eventName: 'select', file: File): void
  (eventName: 'close'): void
}>()

function onFileSelect (e: Event) {
  const el = e.target as HTMLInputElement
  if (el.files && el.files.length > 0) {
    emit('select', el.files[0])
  }
}

</script>

<template>

<div class="modal-card">
  <header class="modal-card-head">
    <p class="modal-card-title">새 테스트 제작</p>
  </header>
  <section class="modal-card-body">
    <div class="content">
      <div class="file">
        <label class="file-label">
          <input ref='fileInput' @change='onFileSelect' class="file-input" type="file" name="resume" accept=".zip">
          <span class="file-cta">
            <span class="file-icon">
              <font-awesome-icon icon='upload' />
              <i class="fas fa-upload"></i>
            </span>
            <span class="file-label">
              파일 선택
            </span>
          </span>
        </label>
      </div>    </div>
  </section>
  <footer class="modal-card-foot">
    <button class="button" @click='$emit("close")'>OK</button>
  </footer>
</div>

</template>
