<template>
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <img :src="imageUrl" :alt="altText" class="modal-image"/>
      <button class="close" @click="closeModal">&times;</button>
    </div>
  </div>
</template>

<script setup>
import {defineProps, defineEmits} from 'vue';

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  imageUrl: String,
  altText: String,
  show: Boolean
});

const emits = defineEmits(['update:show']);

const closeModal = () => {
  emits('update:show', false);
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
}

.modal-content {
  max-width: 70vw;
  text-align: center; /* Ensure the close button and the image are centered */
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.modal-image {
  max-width: 100%; /* Make image responsive */
  max-height: 70vh; /* Limit image height to 70% of the viewport */
  object-fit: contain; /* Maintain the aspect ratio of the image */
}

.close {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
}
</style>