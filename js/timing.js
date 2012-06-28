/**
 * Timing functions used to determine how long before freeing an allocation
 * Author: Jeff Horak
 * Date: 6/28/12
 */

/*global MemSim */

MemSim.timing = {
  // (T1) - 0 - 10 ms
  t1: function() {
    return MemSim.randomInteger(0, 10);
  },

  // (T2) - 0 - 100 ms
  t2: function() {
    return MemSim.randomInteger(0, 100);
  },

  // (T3) - 0 - 1000 ms
  t3: function() {
    return MemSim.randomInteger(0, 1000);
  }
};
