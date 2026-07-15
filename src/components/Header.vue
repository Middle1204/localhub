<template>
  <header class="site-header">
    <nav>
      <h2>LocalHub</h2>
      <ul>
        <li><a href="#/">홈</a></li>
        <li><a href="#/board">게시판</a></li>
        <li><a href="#/chat">챗</a></li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.site-header { padding:12px 20px; border-bottom:1px solid var(--border); background:var(--cream) }
nav { display:flex; align-items:center; justify-content:space-between }
nav h2 { margin:0; color:var(--tangerine) }
nav ul { list-style:none; display:flex; gap:12px; margin:0; padding:0 }
nav a { text-decoration:none; color:var(--text-h) }
</style>
