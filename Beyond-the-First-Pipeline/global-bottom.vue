<template>
  <footer class="absolute bottom-3 left-8 right-7 flex items-center justify-between pointer-events-none z-50 select-none">
    <img src="./images/conf42.png" alt="Conf42 Logo" class="h-5 opacity-90" />
    <span class="absolute left-1/2 -translate-x-1/2 text-xs text-gray-400 tabular-nums">
      {{ $slidev.nav.currentPage }}
    </span>
    <img src="./debezium-logo.png" alt="Debezium Logo" class="h-5 opacity-90" />
  </footer>
</template>
