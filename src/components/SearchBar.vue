<script setup>
defineProps({
  searchQuery: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update-query'])

const onInput = (event) => {
  emit('update-query', event.target.value)
}
</script>

<template>
  <input
    type="text"
    placeholder="검색할 도시 이름 입력"
    :value="searchQuery"
    @input="onInput"
  />
</template>

<style scoped>
input {
  width: 100%;
  padding: 0.7rem 0.9rem;
  font-size: 1rem;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>
