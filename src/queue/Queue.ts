export default class Queue {
  queue: any[];
  constructor() {
    this.queue = [];
  }

  enqueue(element: any) {
    this.queue.push(element);
    return this.queue;
  }

  dequeue() {
    return this.queue.shift();
  }

  peek() {
    return this.queue[0];
  }

  reverse() {
    const reversed = [];
    while (this.queue.length > 0) {
      reversed.push(this.queue.pop());
    }
    this.queue = reversed;
    return this.queue;
  }
}
