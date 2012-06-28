/**
 * Dynamic Storage Allocation using the Buddy System
 * User: Jeff Horak
 * Date: 6/25/12
 */

/*global MemSim, console */

MemSim.strategies.Buddy = function(memSize) {

  this.nodes = [];
  this.allocated = 0;
  this.memSize = memSize;

  // Initialize with one giant node
  this.nodes.push( new MemSim.BuddyNode({ parent: null, size: memSize, location: 0 }));
};

MemSim.strategies.Buddy.prototype.allocateMemory = function(size) {

  var nodes = this.nodes,
      i = 0,
      len = nodes.length,
      node,
      allocNodes;

  if (size < 1) {
    throw 'Invalid memory allocation size';
  }

  // Find the first node in the nodes list that can handle this size item
  for (; i < len; i++) {
    if ( nodes[i].size >= size ) {
      break;
    }
  }

  if (i === len) {
    MemSim.dumpMemory();
    throw 'No suitable blocks large enough to fit ' + size + ' in available the memory';
  }

  // Remove the large block from the node array
  node = nodes.splice(i, 1)[0];

  // Split the memory up into the smallest amount to hold the item
  while ( node.size/2 > size ) {
    allocNodes = node.split();
    node = allocNodes.left;

    // Push the un-used portion into the available node list
    nodes.push(allocNodes.right);
  }

  this.allocated += node.size;
  return node.allocate();
};

MemSim.strategies.Buddy.prototype.freeMemory = function(node) {

  var nodes = this.nodes,
      freeNodes,
      i,
      len,
      foundBuddy;

  this.allocated -= node.size;
  node.free();

  // Look to merge memory blocks
  while (node.canMergeWithBuddy()) {

    // Do the merge
    freeNodes = node.mergeWithBuddy();
    node = freeNodes.node;

    // Remove blocks from the available node list, they are being merged together
    for (i = 0, len = nodes.length; i < len; i++) {
      // Found the item to remove
      if (nodes[i].location === freeNodes.buddy.location) {
        nodes.splice(i, 1);
        break;
      }
    }
  }

  // Add the final merged node to the node list
  nodes.push(node);
};

MemSim.BuddyNode = function(data) {
  this.leftChild = null;
  this.rightChild = null;
  this.parent = data.parent;
  this.size = data.size;
  this.location = data.location;
  this.isAvailable = true;
};

MemSim.BuddyNode.prototype.allocate = function() {

  var node = this;
  while (node && node.isAvailable) {
    node.isAvailable = false;
    node = node.parent;
  }

  return this;
};

MemSim.BuddyNode.prototype.free = function() {
  this.isAvailable = true;
  return this;
};

MemSim.BuddyNode.prototype.split = function() {
  var newSize = this.size/2;
  if (this.size === 0) { throw 'Cannot split the atom'; }

  this.leftChild = new MemSim.BuddyNode({ parent: this, size: newSize, location: this.location });
  this.rightChild = new MemSim.BuddyNode({ parent: this, size: newSize, location: this.location + newSize });

  return { left: this.leftChild, right: this.rightChild };
};

MemSim.BuddyNode.prototype._canMerge = function() {
  var leftChild = this.leftChild || {},
      rightChild = this.rightChild || {};

   return leftChild.isAvailable && rightChild.isAvailable;
};

MemSim.BuddyNode.prototype.canMergeWithBuddy = function() {
  // No parent implies this is the root node
  if (!this.parent) {
    return false;
  }

  // Determine if the parent can merge the two children
  return this.parent._canMerge();
};

MemSim.BuddyNode.prototype._merge = function() {
  var ret = {
    left: this.leftChild,
    right: this.rightChild
  };

  if (!this._canMerge()) {
    throw 'Children have not been freed';
  }

  this.leftChild = null;
  this.rightChild = null;
  this.isAvailable = true;

  return ret;
};

MemSim.BuddyNode.prototype.mergeWithBuddy = function() {
  var mergedItems = this.parent._merge(),
      ret = {
        node: this.parent
      };

  if (mergedItems.left === this) {
    ret.buddy = mergedItems.right;
  } else {
    ret.buddy = mergedItems.left;
  }

  return ret;
};
