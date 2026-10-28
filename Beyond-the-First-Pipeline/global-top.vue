<template>
  <div v-if="$slidev.nav.currentPage > 1">
    <!-- Dark strip across the top -->
    <div class="absolute top-0 left-0 right-0 h-[22px] bg-[#111827] z-50 pointer-events-none overflow-hidden">
      <!-- Progress fill coloured by chapter -->
      <div
        class="absolute top-0 left-0 h-full opacity-35 transition-all duration-500 ease-out"
        :style="{
          width: ($slidev.nav.currentPage / $slidev.nav.total * 100) + '%',
          background: $slidev.nav.currentPage >= 23 ? '#5cd6d8'
                    : $slidev.nav.currentPage >= 21 ? '#7c5cd8'
                    : $slidev.nav.currentPage >= 18 ? '#22c55e'
                    : $slidev.nav.currentPage >= 15 ? '#ef4444'
                    : $slidev.nav.currentPage >= 4  ? '#eab308'
                    : '#9ca3af'
        }"
      />
      <!-- Title centred inside the strip -->
      <div class="absolute inset-0 flex items-center justify-center select-none">
        <span class="text-[9px] font-medium tracking-[0.2em] uppercase text-white/70">
          Beyond the First Pipeline
        </span>
      </div>
    </div>
  </div>
</template>
