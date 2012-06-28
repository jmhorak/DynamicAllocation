/**
 * Functions for choosing an allocation size
 * Author: Jeff Horak
 * Date: 6/28/12
 */

/*global MemSim */

MemSim.allocations = {
  s2Opt: (function() {
    // Represent probability using an array 32 long
    var ret = new Array(32),
        i;

    // .5 probability of picking 1, add 16 1's
    for (i = 0; i < 16; i++) {
      ret[i] = 1;
    }

    // .25 probability of picking 2
    for (; i < 24; i++) {
      ret[i] = 2;
    }

    // .125 probability of picking 4
    for (; i < 28; i++) {
      ret[i] = 4;
    }

    // .0625 probability of picking 8
    for (; i < 30; i++) {
      ret[i] = 8;
    }

    // .03125 probability of picking 16
    ret[i++] = 16;

    // .03125 probability of picking 32
    ret[i] = 32;

    return ret;
  })(),

  s3Opt: [10, 12, 14, 16, 18, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200, 250, 500, 1000, 2000, 3000, 4000],

  // (S1) - An integer chosen uniformly between 100 and 2000
  s1: function() {
    return MemSim.randomInteger(100, 2000);
  },

  // (S2) - [1, 2, 4, 8, 16, 32] chosen with probability (.5, .25, .125, .0625, .03125, .03125)
  s2: function() {
    var mem = MemSim.allocations;
    return mem.s2Opt[MemSim.randomInteger(0, mem.s2Max)];
  },

  // (S3) - [10, 12, 14, 16, 18, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200, 250, 500, 1000, 2000, 3000, 4000]
  s3: function() {
    var mem = MemSim.allocations;
    return mem.s3Opt[MemSim.randomInteger(0, mem.s3Max)];
  }
};

MemSim.allocations.s2Max = MemSim.allocations.s2Opt.length - 1;
MemSim.allocations.s3Max = MemSim.allocations.s3Opt.length - 1;
