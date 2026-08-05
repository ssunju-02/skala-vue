<script setup>
defineProps({
  searchQuery: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update-query'])

const updateQuery = (event) => {
  emit('update-query', event.target.value)
}
</script>

<template>
  <div class="search-section">
    <label for="city-search">도시 이름 검색</label>
    <div class="search-box">
      <span aria-hidden="true">⌕</span>
      <input
        id="city-search"
        type="text"
        placeholder="도시 이름을 한글로 입력하세요"
        :value="searchQuery"
        @input="updateQuery"
      />
    </div>
    <p class="search-result" aria-live="polite">
      입력한 도시:
      <strong>{{ searchQuery || '아직 입력하지 않았어요' }}</strong>
    </p>
  </div>
</template>

<style scoped>
.search-section label {
  display: block;
  margin-bottom: 11px;
  font-size: 0.88rem;
  font-weight: 600;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 18px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--soft);
  transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
}

.search-box span {
  color: var(--muted);
  font-size: 1.35rem;
}

.search-box input {
  width: 100%;
  padding: 15px 0;
  border: 0;
  outline: 0;
  color: var(--ink);
  background: transparent;
}

.search-box:focus-within {
  border-color: var(--blue-700);
  background: #fff;
  box-shadow: 0 0 0 4px var(--blue-100);
}

.search-result {
  min-height: 24px;
  margin: 10px 4px 0;
  color: var(--muted);
  font-size: 0.85rem;
}

.search-result strong {
  color: var(--blue-700);
}
</style>
