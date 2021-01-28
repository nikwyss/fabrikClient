<template>

  <div class=" full-width text-primary  bg-white shadow-up-1">
  <!-- Footer  -->
  <!-- bg-blue-grey-2 -->
  <!-- style="border-top: 1px solid black" -->
    <br><br>
    <br>
    <q-page class="doc_content">

      <div class="q-col-gutter-md row items-start">

        <div class="col-4 q-pr-xl">
          <!-- {{ $t('app.name') }} {{ $t('app.version') }} <br> -->
          <b>Impressum:</b><br>
          Année Politique Suisse<br>
          Institut für Politikwissenschaft<br>
          Universität Bern<br>
          Fabrikstrasse 8<br>
          CH-3012 Bern<br>
          Tel. +41 (0)31 631 83 31<br>
          Fax +41 (0)31 631 48 17<br>

        </div>

        <div class="col-2">
          <a href="https://anneepolitique.swiss" target="_blank" alt="Année Politique Suisse">
          <q-img
            src='layout/logoaps.png'
            :ratio="1"
            contain
            class="q-ma-sm"
            style="width: 80%;"
          >
          <q-tooltip><b>Année Politique Suisse:</b> Projektlead; <br>Am Institut für Politikwissenschaft der <br>Universität Bern angesiedelt.</q-tooltip>
          </q-img>
          </a>

        </div>

        <div class="col-2">
          <a href='https://www.politools.net' target="_blank" alt="Politools">
          <q-img
            src='layout/logopolitools.png'
            :ratio="1"
            contain
            class="q-ma-sm"
            style="width: 70%;"
          >
            <q-tooltip><b>Politools:</b> Projektpartner <br>und Betreiberin der <br>Online-Wahlhilfe Smartvote. <br>Politools ist ebenfalls in Bern zu Hause.</q-tooltip>
          </q-img>
          </a>
        </div>

        <!-- <div class="col-2">
          <q-img
            src='layout/logounibe.png'
            :ratio="1"
            contain
            class="q-ma-sm"
            style="width: 80%;"
          ></q-img>
        </div> -->

        <div class="col-2">
          <a href="http://www.snf.ch" target="_blank" alt="Schweizer Nationalfonds">
          <q-img
            src='layout/logosnf.png'
            :ratio="1"
            contain
            class="q-ma-sm"
            style="width: 80%;"
          >
            <q-tooltip><b>Schweizer Nationalfonds:</b> Gewährleistet die <br>Finanzierung des Projektes.</q-tooltip>
           </q-img>
          </a>
        </div>

      </div>

    </q-page>
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>