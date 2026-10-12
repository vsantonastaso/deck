<template>
  <footer class="absolute bottom-3 left-6 right-6 flex items-center justify-between pointer-events-none z-50 select-none">
    <!-- Left side: Commonhaus logo -->
    <div class="flex items-center">
      <img src="https://raw.githubusercontent.com/commonhaus/artwork/main/foundation/brand/svg/CF_logo_horizontal_single_default.svg" alt="Commonhaus Logo" class="h-6 opacity-90" />
    </div>

    <!-- Right side: Debezium logo & info -->
    <div class="flex items-center gap-3">
      <span class="text-[10px] text-gray-500 font-sans tracking-widest uppercase">Debezium ⇄ Neo4j</span>
      <div class="h-4 w-[1px] bg-gray-700"></div>
      <img src="./debezium-logo.png" alt="Debezium Logo" class="h-5 opacity-90" />
    </div>
  </footer>
</template>
