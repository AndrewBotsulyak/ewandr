import { bootstrapWorker } from '@vendure/core';
import { workerConfig } from './worker-config';

bootstrapWorker(workerConfig)
  .then(worker => worker.startJobQueue())
  .catch(err => {
    console.log('Worker bootstrap error:', err);
    process.exit(1);
  });
