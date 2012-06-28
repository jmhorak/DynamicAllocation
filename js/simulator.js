/**
 * Dynamic Memory Allocator Simulation
 * Author: Jeff Horak
 * Date: 6/27/2012
 */

/*global MemSim, $, Highcharts, console*/

MemSim.dumpMemory = function() {
  var active = MemSim.active,
      i = 0,
      len = active.nodes.length,
      node;

  console.log('Total memory size is ' + active.memSize);
  console.log('Total allocated size is ' + active.allocated);

  console.log('=============================');

  active.nodes.sort(function(a, b) {
    return a.location - b.location;
  });

  for (; i < len; i++) {
    node = active.nodes[i];

    console.log('Loc: ' + node.location + '\t\tSize: ' + node.size);
  }

  console.log('=============================');
};

MemSim.memoryStatistics = function() {
  var active = MemSim.active,
      allocated = active.allocated;
  return {
    allocated: allocated,
    available: active.memSize - allocated,
    fragmentation: active.nodes.length
  };
};

MemSim.randomInteger = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

MemSim.totalAllocations = 0;

MemSim.doSimulation = function() {
  // Get a random size and a random lifetime
  var active = MemSim.active,
      size = active.getAllocationSize(),
      time = active.getTiming(),
      mem = active.allocateMemory(size);

  MemSim.totalAllocations++;

  setTimeout(function() {
    active.freeMemory(mem);
  }, time);

  $('#allocationCount').text(MemSim.totalAllocations);

  // Give time to event loop
  setTimeout(MemSim.doSimulation, MemSim.randomInteger(1, 5));
};


$(document).ready(function() {
  var totalMemory = Math.pow(2, 16),
      active;

  $('#memorySize').text(totalMemory);

  Highcharts.setOptions({
      global: {
          useUTC: false
      }
  });

  active = new MemSim.strategies.FirstAvailable(totalMemory);
  active.getAllocationSize = MemSim.allocations.s1;
  active.getTiming = MemSim.timing.t2;
  active.allocationGraph = MemSim.dataViz.AllocationGraph('allocationGraph', MemSim.memoryStatistics);
  active.fragmentationGraph = MemSim.dataViz.FragmentationGraph('fragmentationGraph', MemSim.memoryStatistics);

  MemSim.active = active;

  // Start the simulation
  MemSim.doSimulation();

});
