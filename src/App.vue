<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav class="assignment-nav">
    <RouterLink to="/" exact-active-class="active">과제 1: Mockup</RouterLink>
    <RouterLink to="/assignment2" exact-active-class="active">과제 2: 컴포지션</RouterLink>
    <RouterLink to="/assignment3" exact-active-class="active">과제 3: 컴포넌트</RouterLink>
    <RouterLink to="/weather" exact-active-class="active">과제 4: Router</RouterLink>
  </nav>
  <RouterView />
</template>

<style scoped>
.assignment-nav {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  padding: 1rem 0;
  background: #dfe4f0;
}

.assignment-nav a {
  padding: 0.3rem 1.2rem;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  background: #eceff5;
  font-weight: bold;
  font-size: 0.95rem;
  white-space: nowrap;
}

.assignment-nav a:hover {
  background: #cbd3ea;
}

.assignment-nav a.active {
  background: #333;
  color: #fff;
}
</style>
