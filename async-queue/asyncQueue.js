// A thoughtful implementation of this queue could be used for to process general async operations and do error handling with custom error objects.
class AsyncQueue {
  constructor(concurrency=3) {
    this.concurrency = concurrency;
    this.queue = [];
    this.active = 0;
  }

  async add(request) {
    return new Promise((resolve, reject) => {
      const task = async () => {
        console.log('Task in queue')
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          console.error(`Error processesing request: ${error}`);
          reject(result);
        } finally {
          this.active--;
          this.processQueue();
        }
      }
      this.queue.push(task);
      this.processQueue();
    })
  }

  processQueue() {
    while (this.active < this.concurrency && this.queue.length > 0) {
      console.log('Processing Task...')
      const task = this.queue.shift();
      this.active++;
      task();
    }
  }
}

//----------------------------------------------[ TESTS ]----------------------------------------------
const queue = new AsyncQueue(2);

function dummyRequest(id, delay) {
  return () => new Promise((resolve) => setTimeout(() => resolve(`Request ${id} completed!`), delay));
}

async function testExample() {
  console.log('Starting request batch...');
  const results = await Promise.allSettled([
    queue.add(dummyRequest(1, 2000)),
    queue.add(dummyRequest(2, 1000)),
    queue.add(dummyRequest(3, 3000)),
    queue.add(dummyRequest(4, 1500)),
    queue.add(dummyRequest(5, 2500)),
  ]);

  console.log('Request batch completed.');
  results.forEach((result) => console.log(result));
}

testExample();
