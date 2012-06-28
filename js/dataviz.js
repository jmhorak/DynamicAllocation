/**
 * Data visualization component of the Dynamic Storage Allocator
 * Author: Jeff Horak
 * Date: 6/27/12
 */

/*global MemSim, Highcharts */

MemSim.dataViz.AllocationGraph = function(el, statFn) {
  return new Highcharts.Chart({
    chart: {
      animation: false,
      renderTo: el,
      type: 'line',
      marginRight: 10,
      events: {
        load: function() {
          // Set up the updating of the chart for every 500 milliseconds
          var allocSeries = this.series[0],
              availSeries = this.series[1];

          setInterval(function() {
            var x = (new Date()).getTime(),
                y = statFn();

            allocSeries.addPoint([x, y.allocated], true, allocSeries.data.length > 50);
            availSeries.addPoint([x, y.available], true, availSeries.data.length > 50);

          }, 500);
        }
      }
    },
    xAxis: {
      type: 'datetime',
      tickPixelInterval: 150
    },

    yAxis: {
      plotLines: [{
        value: 0,
        width: 1,
        color: '#808080'
      }]
    },
    title: {
      text: 'Available and Allocated Memory'
    },
    legend: {
      enabled: false
    },
    exporting: {
      enabled: false
    },
    series: [
      {
        name: 'Allocation',
        data: []
      },
      {
        name: 'Available',
        data: []
      }
    ]
  });
};

MemSim.dataViz.FragmentationGraph = function(el, statFn) {
  return new Highcharts.Chart({
    chart: {
      animation: false,
      renderTo: el,
      type: 'line',
      marginRight: 10,
      events: {
        load: function() {
          // Set up the updating of the chart for every 500 milliseconds
          var fragmentationSeries = this.series[0];

          setInterval(function() {
            var x = (new Date()).getTime(),
                y = statFn();

            fragmentationSeries.addPoint([x, y.fragmentation], true, fragmentationSeries.data.length > 50);

          }, 500);
        }
      }
    },
    xAxis: {
      type: 'datetime',
      tickPixelInterval: 150
    },

    yAxis: {
      plotLines: [{
        value: 0,
        width: 1,
        color: '#808080'
      }]
    },
    title: {
      text: 'Memory Fragmentation'
    },
    legend: {
      enabled: false
    },
    exporting: {
      enabled: false
    },
    series: [{
        name: 'Fragmentation',
        data: []
    }]
  });
};
