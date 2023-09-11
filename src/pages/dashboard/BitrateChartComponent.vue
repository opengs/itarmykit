<template>
    <VueApexCharts
        width="100%"
        height="400"
        type="line"
        :options="options"
        :series="series"
    />
</template>

<script lang="ts" setup>
import VueApexCharts from 'vue3-apexcharts'

const options = {
        chart: {
          id: 'vuechart-example'
        },
        xaxis: {
          categories: [1800, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
        }
      }

const series = [{
        name: 'series-1',
        data: [30, 40, 45, 50, 49, 60, 70, 91]
      }]

</script>