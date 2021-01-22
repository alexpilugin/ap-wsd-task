<template>
  <img class="VuetifyLogo" alt="Vuetify Logo" src="/vuetify-logo.svg" />
</template>

<style>
.VuetifyLogo {
  height: 40px;
  width: 40px;
  transform: rotateY(560deg);
  animation: turn 3.5s ease-out forwards 1s;
}

@keyframes turn {
  100% {
    transform: rotateY(0deg);
  }
}
</style>
