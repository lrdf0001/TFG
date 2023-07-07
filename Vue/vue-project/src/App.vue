<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
      <div>
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">TFG</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav">
              <li class="nav-item">
                <RouterLink class="nav-link" aria-current="page" to="/trasformaciones">Transformaciones</RouterLink>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Luces
                </a>
                <ul class="dropdown-menu">
                  <li><RouterLink class="dropdown-item" to="/luzAmbiental">Ambiental</RouterLink></li>
                  <li><RouterLink class="dropdown-item" to="/luzDireccional">Direccional</RouterLink></li>
                  <li><RouterLink class="dropdown-item" to="/luzPuntual">Puntual</RouterLink></li>
                  <li><RouterLink class="dropdown-item" to="/luzFoco">Foco</RouterLink></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      </div>
  </header>

  <main id="algo" class="container">

    <RouterView />

  </main>
</template>
