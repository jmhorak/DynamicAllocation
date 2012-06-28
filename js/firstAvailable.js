/**
 * Memory allocation scheme favoring fitting in the first available spot
 * Author: Jeff Horak
 * Date: 6/27/12
 */

/*global MemSim, console */

MemSim.Node = function(size, location) {
  this.location = location;
  this.size = size;
};

MemSim.strategies.FirstAvailable = function(memSize) {

  this.allocated = 0;
  this.nodes = [];
  this.memSize = memSize;

  // Initialize memory with a single large memory block
  this.nodes.push(new MemSim.Node(memSize, 0));
};

MemSim.strategies.FirstAvailable.prototype.allocateMemory = function(size) {
  // Search through available memory and find the first available block with enough space
  var nodes = this.nodes,
      i = 0,
      len = nodes.length,
      node,
      oldLocation;

  if (size < 1) {
    throw 'Invalid memory allocation size';
  }

  for (; i < len; i++) {
    node = nodes[i];
    // This is a suitable block
    if ( node.size > size ) {
      // Resize the available block
      node.size -= size;
      oldLocation = node.location;
      node.location += size;
      this.allocated += size;
      break;
    }
  }

  if (i === len) {
    MemSim.dumpMemory();
    throw 'No suitable blocks large enough to fit ' + size + ' in available the memory';
  }

  // Return a newly allocated node
  return new MemSim.Node(size, oldLocation);
};

MemSim.strategies.FirstAvailable.prototype.freeMemory = function(node) {
  // Find where the newly freed node goes in the sorted node list
  var nodes = this.nodes,
      len = nodes.length,
      low = 0,
      high = len-1,
      mid = Math.floor(high/2),
      midNode = nodes[mid] || {},
      midLocation = midNode.location,
      nodeLocation = node.location,
      nodeSize = node.size,
      insertIndex,
      mergeNode,
      didMerge = false;

  if ( len === 0 ) {
    // The list is empty, add this single item
    nodes.push(node);

  } else if ( nodes[low].location > nodeLocation ) {
    // This should be the first item in the list
    // Check if we can merge with the previous first item
    mergeNode = nodes[0];

    if ( nodeLocation + nodeSize === mergeNode.location ) {
      // We can merge these together
      mergeNode.location = nodeLocation;
      mergeNode.size += nodeSize;

    } else {
      // Add the node as the first element
      nodes.unshift(node);
    }

  } else if ( nodes[high].location < nodeLocation ) {
    // This should be the last item in the list
    // Check if we can merge with the previous last item
    mergeNode = nodes[high];

    if ( nodeLocation - mergeNode.size === mergeNode.location ) {
      // We can merge these together
      mergeNode.size += nodeSize;

    } else {
      // Add this node as the last element
      nodes.push(node);
    }

  } else {

    // Doing a binary search for an insert position
    while ( high - low > 1 ) {
      if ( nodeLocation > midLocation ) {
        low = mid;
      } else if ( nodeLocation < midLocation ) {
        high = mid;
      } else {
        // node's location equals mid, should not happen
        throw 'Node already in the free memory list';
      }

      mid = Math.floor((high+low)/2);
      midLocation = nodes[mid].location;
    }

    mid = high;

    // Can this node be merged with the previous item?
    mergeNode = nodes[mid-1];

    if (nodeLocation - mergeNode.size === mergeNode.location) {
      mergeNode.size += nodeSize;

      nodeLocation = mergeNode.location;
      nodeSize = mergeNode.size;

      didMerge = true;
    }

    // Can this node be merged with the next item
    mergeNode = nodes[mid];

    if (nodeLocation + nodeSize === mergeNode.location) {

      if (didMerge) {
        // Remove the old item
        nodes.splice(mid-1, 1);
      }

      mergeNode.location = nodeLocation;
      mergeNode.size += nodeSize;

      didMerge = true;
    }

    if (!didMerge) {
      // Insert into the list at mid
      nodes.splice(mid, 0, node);
    }
  }

  this.allocated -= node.size;
};
